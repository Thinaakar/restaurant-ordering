/** Firestore write helpers (create, update, delete). */

import { FieldValue } from "firebase-admin/firestore";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { appCollection } from "@/lib/firebase/collections";
import { stripUndefined } from "@/lib/firestore/helpers";
import { hashPassword } from "@/lib/auth/password";
import type {
  RestaurantTable,
  MenuItem,
  Order,
  ManagedUser,
  Role,
  TableStatus,
  OrderStatus,
  PaymentStatus,
} from "@/data/types";
import type { AdminAccountRecord } from "@/lib/firestore/app-data";

function col(table: string) {
  return appCollection(getAdminFirestore(), table);
}

// ── Admin accounts ────────────────────────────────────────────

export async function upsertAdminAccount(input: {
  email: string;
  password: string;
  name: string;
  role: AdminAccountRecord["role"];
  avatar?: string;
}): Promise<void> {
  const email = input.email.toLowerCase();
  const existing = await col("admin_accounts")
    .where("email", "==", email)
    .limit(1)
    .get();
  const payload = stripUndefined({
    email,
    passwordHash: hashPassword(input.password),
    name: input.name,
    role: input.role,
    avatar: input.avatar,
    updatedAt: FieldValue.serverTimestamp(),
  });
  if (existing.empty) {
    await col("admin_accounts").add({
      ...payload,
      createdAt: FieldValue.serverTimestamp(),
    });
  } else {
    await existing.docs[0].ref.set(payload, { merge: true });
  }
}

// ── Tables ────────────────────────────────────────────────────

