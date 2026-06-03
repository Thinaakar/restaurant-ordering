'use client';

import React from 'react';
import { CustomerHeader } from '@/components/shell/customer-header';
import { RESTAURANT_FULL_NAME } from '@/lib/constants';

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <CustomerHeader />
      <main className="flex-1 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-surface-1 via-background to-background">
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 animate-fade-in">
          {children}
        </div>
      </main>
      <footer className="border-t border-border/40 py-6 bg-card/25 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} {RESTAURANT_FULL_NAME}. Crafted with Culinary Excellence.</p>
      </footer>
    </div>
  );
}
