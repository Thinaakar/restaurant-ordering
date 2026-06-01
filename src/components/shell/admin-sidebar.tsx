'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Grid3X3,
  UtensilsCrossed,
  ChefHat,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationGroups: SidebarGroup[] = [
    {
      name: 'Overview',
      items: [
        { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      ],
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

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r border-border/40 bg-sidebar transition-all duration-300 min-h-screen text-sidebar-foreground",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border/40">
        {!isCollapsed && (
          <Link href="/admin/dashboard" className="flex items-center gap-2 group">
            <span className="text-xl font-display font-semibold uppercase tracking-[0.25em] gold-text">
              Aura Admin
            </span>
            <Sparkles className="h-4 w-4 text-gold animate-pulse-glow" />
          </Link>
        )}
        {isCollapsed && (
          <Link href="/admin/dashboard" className="mx-auto">
            <span className="text-xl font-display font-semibold gold-text">A</span>
          </Link>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-md transition-colors hover:text-gold hover:border-gold"
        >
          {isCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 px-3 py-4 overflow-y-auto">
        {navigationGroups.map((group) => (
          <div key={group.name} className="space-y-1">
            {!isCollapsed && (
              <h4 className="px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground/60 select-none">
                {group.name}
              </h4>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300 relative group",
                    isActive
                      ? "bg-gold/10 text-gold shadow-sm border-l-2 border-gold"
                      : "hover:bg-card hover:text-foreground text-muted-foreground"
                  )}
                >
                  <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-gold" : "text-muted-foreground group-hover:text-foreground")} />
                  {!isCollapsed && <span>{item.label}</span>}
                  
                  {/* Tooltip for collapsed sidebar */}
                  {isCollapsed && (
                    <div className="absolute left-14 invisible opacity-0 group-hover:visible group-hover:opacity-100 bg-popover border border-border text-popover-foreground text-xs py-1.5 px-3 rounded-md shadow-lg transition-all duration-200 z-50 whitespace-nowrap">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User Footer Profile */}
      <div className="border-t border-border/40 p-4 space-y-3">
        {!isCollapsed && user && (
          <div className="flex items-center gap-3 bg-card/40 border border-border/20 rounded-lg p-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/10 text-lg border border-gold/20">
              {user.avatar || '👨‍🍳'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-foreground truncate">{user.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 relative group",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span>Log out</span>}
          {isCollapsed && (
            <div className="absolute left-14 invisible opacity-0 group-hover:visible group-hover:opacity-100 bg-popover border border-border text-destructive text-xs py-1.5 px-3 rounded-md shadow-lg transition-all duration-200 z-50 whitespace-nowrap">
              Log out
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
