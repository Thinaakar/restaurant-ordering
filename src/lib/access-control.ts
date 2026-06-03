import type { AdminUser } from '@/data/types';

export function isSuperAdmin(user: AdminUser | null | undefined): boolean {
  return user?.role === 'super_admin';
}

export function canManageRolesAndPermissions(user: AdminUser | null | undefined): boolean {
  return isSuperAdmin(user);
}
