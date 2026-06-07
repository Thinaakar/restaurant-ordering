import type { UserRole } from '@/data/types';
import type { LucideIcon } from 'lucide-react';
import { UserCircle } from 'lucide-react';

export const USER_MANAGEMENT_BASE = '/admin';

export interface UserManagementNavItem {
  label: string;
  /** Route path e.g. /admin/users */
  href: string;
  icon: LucideIcon;
  /** When true, only Super Admin sees this item */
  superAdminOnly: boolean;
}

/** Registered sidebar + route entries for User Management */
export const USER_MANAGEMENT_NAV: UserManagementNavItem[] = [
  {
    label: 'Users',
    href: `${USER_MANAGEMENT_BASE}/users`,
    icon: UserCircle,
    superAdminOnly: false,
  },
];

export const USER_MANAGEMENT_PATHS = USER_MANAGEMENT_NAV.map((item) => item.href);

export function getUserManagementNavItems(role: UserRole | string | undefined): UserManagementNavItem[] {
  const isSuperAdmin = role === 'super_admin';
  const isAdmin = role === 'admin' || isSuperAdmin;
  if (!isAdmin) return [];
  return USER_MANAGEMENT_NAV.filter((item) => !item.superAdminOnly || isSuperAdmin);
}

export function isUserManagementPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return USER_MANAGEMENT_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}
