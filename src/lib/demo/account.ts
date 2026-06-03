import type { AdminAccountRole } from "@/data/types";

export const DEMO_SUPER_ADMIN_EMAIL = "superadmin@yumm.com";
export const DEMO_SUPER_ADMIN_PASSWORD = "super123";

export const demoSuperAdminAccount = {
  email: DEMO_SUPER_ADMIN_EMAIL,
  password: DEMO_SUPER_ADMIN_PASSWORD,
  name: "Demo Super Admin",
  role: "super_admin" as AdminAccountRole,
  avatar: "👑",
};

export function verifyDemoCredentials(email: string, password: string): boolean {
  return (
    email.trim().toLowerCase() === demoSuperAdminAccount.email.toLowerCase() &&
    password === demoSuperAdminAccount.password
  );
}
