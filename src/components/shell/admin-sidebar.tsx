'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { RESTAURANT_ADMIN_LABEL } from '@/lib/constants';
import {
  getUserManagementNavItems,
} from '@/config/user-management-nav';
import { filterNavHref } from '@/lib/auth/roles';
import {
  LayoutDashboard,
  Grid3X3,
  UtensilsCrossed,
  ChefHat,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarGroup {
  name: string;
  items: SidebarItem[];
}

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();

  const userManagementChildren = useMemo(
    () => getUserManagementNavItems(user?.role),
    [user?.role]
  );

  const navigationGroups: SidebarGroup[] = useMemo(() => {
    const groups: SidebarGroup[] = [
      {
        name: 'Overview',
        items: [{ label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard }],
      },
      {
        name: 'Management',
        items: [
          { label: 'Table Manager', href: '/admin/tables', icon: Grid3X3 },
          { label: 'Menu Items', href: '/admin/menu', icon: UtensilsCrossed },
        ],
      },
      {
        name: 'Operations',
        items: [
          { label: 'Kitchen Board', href: '/admin/kitchen', icon: ChefHat },
          { label: 'Orders', href: '/admin/orders/create', icon: UtensilsCrossed },
          { label: 'Cashier', href: '/admin/cashier', icon: CreditCard },
        ],
      },
      {
        name: 'Analytics',
        items: [
          { label: 'Reports Analytics', href: '/admin/reports', icon: BarChart3 },
          { label: 'Settings', href: '/admin/settings', icon: Settings },
        ],
      },
    ];

    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => filterNavHref(user?.role, item.href)),
      }))
      .filter((group) => group.items.length > 0);
  }, [user?.role]);

  const navLinkClass = (isActive: boolean, indented = false) =>
    cn(
      'flex items-center gap-3 rounded-lg py-2 text-sm font-medium transition-all duration-300 relative group',
      indented ? 'pl-9 pr-3' : 'px-3',
      isActive
        ? 'bg-gold/10 text-gold shadow-sm border-l-2 border-gold'
        : 'hover:bg-card hover:text-foreground text-muted-foreground'
    );

  const handleLogout = () => {
    void logout().then(() => router.push('/login'));
  };

  return (
    <aside className="relative flex w-64 flex-col border-r border-border/40 bg-sidebar min-h-screen text-sidebar-foreground">
      <div className="flex h-16 items-center px-4 border-b border-border/40">
        <Link href="/admin/dashboard" className="flex items-center gap-2 group">
          <span className="text-xl font-display font-semibold uppercase tracking-[0.25em] gold-text">
            {RESTAURANT_ADMIN_LABEL}
          </span>
        </Link>
      </div>

      <nav className="flex-1 space-y-6 px-3 py-4 overflow-y-auto">
        {navigationGroups.map((group) => (
          <div key={group.name} className="space-y-1">
            <h4 className="px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground/60 select-none">
              {group.name}
            </h4>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname?.startsWith(item.href + '/');

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={navLinkClass(isActive)}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5 shrink-0',
                      isActive ? 'text-gold' : 'text-muted-foreground group-hover:text-foreground'
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}

        {/* User Management — admin / super admin only */}
        {userManagementChildren.length > 0 && (
        <div className="space-y-1">
          <h4 className="px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground/60 select-none">
            Account
          </h4>

          {userManagementChildren.map((child) => {
            const ChildIcon = child.icon;
            const childActive =
              pathname === child.href || pathname?.startsWith(`${child.href}/`);

            return (
              <Link
                key={child.href}
                href={child.href}
                className={navLinkClass(childActive)}
              >
                <ChildIcon
                  className={cn(
                    'h-5 w-5 shrink-0',
                    childActive
                      ? 'text-gold'
                      : 'text-muted-foreground group-hover:text-foreground',
                  )}
                />
                <span>{child.label}</span>
              </Link>
            );
          })}
        </div>
        )}
      </nav>

      <div className="border-t border-border/40 p-4 space-y-3">
        {user && (
          <div className="flex items-center gap-3 bg-card/40 border border-border/20 rounded-lg p-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/10 text-lg border border-gold/20">
              {user.avatar || '👨‍🍳'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-foreground truncate">{user.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
              <p className="text-[10px] font-semibold text-gold capitalize">
                {String(user.role).replace(/_/g, ' ')}
              </p>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
