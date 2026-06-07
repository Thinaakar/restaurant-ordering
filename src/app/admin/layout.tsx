'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { AdminSidebar } from '@/components/shell/admin-sidebar';
import { AdminHeader } from '@/components/shell/admin-header';
import { UserManagementProvider } from '@/providers/user-management-provider';
import { MenuMasterDataProvider } from '@/providers/menu-master-data-provider';
import { canAccessAdminPath, getLoginRedirect } from '@/lib/auth/roles';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading, user } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (!loading && isAuthenticated && user && pathname && !canAccessAdminPath(user.role, pathname)) {
      router.replace(getLoginRedirect(user.role, user.isDemo));
    }
  }, [isAuthenticated, loading, user, pathname, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-muted-foreground text-xs uppercase tracking-widest">
        Verifying Session...
      </div>
    );
  }

  return (
    <UserManagementProvider>
    <MenuMasterDataProvider>
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="hidden md:flex h-full shrink-0">
        <AdminSidebar />
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader />
        
        <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-surface-1 via-background to-background">
          <div className="container mx-auto px-4 py-6 md:px-8 md:py-8 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
    </MenuMasterDataProvider>
    </UserManagementProvider>
  );
}
