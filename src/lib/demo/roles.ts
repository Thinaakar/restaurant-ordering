import { MOCK_ROLES } from "@/data/mock-users";

/** Super Admin + Admin — full permission sets for super admin preview. */
export const demoRoles = MOCK_ROLES.filter(
  (r) => r.name === "super_admin" || r.name === "admin",
);
