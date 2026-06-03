import { FieldValue } from "firebase-admin/firestore";
import { ensureAppTables } from "@/lib/firebase/collections";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { isCollectionEmpty } from "@/lib/firestore/app-data";
import { seedDocument, upsertAdminAccount } from "@/lib/firestore/app-writes";
import {
  SEED_TABLES,
  SEED_MENU_ITEMS,
  SEED_ORDERS,
  SEED_USERS,
  SEED_ROLES,
} from "@/data/seed-data";
import {
  DEMO_ADMIN_EMAIL,
  DEMO_ADMIN_PASSWORD,
  DEMO_SUPER_ADMIN_EMAIL,
  DEMO_SUPER_ADMIN_PASSWORD,
} from "@/lib/constants";

export async function seedDatabaseIfEmpty(): Promise<{
  seeded: boolean;
  message: string;
}> {
  const db = getAdminFirestore();
  await ensureAppTables(db);

  const tablesEmpty = await isCollectionEmpty("tables");
  if (!tablesEmpty) {
    return { seeded: false, message: "Database already has data" };
  }

  for (const t of SEED_TABLES) {
    const { id, ...rest } = t;
    await seedDocument("tables", id, {
      ...rest,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  for (const m of SEED_MENU_ITEMS) {
    const { id, ...rest } = m;
    await seedDocument("menu_items", id, {
      ...rest,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  for (const o of SEED_ORDERS) {
    const { id, createdAt, updatedAt, ...rest } = o;
    await seedDocument("orders", id, {
      ...rest,
      createdAt,
      updatedAt,
    });
  }

  for (const u of SEED_USERS) {
    const { id, createdAt, updatedAt, ...rest } = u;
    await seedDocument("managed_users", id, {
      ...rest,
      createdAt,
      updatedAt,
    });
  }

  for (const r of SEED_ROLES) {
    const { id, ...rest } = r;
    await seedDocument("roles", id, rest);
  }

  await ensureDemoAdminAccounts();

  return {
    seeded: true,
    message: "Seeded tables, menu, orders, users, roles, and admin accounts",
  };
}

/** Upserts demo logins so credentials stay in sync after rebrand or salt changes. */
export async function ensureDemoAdminAccounts(): Promise<void> {
  await upsertAdminAccount({
    email: DEMO_SUPER_ADMIN_EMAIL,
    password: DEMO_SUPER_ADMIN_PASSWORD,
    name: "Super Administrator",
    role: "super_admin",
    avatar: "👑",
  });

  await upsertAdminAccount({
    email: DEMO_ADMIN_EMAIL,
    password: DEMO_ADMIN_PASSWORD,
    name: "Executive Chef & Admin",
    role: "admin",
    avatar: "👨‍🍳",
  });
}
