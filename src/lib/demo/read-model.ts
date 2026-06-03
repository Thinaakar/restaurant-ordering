import { demoTables } from "./tables";
import { demoOrders } from "./orders";
import { demoMenuItems } from "./menu";
import { demoManagedUsers } from "./users";
import { demoRoles } from "./roles";
import { demoSettings } from "./settings";

export {
  demoTables,
  demoOrders,
  demoMenuItems,
  demoManagedUsers,
  demoRoles,
  demoSettings,
};

const DEMO_SAMPLE_IDS = new Set([
  ...demoTables.map((t) => t.id),
  ...demoOrders.map((o) => o.id),
  ...demoMenuItems.map((m) => m.id),
  ...demoManagedUsers.map((u) => u.id),
  ...demoRoles.map((r) => r.id),
]);

export function isDemoSampleId(id: string): boolean {
  return DEMO_SAMPLE_IDS.has(id);
}

export function mergeDemoListWithFirestore<T extends { id: string }>(
  demo: readonly T[],
  firestore: T[],
  hidden: ReadonlySet<string>,
): T[] {
  const firestoreById = new Map(firestore.map((r) => [r.id, r]));
  const demoIds = new Set(demo.map((d) => d.id));
  const out: T[] = [];
  for (const d of demo) {
    if (hidden.has(d.id)) continue;
    out.push(firestoreById.get(d.id) ?? d);
  }
  for (const r of firestore) {
    if (!demoIds.has(r.id)) out.push(r);
  }
  return out;
}

export function getDemoTableById(id: string) {
  return demoTables.find((t) => t.id === id) ?? null;
}

export function getDemoOrderById(id: string) {
  return demoOrders.find((o) => o.id === id) ?? null;
}

export function getDemoMenuItemById(id: string) {
  return demoMenuItems.find((m) => m.id === id) ?? null;
}

export function getDemoManagedUserById(id: string) {
  return demoManagedUsers.find((u) => u.id === id) ?? null;
}

export function getDemoRoleById(id: string) {
  return demoRoles.find((r) => r.id === id) ?? null;
}
