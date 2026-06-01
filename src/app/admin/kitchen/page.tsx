'use client';

import React, { useState, useEffect } from 'react';
import { useOrders } from '@/hooks/use-orders';
import { useToast } from '@/hooks/use-toast';
import type { Order, OrderStatus } from '@/data/types';
import { formatRelativeTime } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { Clock, ChefHat, Play, CheckCircle, Volume2, Stars, Info } from 'lucide-react';

export default function AdminKitchenPage() {
  const { orders, updateOrderStatus } = useOrders();
  const { addToast } = useToast();
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [newOrderAlert, setNewOrderAlert] = useState(false);
  const [previousCount, setPreviousCount] = useState(orders.length);

  // Monitor incoming orders to trigger chef alerts
  useEffect(() => {
    if (orders.length > previousCount) {
      setNewOrderAlert(true);
      setPreviousCount(orders.length);
      
      // Simulate audio beep
      if (soundEnabled) {
        try {
          const context = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = context.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, context.currentTime); // D5 chime
          osc.connect(context.destination);
          osc.start();
          osc.stop(context.currentTime + 0.35);
        } catch (e) {}
      }

      // Clear visual alert after 6 seconds
      const t = setTimeout(() => setNewOrderAlert(false), 6000);
      return () => clearTimeout(t);
    }
  }, [orders, previousCount, soundEnabled]);

  const columns: { label: string; status: OrderStatus; color: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { label: 'Pending', status: 'pending', color: 'border-amber-500/35 bg-amber-500/5', icon: Clock },
    { label: 'Preparing', status: 'preparing', color: 'border-blue-500/35 bg-blue-500/5', icon: ChefHat },
    { label: 'Ready to Serve', status: 'ready', color: 'border-emerald/35 bg-emerald-500/5', icon: Stars },
  ];

  const getOrdersByStatus = (status: OrderStatus) => {
    return orders
      .filter((o) => o.status === status)
      // Oldest first to prioritize first-come first-served
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  };

  const handleNextStatus = (orderId: string, currentStatus: OrderStatus) => {
    if (currentStatus === 'pending') {
      updateOrderStatus(orderId, 'preparing');
      addToast({
        title: 'Order Started',
        description: `Order ${orderId} is now being prepared`,
        type: 'info',
      });
    } else if (currentStatus === 'preparing') {
      updateOrderStatus(orderId, 'ready');
      addToast({
        title: 'Order Ready',
        description: `Order ${orderId} is ready for delivery`,
        type: 'success',
      });
    } else if (currentStatus === 'ready') {
      updateOrderStatus(orderId, 'completed');
      addToast({
        title: 'Order Completed',
        description: `Order ${orderId} has been delivered`,
        type: 'success',
      });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-[82vh] flex flex-col justify-between">
      
      {/* Title Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/20 pb-3 shrink-0">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-display font-semibold tracking-tight uppercase">Kitchen Operations</h1>
          <p className="text-xs text-muted-foreground">Monitor cooking times and prioritize order pipelines</p>
        </div>

        {/* Chime controls & alert banner */}
        <div className="flex items-center gap-3">
          {newOrderAlert && (
            <div className="flex items-center gap-1.5 rounded-full border border-gold bg-gold/15 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gold animate-pulse-glow">
              <Volume2 className="h-3.5 w-3.5 animate-bounce" />
              <span>New Order Placed!</span>
            </div>
          )}

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer select-none",
              soundEnabled
                ? "border-gold bg-gold/10 text-gold"
                : "border-border bg-card/45 text-muted-foreground"
            )}
          >
            <span>Kitchen Chime {soundEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 overflow-hidden min-h-[450px] pb-2">
        {columns.map((col) => {
          const colOrders = getOrdersByStatus(col.status);
          const Icon = col.icon;

          return (
            <div
              key={col.status}
              className={cn(
                "rounded-xl border flex flex-col h-full overflow-hidden",
                col.color
              )}
            >
              {/* Column Title */}
              <div className="px-5 py-4 border-b border-border/20 flex items-center justify-between bg-surface-1/30 shrink-0">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <Icon className="h-4 w-4 text-gold" />
                  <span>{col.label}</span>
                </span>
                <span className="text-[10px] font-bold bg-black/45 border border-border px-2 py-0.5 rounded-full">
                  {colOrders.length}
                </span>
              </div>

              {/* Cards List container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                {colOrders.length > 0 ? (
                  colOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="rounded-lg border border-border/60 bg-card p-4 space-y-4 hover:border-gold/25 transition duration-300 relative overflow-hidden"
                    >
                      {/* Card Header details */}
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-bold text-foreground uppercase truncate">Order: {ord.id}</p>
                          <p className="text-[10px] font-semibold text-gold mt-0.5">Table {ord.tableNumber}</p>
                        </div>
                        <span className="text-[9px] text-muted-foreground font-bold uppercase shrink-0">
                          {formatRelativeTime(ord.createdAt)}
                        </span>
                      </div>

                      {/* Item list */}
                      <div className="divide-y divide-border/10 space-y-1.5 pt-1.5 border-t border-border/15">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="text-xs py-1">
                            <div className="flex items-start justify-between">
                              <span className="font-semibold text-foreground">
                                {item.name} <span className="text-gold font-bold mx-0.5">x{item.quantity}</span>
                              </span>
                            </div>
                            {item.specialInstructions && (
                              <p className="text-[10px] text-gold/80 italic mt-0.5 bg-gold/5 border border-gold/10 px-1.5 py-0.5 rounded w-fit">
                                “{item.specialInstructions}”
                              </p>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* General Chef comments */}
                      {ord.notes && (
                        <div className="rounded border border-border/30 bg-surface-2/15 p-2 text-[10px] italic text-muted-foreground/80 leading-normal">
                          Chef Note: “{ord.notes}”
                        </div>
                      )}

                      {/* Action trigger to next column */}
                      <button
                        onClick={() => handleNextStatus(ord.id, col.status)}
                        className="w-full flex items-center justify-center gap-1 rounded bg-gold/10 border border-gold/25 py-2 text-[10px] font-bold uppercase tracking-wider text-gold hover:bg-gold hover:text-black transition duration-300 cursor-pointer shadow-sm mt-3"
                      >
                        {col.status === 'pending' ? (
                          <>
                            <Play className="h-3.5 w-3.5" />
                            <span>Start Preparing</span>
                          </>
                        ) : col.status === 'preparing' ? (
                          <>
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span>Done Cooking</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span>Mark Served</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-[10px] uppercase font-bold text-muted-foreground/45 border border-dashed border-border/35 rounded-lg">
                    No active orders
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
