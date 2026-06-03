export {
  DEMO_SUPER_ADMIN_EMAIL,
  DEMO_SUPER_ADMIN_PASSWORD,
  demoSuperAdminAccount,
  verifyDemoCredentials,
} from "./account";
export { demoTables } from "./tables";
export { demoOrders } from "./orders";
export { demoMenuItems } from "./menu";
export { demoManagedUsers } from "./users";
export { demoRoles } from "./roles";
export { demoSettings } from "./settings";
export { getDemoAnalyticsSummary, computeAnalyticsSummary } from "./analytics";

export const DEMO_SAMPLE_COUNT = 2;

import { demoOrders } from "./orders";
import { demoTables } from "./tables";
import { demoMenuItems } from "./menu";

export function getDemoOrderById(id: string) {
  return demoOrders.find((o) => o.id === id) ?? null;
}

export function getDemoTableById(id: string) {
  return demoTables.find((t) => t.id === id) ?? null;
}

export function getDemoMenuItemById(id: string) {
  return demoMenuItems.find((m) => m.id === id) ?? null;
}
