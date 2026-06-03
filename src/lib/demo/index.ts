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

export {
  getDemoOrderById,
  getDemoTableById,
  getDemoMenuItemById,
  getDemoManagedUserById,
  getDemoRoleById,
  isDemoSampleId,
  mergeDemoListWithFirestore,
} from "./read-model";