export async function createTable(input: {
  number: number;
  seats: number;
  floor: number;
  status?: TableStatus;
}): Promise<RestaurantTable> {
  const ref = col("tables").doc();
  const status = input.status ?? "available";
  await ref.set({
    number: input.number,
    seats: input.seats,
    floor: input.floor,
    status,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return {
    id: ref.id,
    number: input.number,
    seats: input.seats,
    floor: input.floor,
    status,
  };
}

export async function updateTable(
  id: string,
  input: Partial<RestaurantTable>,
): Promise<RestaurantTable | null> {
  const ref = col("tables").doc(id);
  const patch: Record<string, unknown> = {
    updatedAt: FieldValue.serverTimestamp(),
  };
  if (input.number !== undefined) patch.number = input.number;
  if (input.seats !== undefined) patch.seats = input.seats;
  if (input.floor !== undefined) patch.floor = input.floor;
  if (input.status !== undefined) patch.status = input.status;
  if (input.currentOrderId !== undefined)
    patch.currentOrderId = input.currentOrderId;
  else if ("currentOrderId" in input)
    patch.currentOrderId = FieldValue.delete();
  await ref.set(patch, { merge: true });
  const doc = await ref.get();
  if (!doc.exists) return null;
  const d = doc.data()!;
  return {
    id: doc.id,
    number: d.number,
    seats: d.seats,
    status: d.status,
    floor: d.floor,
    ...(d.currentOrderId ? { currentOrderId: d.currentOrderId } : {}),
  } as RestaurantTable;
}

export async function deleteTable(id: string): Promise<boolean> {
  await col("tables").doc(id).delete();
  return true;
}

// ── Menu ──────────────────────────────────────────────────────

export async function createMenuItem(
  input: Omit<MenuItem, "id">,
): Promise<MenuItem> {
  const ref = col("menu_items").doc();
  await ref.set({
    ...input,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return { id: ref.id, ...input };
}

export async function updateMenuItem(
  id: string,
  input: Partial<MenuItem>,
): Promise<MenuItem | null> {
  const ref = col("menu_items").doc(id);
  await ref.set(
    {
      ...stripUndefined(input as Record<string, unknown>),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
  const doc = await ref.get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as MenuItem;
}

export async function deleteMenuItem(id: string): Promise<boolean> {
  await col("menu_items").doc(id).delete();
  return true;
}

// ── Orders ────────────────────────────────────────────────────

export async function createOrder(input: {
  tableId: string;
  tableNumber: number;
  items: Order["items"];
  notes?: string;
}): Promise<Order> {
  const subtotal = input.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = Math.round(subtotal * 0.05 * 100) / 100;
  const total = subtotal + tax;
  const ref = col("orders").doc();
  const order: Omit<Order, "id"> = {
    tableId: input.tableId,
    tableNumber: input.tableNumber,
    items: input.items,
    status: "pending",
    paymentStatus: "pending",
    subtotal,
    tax,
    total,
    notes: input.notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await ref.set({
    ...order,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  await updateTable(input.tableId, {
    status: "occupied",
    currentOrderId: ref.id,
  });
  return { id: ref.id, ...order };
}

export async function updateOrder(
  id: string,
  input: Partial<Order>,
): Promise<Order | null> {
  const ref = col("orders").doc(id);
  const existing = await ref.get();
  if (!existing.exists) return null;
  const prev = existing.data() as Order;
  let items = input.items ?? prev.items;
  let subtotal = prev.subtotal;
  let tax = prev.tax;
  let total = prev.total;
  if (input.items) {
    subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    tax = Math.round(subtotal * 0.05 * 100) / 100;
    total = subtotal + tax;
  }
  const status = input.status ?? prev.status;
  await ref.set(
    stripUndefined({
      status: input.status,
      paymentStatus: input.paymentStatus,
      items: input.items,
      notes: input.notes,
      subtotal,
      tax,
      total,
      updatedAt: FieldValue.serverTimestamp(),
    }),
    { merge: true },
  );
  if (status === "completed" && prev.tableId) {
    await updateTable(prev.tableId, {
      status: "cleaning",
      currentOrderId: undefined,
    });
  }
  const doc = await ref.get();
  const d = doc.data()!;
  return {
    ...d,
    id: doc.id,
    createdAt:
      typeof d.createdAt === "string" ? d.createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as Order;
}

export async function deleteOrder(id: string): Promise<boolean> {
  const order = await col("orders").doc(id).get();
  if (order.exists) {
    const d = order.data();
    if (d?.tableId) {
      await updateTable(d.tableId as string, {
        status: "available",
        currentOrderId: undefined,
      });
    }
  }
  await col("orders").doc(id).delete();
  return true;
}

// ── Managed users ─────────────────────────────────────────────

export async function createManagedUser(
  input: Omit<ManagedUser, "id" | "createdAt" | "updatedAt">,
): Promise<ManagedUser> {
  const ref = col("managed_users").doc();
  const now = new Date().toISOString();
  await ref.set({
    ...input,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return { id: ref.id, ...input, createdAt: now, updatedAt: now };
}

export async function updateManagedUser(
  id: string,
  input: Partial<ManagedUser>,
): Promise<ManagedUser | null> {
  const ref = col("managed_users").doc(id);
  await ref.set(
    stripUndefined({
      ...input,
      updatedAt: FieldValue.serverTimestamp(),
    } as Record<string, unknown>),
    { merge: true },
  );
  const doc = await ref.get();
  if (!doc.exists) return null;
  const d = doc.data()!;
  return {
    ...d,
    id: doc.id,
    createdAt: d.createdAt?.toString?.() ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as ManagedUser;
}

export async function deleteManagedUser(id: string): Promise<boolean> {
  await col("managed_users").doc(id).delete();
  return true;
}

// ── Roles ─────────────────────────────────────────────────────

export async function createRole(
  input: Omit<Role, "id" | "name" | "color" | "isSystem"> & {
    name?: string;
    color?: string;
  },
): Promise<Role> {
  const ref = col("roles").doc();
  const name = input.name ?? input.label.toLowerCase().replace(/\s+/g, "_");
  const role: Role = {
    id: ref.id,
    name,
    label: input.label,
    description: input.description,
    permissions: input.permissions,
    color: input.color ?? "blue",
    status: input.status,
    isSystem: false,
  };
  await ref.set(role);
  return role;
}

export async function updateRole(
  id: string,
  input: Partial<Role>,
): Promise<Role | null> {
  const ref = col("roles").doc(id);
  const existing = await ref.get();
  if (!existing.exists) return null;
  const prev = existing.data() as Role;
  const merged = { ...prev, ...input, id };
  if (prev.isSystem) {
    merged.name = prev.name;
  }
  await ref.set(stripUndefined(merged as Record<string, unknown>), {
    merge: true,
  });
  const doc = await ref.get();
  return doc.data() as Role;
}

export async function updateRolePermissions(
  id: string,
  permissions: string[],
): Promise<Role | null> {
  return updateRole(id, { permissions });
}

export async function deleteRole(id: string): Promise<boolean> {
  const role = await col("roles").doc(id).get();
  if (!role.exists) return false;
  if ((role.data() as Role).isSystem) return false;
  await col("roles").doc(id).delete();
  return true;
}

// ── Settings ──────────────────────────────────────────────────

export async function updateSettings(
  payload: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  await col("settings")
    .doc("default")
    .set({ payload, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
  return payload;
}

// ── Clear operational data (dashboard starts at zero) ───────

const OPERATIONAL_TABLES = [
  "orders",
  "tables",
  "menu_items",
  "managed_users",
  "roles",
] as const;

async function deleteAllInCollection(tableKey: string): Promise<number> {
  const db = getAdminFirestore();
  const snapshot = await col(tableKey).get();
  if (snapshot.empty) return 0;

  const batchSize = 400;
  let deleted = 0;
  const docs = snapshot.docs;

  for (let i = 0; i < docs.length; i += batchSize) {
    const batch = db.batch();
    docs.slice(i, i + batchSize).forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    deleted += Math.min(batchSize, docs.length - i);
  }

  return deleted;
}

/** Removes tables, menu, orders, users, and roles. Keeps admin login accounts. */
export async function clearOperationalData(): Promise<Record<string, number>> {
  const { clearDemoHiddenSampleIds } = await import("@/lib/demo/hidden-samples");
  const result: Record<string, number> = {};
  for (const tableKey of OPERATIONAL_TABLES) {
    result[tableKey] = await deleteAllInCollection(tableKey);
  }
  await clearDemoHiddenSampleIds();
  return result;
}

// ── Seed batch writes ─────────────────────────────────────────

export async function seedDocument(
  tableKey: string,
  id: string,
  data: Record<string, unknown>,
): Promise<void> {
  await col(tableKey).doc(id).set(data, { merge: true });
}
