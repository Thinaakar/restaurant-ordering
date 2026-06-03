'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Menu, User, ChevronDown, LogOut, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AdminSidebar } from './admin-sidebar';
import { ThemeToggle } from './theme-toggle';


export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Dynamic Breadcrumb Generator
  const getBreadcrumbs = () => {
    const paths = pathname?.split('/').filter(Boolean) || [];
    // Skip the first 'admin' segment since it's already hardcoded in the breadcrumb prefix
    const displayPaths = paths[0] === 'admin' ? paths.slice(1) : paths;
    const labelMap: Record<string, string> = {
      admin: 'Admin',
      cashier: 'Cashier',
      orders: 'Orders',
      create: 'New Order',
      kitchen: 'Kitchen Board',
      waiter: 'Waiter',
      dashboard: 'Dashboard',
      reports: 'Reports Analytics',
      settings: 'Settings',
      tables: 'Table Manager',
      menu: 'Menu',
      ordering: 'Ordering',
      users: 'Users',
      roles: 'Roles Management',
      permissions: 'Permissions Management',
    };

    return displayPaths.map((path, idx) => {
      const href = '/' + paths.slice(0, paths.indexOf(path) + 1).join('/');
      const label = labelMap[path] ?? path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
      const isLast = idx === displayPaths.length - 1;

      return { label, href, isLast };
    });
  };

  const breadcrumbs = getBreadcrumbs();


  const handleLogout = () => {
    void logout().then(() => router.push('/login'));
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/40 bg-background/95 backdrop-blur px-4 md:px-6">
      
      {/* Left side: Mobile navigation toggle and Breadcrumbs */}
      <div className="flex items-center gap-3">
        {/* Mobile Nav Toggle */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card hover:text-gold hover:border-gold">
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 bg-sidebar border-r border-border/40">
            <div className="h-full" onClick={() => setIsOpen(false)}>
              <AdminSidebar />
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop Breadcrumbs */}
        <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
          <span className="text-muted-foreground">Admin</span>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.href}>
              <span className="text-border">/</span>
              <span
                className={
                  crumb.isLast
                    ? "text-gold glow-gold font-bold"
                    : "text-muted-foreground/80 hover:text-foreground"
                }
              >
                {crumb.label}
              </span>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right side: Search, Notifications & User Dropdown */}
      <div className="flex items-center gap-4">

        <ThemeToggle />

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1.5 focus:outline-none cursor-pointer group">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/50 text-base transition group-hover:border-gold group-hover:text-gold">
              {user?.avatar || '👨‍🍳'}
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-card border border-border shadow-lg mt-1 p-1">
            <DropdownMenuLabel className="px-2 py-2">
              <p className="text-xs font-bold text-foreground truncate">{user?.name}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem
              onClick={() => router.push('/admin/settings')}
              className="flex items-center gap-2 text-xs py-2 hover:bg-gold/10 rounded-md cursor-pointer"
            >
              <Settings className="h-4 w-4 text-muted-foreground" />
              <span>Restaurant Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs py-2 text-destructive hover:bg-destructive/10 rounded-md cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

    </header>
  );
}
