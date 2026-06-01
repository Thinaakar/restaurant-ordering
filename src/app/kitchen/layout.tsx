"use client";

import React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/shell/theme-toggle";

export default function KitchenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div className="w-64 hidden md:flex flex-col border-r border-border/50 bg-surface-0">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-border/50">
          <Link
            href="/kitchen"
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <span className="text-2xl">👨‍🍳</span>
            <span className="text-lg font-display font-semibold text-gold uppercase tracking-widest">
              Kitchen
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link
            href="/kitchen"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold uppercase tracking-widest text-foreground hover:bg-surface-1 transition"
          >
            <span>📋</span>
            Queue
          </Link>
          <Link
            href="/kitchen/orders"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold uppercase tracking-widest text-muted-foreground hover:bg-surface-1 transition"
          >
            <span>📦</span>
            All Orders
          </Link>
        </nav>

        {/* Help Section */}
        <div className="p-4 border-t border-border/50 space-y-2 text-xs text-muted-foreground">
          <p className="uppercase tracking-widest font-bold">Quick Tips</p>
          <ul className="space-y-1 text-[11px]">
            <li>✓ Start with pending orders</li>
            <li>✓ Read special instructions</li>
            <li>✓ Mark ready when done</li>
            <li>✓ Prioritize long waits</li>
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="border-b border-border/50 bg-surface-0 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👨‍🍳</span>
            <div>
              <h1 className="text-lg font-display font-semibold text-foreground">
                Kitchen Dashboard
              </h1>
              <p className="text-xs text-muted-foreground">
                Prepare orders efficiently
              </p>
            </div>
          </div>
          <ThemeToggle />
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-surface-1 via-background to-background">
          <div className="container mx-auto px-4 py-8 md:px-8 animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
