'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PermissionsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/settings?section=permissions');
  }, [router]);

  return (
    <div className="py-16 text-center text-sm text-muted-foreground">
      Redirecting to Settings…
    </div>
  );
}
