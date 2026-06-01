'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, ShoppingCart, LogOut, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { ThemeToggle } from '@/components/shell/theme-toggle';

export default function WaiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    {
      label: 'Dashboard',
      href: '/waiter/dashboard',
      icon: LayoutDashboard,
      description: 'Overview and quick actions',
    },
    {
      label: 'Select Table',
      href: '/waiter/tables',
      icon: Users,
      description: 'Choose table for ordering',
    },
    {
      label: 'Take Order',
      href: '/waiter',
      icon: ShoppingCart,
      description: 'Browse menu and place orders',
    },
    {
      label: 'Active Orders',
      href: '/waiter/orders',
      icon: ShoppingCart,
      description: 'View all active orders',
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-surface-1 border-r border-border/50 transform transition-transform duration-300 lg:relative lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border/50">
            <Link href="/waiter/dashboard" className="flex items-center gap-2">
              <span className="text-2xl">👨💼</span>
              <div>
                <h1 className="text-lg font-display font-semibold text-foreground">Waiter</h1>
                <p className="text-xs text-muted-foreground">Operations</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300',
                    isActive
                      ? 'bg-gold/10 border border-gold/30 text-gold'
                      : 'text-muted-foreground hover:bg-surface-2 hover:text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="text-xs text-muted-foreground/70 truncate">{item.description}</p>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border/50">
            <Link href="/login">
              <button className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-surface-2 text-muted-foreground hover:bg-surface-3 hover:text-foreground transition text-sm font-semibold">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-border/50 bg-surface-1">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-surface-2 rounded-lg transition"
          >
            <Menu className="h-6 w-6 text-foreground" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">Waiter Portal</p>
              <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
