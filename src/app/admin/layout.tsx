'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { AdminSidebar } from '@/components/shell/admin-sidebar';
import { AdminHeader } from '@/components/shell/admin-header';
import { UserManagementProvider } from '@/providers/user-management-provider';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  // Authentication Guard
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-muted-foreground text-xs uppercase tracking-widest">
        Verifying Session...
      </div>
    );
  }

  return (
    <UserManagementProvider>
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Collapsible Sidebar */}
      <div className="hidden md:flex h-full shrink-0">
        <AdminSidebar />
      </div>

      {/* Main content frame */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader />
        
        <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-surface-1 via-background to-background">
          <div className="container mx-auto px-4 py-6 md:px-8 md:py-8 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
    </UserManagementProvider>
  );
}
