"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login?view=forgot");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-amber-500" />
        <p className="text-sm text-slate-600">
          Redirecting to password reset...
        </p>
      </div>
    </div>
  );
}
