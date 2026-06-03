'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldOff, ArrowLeft } from 'lucide-react';

export function AccessDenied() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-border/60 bg-card/50 p-8 text-center shadow-sm animate-fade-in">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 border border-destructive/20">
        <ShieldOff className="h-8 w-8 text-destructive" />
      </div>
      <h2 className="text-xl font-bold text-foreground tracking-tight">Access Denied</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        You do not have permission to access this page. Only Super Admin can manage Roles and
        Permissions.
      </p>
      <Link
        href="/admin/users"
        className="mt-6 inline-flex items-center gap-2 rounded-lg border border-gold/30 bg-gold/10 px-4 py-2.5 text-sm font-semibold text-gold transition-colors hover:bg-gold/20"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Users
      </Link>
    </div>
  );
}
