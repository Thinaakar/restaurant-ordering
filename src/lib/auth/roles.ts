import type { UserRole } from '@/data/types';

/** Default landing route after login (non-demo). */
export function getLoginRedirect(role: string, isDemo?: boolean): string {
  if (isDemo) return '/admin/dashboard';

  switch (role as UserRole) {
    case 'waiter':
      return '/admin/orders/create';
    case 'kitchen_chef':
      return '/admin/kitchen';
    case 'cashier':
      return '/admin/cashier';
    case 'super_admin':
    case 'admin':
    default:
      return '/admin/dashboard';
  }
}

const FULL_ACCESS_ROLES: UserRole[] = ['super_admin', 'admin'];

const ROLE_ALLOWED_PREFIXES: Record<string, string[]> = {
  waiter: ['/admin/orders'],
  kitchen_chef: ['/admin/kitchen'],
  cashier: ['/admin/cashier', '/admin/orders'],
};

export function canAccessAdminPath(role: string | undefined, pathname: string): boolean {
  if (!role) return false;
  if (FULL_ACCESS_ROLES.includes(role as UserRole)) return true;

  const prefixes = ROLE_ALLOWED_PREFIXES[role];
  if (!prefixes) return pathname === '/admin/dashboard';

  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function filterNavHref(role: string | undefined, href: string): boolean {
  if (!role) return false;
  if (FULL_ACCESS_ROLES.includes(role as UserRole)) return true;

  const prefixes = ROLE_ALLOWED_PREFIXES[role];
  if (!prefixes) return href === '/admin/dashboard';

  return prefixes.some((prefix) => href === prefix || href.startsWith(`${prefix}/`));
}
