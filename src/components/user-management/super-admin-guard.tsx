'use client';

import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { canManageRolesAndPermissions } from '@/lib/access-control';
import { AccessDenied } from './access-denied';

export function SuperAdminGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!canManageRolesAndPermissions(user)) {
    return <AccessDenied />;
  }

  return <>{children}</>;
}
