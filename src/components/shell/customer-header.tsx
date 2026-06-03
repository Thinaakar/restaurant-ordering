'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import { ShoppingCart, Utensils, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RESTAURANT_NAME } from '@/lib/constants';
import { ThemeToggle } from './theme-toggle';

export function CustomerHeader() {
  const pathname = usePathname();
  const { itemCount, tableNumber } = useCart();

  const steps = [
    { label: 'Table Select', path: '/customer', icon: Utensils },
    { label: 'Browse Menu', path: '/customer/menu', icon: ShoppingCart },
    { label: 'Review Cart', path: '/customer/cart', icon: ShoppingCart },
    { label: 'Live Tracking', path: '/customer/order-status', icon: Clock },
  ];

  // Helper to determine active step
  const getStepIndex = () => {
    if (pathname === '/customer') return 0;
    if (pathname === '/customer/menu') return 1;
    if (pathname === '/customer/cart') return 2;
    if (pathname?.startsWith('/customer/order-status')) return 3;
    return -1;
  };

  const activeIndex = getStepIndex();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-6 flex h-16 items-center justify-between">
        {/* Branding */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl md:text-2xl font-display font-semibold uppercase tracking-[0.25em] gold-text">
            {RESTAURANT_NAME}
          </span>
        </Link>

        {/* Steps for desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < activeIndex;
            const isActive = idx === activeIndex;

            return (
              <React.Fragment key={step.path}>
                <div
                  className={cn(
                    "flex items-center gap-2 transition-all duration-300",
                    isActive ? "text-gold glow-gold scale-105" : isCompleted ? "text-emerald" : "text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                  <span>{step.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <span className="text-border">/</span>
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Table & Cart Section */}
        <div className="flex items-center gap-3">
          <ThemeToggle className="hidden sm:inline-flex" />

          {tableNumber !== null && (
            <div className="flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs md:text-sm text-gold">
              <span>Table {tableNumber}</span>
            </div>
          )}

          <Link href="/customer/cart">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/50 transition-all duration-300 hover:border-gold hover:text-gold">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-black animate-scale-in">
                  {itemCount}
                </span>
              )}
            </button>
          </Link>
        </div>
      </div>

      {/* Steps bar for mobile */}
      <div className="md:hidden border-t border-border/20 bg-card/20 py-2">
        <div className="flex items-center justify-around gap-2 px-3 text-[10px] uppercase font-bold tracking-wider">
          {steps.map((step, idx) => {
            const isActive = idx === activeIndex;
            return (
              <span
                key={step.path}
                className={cn(
                  "transition-colors duration-300",
                  isActive ? "text-gold" : idx < activeIndex ? "text-emerald" : "text-muted-foreground"
                )}
              >
                {step.label.split(' ')[0]}
              </span>
            );
          })}
          <ThemeToggle className="sm:hidden scale-90" />
        </div>
      </div>
    </header>
  );
}
