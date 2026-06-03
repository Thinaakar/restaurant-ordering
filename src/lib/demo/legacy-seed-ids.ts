import {
  SEED_TABLES,
  SEED_MENU_ITEMS,
  SEED_ORDERS,
  SEED_USERS,
  SEED_ROLES,
} from "@/data/seed-data";

/** Firestore ids from initial DB seed — hidden in demo lists unless explicitly tracked. */
export const LEGACY_SEED_IDS = new Set([
  ...SEED_TABLES.map((r) => r.id),
  ...SEED_MENU_ITEMS.map((r) => r.id),
  ...SEED_ORDERS.map((r) => r.id),
  ...SEED_USERS.map((r) => r.id),
  ...SEED_ROLES.map((r) => r.id),
]);

export function isLegacySeedId(id: string): boolean {
  return LEGACY_SEED_IDS.has(id);
}
