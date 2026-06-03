/** Firestore read helpers (list, get, aggregates). */

import type { Firestore } from 'firebase-admin/firestore';
import { getAdminFirestore } from '@/lib/firebase/admin';
import { appCollection } from '@/lib/firebase/collections';
import { toIsoString } from '@/lib/firestore/helpers';
import type {
  RestaurantTable,
  MenuItem,
  Order,
  ManagedUser,
  Role,
  AnalyticsSummary,
  AdminAccountRole,
} from '@/data/types';
import { hashPassword } from '@/lib/auth/password';

function db(): Firestore {
  return getAdminFirestore();
}

function docData<T>(id: string, data: Record<string, unknown>): T {
  return { id, ...data } as T;
}

// ── Admin accounts (auth) ─────────────────────────────────────

export interface AdminAccountRecord {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: AdminAccountRole;
  avatar?: string;
}

export async function getAdminAccountByEmail(email: string): Promise<AdminAccountRecord | null> {
  const snap = await appCollection(db(), 'admin_accounts')
    .where('email', '==', email.toLowerCase())
    .limit(1)
    .get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return docData<AdminAccountRecord>(doc.id, doc.data());
}

// ── Tables ────────────────────────────────────────────────────

export async function listTables(): Promise<RestaurantTable[]> {
  const snap = await appCollection(db(), 'tables').orderBy('number').get();
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      number: data.number,
      seats: data.seats,
      status: data.status,
      floor: data.floor,
      ...(data.currentOrderId ? { currentOrderId: data.currentOrderId } : {}),
    } as RestaurantTable;
  });
}

export async function getTable(id: string): Promise<RestaurantTable | null> {
  const doc = await appCollection(db(), 'tables').doc(id).get();
  if (!doc.exists) return null;
  const data = doc.data()!;
  return {
    id: doc.id,
    number: data.number,
    seats: data.seats,
    status: data.status,
    floor: data.floor,
    ...(data.currentOrderId ? { currentOrderId: data.currentOrderId } : {}),
  } as RestaurantTable;
}

// ── Menu ──────────────────────────────────────────────────────

export async function listMenuItems(): Promise<MenuItem[]> {
  const snap = await appCollection(db(), 'menu_items').get();
  return snap.docs.map((d) => docData<MenuItem>(d.id, d.data() as Record<string, unknown>));
}

export async function getMenuItem(id: string): Promise<MenuItem | null> {
  const doc = await appCollection(db(), 'menu_items').doc(id).get();
  if (!doc.exists) return null;
  return docData<MenuItem>(doc.id, doc.data() as Record<string, unknown>);
}

// ── Orders ────────────────────────────────────────────────────

export async function listOrders(): Promise<Order[]> {
  const snap = await appCollection(db(), 'orders').orderBy('createdAt', 'desc').get();
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      ...data,
      id: d.id,
      createdAt: toIsoString(data.createdAt),
      updatedAt: toIsoString(data.updatedAt),
    } as Order;
  });
}

export async function getOrder(id: string): Promise<Order | null> {
  const doc = await appCollection(db(), 'orders').doc(id).get();
  if (!doc.exists) return null;
  const data = doc.data()!;
  return {
    ...data,
    id: doc.id,
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
  } as Order;
}

// ── Managed users ─────────────────────────────────────────────

export async function listManagedUsers(): Promise<ManagedUser[]> {
  const snap = await appCollection(db(), 'managed_users').get();
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      ...data,
      id: d.id,
      createdAt: toIsoString(data.createdAt),
      updatedAt: toIsoString(data.updatedAt),
    } as ManagedUser;
  });
}

export async function getManagedUser(id: string): Promise<ManagedUser | null> {
  const doc = await appCollection(db(), 'managed_users').doc(id).get();
  if (!doc.exists) return null;
  const data = doc.data()!;
  return {
    ...data,
    id: doc.id,
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt),
  } as ManagedUser;
}

export async function countUsersByRole(roleName: string): Promise<number> {
  const users = await listManagedUsers();
  return users.filter((u) => u.role === roleName).length;
}

// ── Roles ─────────────────────────────────────────────────────

export async function listRoles(): Promise<Role[]> {
  const snap = await appCollection(db(), 'roles').get();
  return snap.docs.map((d) => docData<Role>(d.id, d.data()));
}

export async function getRole(id: string): Promise<Role | null> {
  const doc = await appCollection(db(), 'roles').doc(id).get();
  if (!doc.exists) return null;
  return docData<Role>(doc.id, doc.data() as Record<string, unknown>);
}

// ── Settings ──────────────────────────────────────────────────

export async function getSettings(): Promise<Record<string, unknown> | null> {
  const doc = await appCollection(db(), 'settings').doc('default').get();
  if (!doc.exists) return null;
  const data = doc.data();
  return (data?.payload as Record<string, unknown>) ?? null;
}

// ── Analytics ─────────────────────────────────────────────────

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const [orders, tables] = await Promise.all([listOrders(), listTables()]);
  const completed = orders.filter((o) => o.status === 'completed');
  const active = orders.filter((o) => o.status !== 'completed');
  const paid = orders.filter((o) => o.paymentStatus === 'paid' || o.status === 'completed');
  const totalRevenue = paid.reduce((s, o) => s + o.total, 0);
  const today = new Date().toDateString();
  const todayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === today);
  const todayRevenue = todayOrders
    .filter((o) => o.paymentStatus === 'paid' || o.status === 'completed')
    .reduce((s, o) => s + o.total, 0);

  return {
    totalOrders: orders.length,
    activeOrders: active.length,
    completedOrders: completed.length,
    totalRevenue,
    availableTables: tables.filter((t) => t.status === 'available').length,
    occupiedTables: tables.filter((t) => t.status === 'occupied').length,
    todayRevenue,
    todayOrders: todayOrders.length,
    averageOrderValue: orders.length ? totalRevenue / orders.length : 0,
    revenueGrowth: 0,
    orderGrowth: 0,
  };
}

// ── Seed helpers ──────────────────────────────────────────────

export async function isCollectionEmpty(tableKey: string): Promise<boolean> {
  const snap = await appCollection(db(), tableKey).limit(1).get();
  return snap.empty;
}
