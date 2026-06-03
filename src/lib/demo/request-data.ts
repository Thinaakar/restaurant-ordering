import { getSessionFromRequest } from "@/lib/auth/session";
import {
  listOrders,
  listTables,
  listMenuItems,
  listManagedUsers,
  listRoles,
  getOrder,
  getTable,
  getMenuItem,
  getManagedUser,
  getRole,
  getSettings,
  getAnalyticsSummary,
} from "@/lib/firestore/app-data";
import { computeAnalyticsSummary } from "@/lib/demo/analytics";
import {
  demoTables,
  demoOrders,
  demoMenuItems,
  demoManagedUsers,
  demoRoles,
  demoSettings,
  getDemoOrderById,
  getDemoTableById,
  getDemoMenuItemById,
  getDemoManagedUserById,
  getDemoRoleById,
} from "./read-model";
import {
  getHiddenSetForTable,
  type DemoTableKey,
} from "./hidden-samples";
import { getDemoCreatedIds } from "./created-records";
import { isLegacySeedId } from "./legacy-seed-ids";

export function isDemoSession(request: Request): boolean {
  return getSessionFromRequest(request)?.isDemo === true;
}

/** Built-in samples (2) + records you created in this demo session. */
async function listDemoWithCreated<T extends { id: string }>(
  tableKey: DemoTableKey,
  demo: readonly T[],
  load: () => Promise<T[]>,
): Promise<T[]> {
  const [stored, hidden, createdIds] = await Promise.all([
    load(),
    getHiddenSetForTable(tableKey),
    getDemoCreatedIds(tableKey),
  ]);
  const storedById = new Map(stored.map((r) => [r.id, r]));
  const demoIds = new Set(demo.map((d) => d.id));
  const base = demo
    .filter((d) => !hidden.has(d.id))
    .map((d) => storedById.get(d.id) ?? d);
  const extras = stored.filter((r) => {
    if (demoIds.has(r.id) || hidden.has(r.id)) return false;
    if (createdIds.has(r.id)) return true;
    // Show Firestore creates even if tracking missed; hide old seed rows.
    return !isLegacySeedId(r.id);
  });
  return [...base, ...extras];
}

async function getForDemo<T extends { id: string }>(
  tableKey: DemoTableKey,
  id: string,
  getDemo: (id: string) => T | null,
  getStored: (id: string) => Promise<T | null>,
): Promise<T | null> {
  const hidden = await getHiddenSetForTable(tableKey);
  if (hidden.has(id)) return null;
  const stored = await getStored(id);
  if (stored) return stored;
  return getDemo(id);
}

export async function listOrdersForRequest(request: Request) {
  if (!isDemoSession(request)) return listOrders();
  return listDemoWithCreated("orders", demoOrders, listOrders);
}

export async function getOrderForRequest(request: Request, id: string) {
  if (!isDemoSession(request)) return getOrder(id);
  return getForDemo("orders", id, getDemoOrderById, getOrder);
}

export async function listTablesForRequest(request: Request) {
  if (!isDemoSession(request)) return listTables();
  return listDemoWithCreated("tables", demoTables, listTables);
}

export async function getTableForRequest(request: Request, id: string) {
  if (!isDemoSession(request)) return getTable(id);
  return getForDemo("tables", id, getDemoTableById, getTable);
}

export async function listMenuItemsForRequest(request: Request) {
  if (!isDemoSession(request)) return listMenuItems();
  return listDemoWithCreated("menu_items", demoMenuItems, listMenuItems);
}

export async function getMenuItemForRequest(request: Request, id: string) {
  if (!isDemoSession(request)) return getMenuItem(id);
  return getForDemo("menu_items", id, getDemoMenuItemById, getMenuItem);
}

export async function listManagedUsersForRequest(request: Request) {
  if (!isDemoSession(request)) return listManagedUsers();
  return listDemoWithCreated(
    "managed_users",
    demoManagedUsers,
    listManagedUsers,
  );
}

export async function getManagedUserForRequest(request: Request, id: string) {
  if (!isDemoSession(request)) return getManagedUser(id);
  return getForDemo(
    "managed_users",
    id,
    getDemoManagedUserById,
    getManagedUser,
  );
}

export async function listRolesForRequest(request: Request) {
  if (!isDemoSession(request)) return listRoles();
  return listDemoWithCreated("roles", demoRoles, listRoles);
}

export async function getRoleForRequest(request: Request, id: string) {
  if (!isDemoSession(request)) return getRole(id);
  return getForDemo("roles", id, getDemoRoleById, getRole);
}

export async function getSettingsForRequest(request: Request) {
  if (!isDemoSession(request)) return (await getSettings()) ?? {};
  const stored = await getSettings();
  return stored ? { ...demoSettings, ...stored } : { ...demoSettings };
}

export async function getAnalyticsForRequest(request: Request) {
  if (!isDemoSession(request)) return getAnalyticsSummary();
  const orders = await listDemoWithCreated("orders", demoOrders, listOrders);
  const tables = await listDemoWithCreated("tables", demoTables, listTables);
  return computeAnalyticsSummary(orders, tables);
}
