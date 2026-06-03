import type { AdminAccountRole } from '@/data/types';
import type { LucideIcon } from 'lucide-react';
import { UserCircle, Shield, KeyRound } from 'lucide-react';

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
  {
    label: 'Roles',
    href: `${USER_MANAGEMENT_BASE}/roles`,
    icon: Shield,
    superAdminOnly: true,
  },
  {
    label: 'Permissions',
    href: `${USER_MANAGEMENT_BASE}/permissions`,
    icon: KeyRound,
    superAdminOnly: true,
  },
];

export const USER_MANAGEMENT_PATHS = USER_MANAGEMENT_NAV.map((item) => item.href);

export function getUserManagementNavItems(role: AdminAccountRole | undefined): UserManagementNavItem[] {
  const isSuperAdmin = role === 'super_admin';
  return USER_MANAGEMENT_NAV.filter((item) => !item.superAdminOnly || isSuperAdmin);
}

export function isUserManagementPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return USER_MANAGEMENT_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}
