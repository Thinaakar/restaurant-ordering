'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { RESTAURANT_ADMIN_LABEL } from '@/lib/constants';
import {
  getUserManagementNavItems,
  isUserManagementPath,
} from '@/config/user-management-nav';
import {
  LayoutDashboard,
  Grid3X3,
  UtensilsCrossed,
  ChefHat,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Users,
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
  const [userMgmtOpen, setUserMgmtOpen] = useState(true);

  const userManagementChildren = useMemo(
    () => getUserManagementNavItems(user?.role),
    [user?.role]
  );

  const isSuperAdmin = user?.role === 'super_admin';
  const isUserMgmtActive = isUserManagementPath(pathname);

  useEffect(() => {
    if (isUserMgmtActive) setUserMgmtOpen(true);
  }, [isUserMgmtActive, pathname]);

  const navigationGroups: SidebarGroup[] = [
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

  const submenuMaxHeight =
    userManagementChildren.length <= 1
      ? '2.75rem'
      : userManagementChildren.length === 2
        ? '5.5rem'
        : '8.25rem';

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

        {/* User Management — collapsible parent */}
        <div className="space-y-1">
          <h4 className="px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground/60 select-none">
            Account
          </h4>

          <button
            type="button"
            onClick={() => setUserMgmtOpen((open) => !open)}
            className={cn(navLinkClass(isUserMgmtActive), 'w-full')}
            aria-expanded={userMgmtOpen}
          >
            <Users
              className={cn(
                'h-5 w-5 shrink-0',
                isUserMgmtActive ? 'text-gold' : 'text-muted-foreground group-hover:text-foreground'
              )}
            />
            <span className="flex-1 text-left">User Management</span>
            {userMgmtOpen ? (
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300" />
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300" />
            )}
          </button>

          {/* Submenu: Users, Roles, Permissions */}
          <div
            className={cn(
              'overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out',
              userMgmtOpen ? 'opacity-100' : 'max-h-0 opacity-0'
            )}
            style={userMgmtOpen ? { maxHeight: submenuMaxHeight } : undefined}
          >
            <div className="space-y-0.5 pt-0.5 border-l-2 border-border/30 ml-5 pl-1">
              {userManagementChildren.map((child) => {
                const ChildIcon = child.icon;
                const childActive =
                  pathname === child.href || pathname?.startsWith(child.href + '/');

                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={navLinkClass(childActive, true)}
                  >
                    <ChildIcon
                      className={cn(
                        'h-4 w-4 shrink-0',
                        childActive
                          ? 'text-gold'
                          : 'text-muted-foreground group-hover:text-foreground'
                      )}
                    />
                    <span>{child.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
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
              <p className="text-[10px] font-semibold text-gold">
                {isSuperAdmin ? 'Super Admin' : 'Admin'}
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
