'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useOrders } from '@/hooks/use-orders';
import { formatCurrency, formatTime } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import {
  Clock,
  ChefHat,
  Bell,
  CheckCircle2,
  UtensilsCrossed,
  ArrowRight,
  Info,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

function OrderStatusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams ? searchParams.get('orderId') : null;
  const { orders } = useOrders();

  // If no order ID, default to the latest order in the list
  const activeOrder = orderId
    ? orders.find((o) => o.id === orderId)
    : orders[0];

  if (!activeOrder) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-6">
        <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-surface-2 text-2xl text-muted-foreground border border-border">
          <AlertCircle className="h-6 w-6 text-muted-foreground/60" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-display font-semibold">No Orders Found</h2>
          <p className="text-sm text-muted-foreground">It looks like you haven't placed any orders yet.</p>
        </div>
        <Link href="/customer">
          <button className="rounded-full bg-gold px-8 py-3 text-xs font-bold uppercase tracking-wider text-black gold-gradient hover:scale-105 transition duration-300 shadow-md cursor-pointer mt-4">
            Start Dining Flow
          </button>
        </Link>
      </div>
    );
  }

  const statuses = [
    {
      key: 'pending',
      label: 'Order Sent',
      description: 'Waiting for chef allocation',
      icon: Clock,
    },
    {
      key: 'preparing',
      label: 'Chef Cooking',
      description: 'Preparing fresh ingredients',
      icon: ChefHat,
    },
    {
      key: 'ready',
      label: 'Plated & Ready',
      description: 'Server collecting hot dishes',
      icon: Bell,
    },
    {
      key: 'completed',
      label: 'Delivered',
      description: 'Served! Bon appétit',
      icon: CheckCircle2,
    },
  ];

  const getStatusIndex = () => {
    return statuses.findIndex((s) => s.key === activeOrder.status);
  };

  const currentIdx = getStatusIndex();

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      
      {/* Title Header Banner */}
      <div className="text-center space-y-3">
        <span className="text-xs uppercase font-bold tracking-[0.2em] text-gold">Real-time status</span>
        <h1 className="text-3xl font-display font-semibold tracking-tight">Track Your Feast</h1>
        <p className="text-xs text-muted-foreground">
          Order ID: <span className="font-mono text-foreground font-semibold uppercase">{activeOrder.id}</span>
          <span className="mx-2 text-border">|</span>
          Table: <span className="text-foreground font-semibold">Table {activeOrder.tableNumber}</span>
        </p>
      </div>

      {/* Progress Timeline Board */}
      <div className="rounded-xl border border-border/50 bg-card p-6 md:p-8 relative overflow-hidden">
        {/* Top luxury line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gold gold-gradient" />

        {/* Timeline tracker */}
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-4 my-4">
          
          {/* Connecting line for desktop */}
          <div className="absolute top-6 left-6 right-6 hidden md:block h-0.5 bg-border/40 -z-0">
            <div
              className="h-full bg-gold gold-gradient transition-all duration-1000 ease-out"
              style={{ width: `${(currentIdx / (statuses.length - 1)) * 100}%` }}
            />
          </div>

          {/* Connect line for mobile */}
          <div className="absolute left-6 top-6 bottom-6 md:hidden w-0.5 bg-border/40 -z-0">
            <div
              className="w-full bg-gold gold-gradient transition-all duration-1000 ease-out"
              style={{ height: `${(currentIdx / (statuses.length - 1)) * 100}%` }}
            />
          </div>

          {statuses.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < currentIdx;
            const isActive = idx === currentIdx;

            return (
              <div key={step.key} className="flex md:flex-col items-center gap-4 md:text-center relative z-10 w-full md:w-auto">
                <div
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border bg-card transition-all duration-500",
                    isActive
                      ? "border-gold text-gold glow-gold scale-110"
                      : isCompleted
                      ? "border-emerald bg-emerald/10 text-emerald"
                      : "border-border/60 text-muted-foreground/60"
                  )}
                >
                  <Icon className={cn("h-5 w-5", isActive && "animate-pulse")} />
                </div>
                
                <div className="space-y-0.5 text-left md:text-center">
                  <h3
                    className={cn(
                      "text-xs md:text-sm font-bold uppercase tracking-wider transition-colors duration-500",
                      isActive ? "text-gold" : isCompleted ? "text-emerald" : "text-muted-foreground/60"
                    )}
                  >
                    {step.label}
                  </h3>
                  <p className="text-[10px] md:text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ETA and Detail breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Estimated Timing Widget */}
        <div className="rounded-xl border border-border/50 bg-card p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Estimated Time</h3>
              <p className="text-2xl font-display font-bold text-foreground">
                {activeOrder.status === 'completed' ? 'Delivered 🎉' : '15 - 20 Mins'}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-gold border border-gold/20">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-border/20 flex justify-between items-center text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>Placed at {formatTime(activeOrder.createdAt)}</span>
            </span>
          </div>
        </div>

        {/* Action widget: Add more food! */}
        <div className="rounded-xl border border-border/50 bg-card p-6 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Craving more?</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Want to add a dessert, beverage, or additional starters to your current table? You can request more plates anytime!
            </p>
          </div>

          <button
            onClick={() => router.push('/customer/menu')}
            className="mt-6 w-full flex items-center justify-center gap-2 rounded-lg bg-gold/10 border border-gold/20 py-3 text-xs font-bold uppercase tracking-wider text-gold hover:bg-gold hover:text-black transition duration-300 cursor-pointer shadow-sm"
          >
            <span>Request Additional Dishes</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Recapped Order Receipts list */}
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border/20 bg-surface-1/45">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Your Feast Summary</h2>
        </div>
        <div className="divide-y divide-border/20 px-5">
          {activeOrder.items.map((item, idx) => (
            <div key={idx} className="py-4 flex items-center justify-between text-xs">
              <div className="space-y-1">
                <p className="font-semibold text-foreground">
                  {item.name} <span className="text-gold font-bold mx-1">x{item.quantity}</span>
                </p>
                {item.specialInstructions && (
                  <p className="text-[10px] text-muted-foreground italic">“{item.specialInstructions}”</p>
                )}
              </div>
              <span className="font-bold text-foreground">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="p-5 bg-card/65 border-t border-border/20 flex justify-between items-center text-sm font-bold">
          <span>Amount Billable</span>
          <span className="text-lg font-display text-gold">{formatCurrency(activeOrder.total)}</span>
        </div>
      </div>

    </div>
  );
}

export default function OrderStatusPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[300px] items-center justify-center text-muted-foreground text-xs uppercase tracking-widest">
          Loading Tracker...
        </div>
      }
    >
      <OrderStatusContent />
    </Suspense>
  );
}
