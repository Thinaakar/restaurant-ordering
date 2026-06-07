'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RolesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/settings?section=roles');
  }, [router]);

  return (
    <div className="py-16 text-center text-sm text-muted-foreground">
      Redirecting to Settings…
    </div>
  );
}
