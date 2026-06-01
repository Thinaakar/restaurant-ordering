'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (error) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="max-w-md rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h2 className="text-lg font-bold text-destructive mb-2">Access Denied</h2>
          <p className="text-sm text-destructive/80">{error}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
