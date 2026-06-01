'use client';

import React, { use } from 'react';
import { useRouter } from 'next/navigation';
import { useOrders } from '@/hooks/use-orders';
import { formatCurrency, formatTime, formatDate } from '@/lib/formatters';
import { ORDER_STATUS_CONFIG, PAYMENT_STATUS_CONFIG } from '@/lib/constants';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  Receipt,
  User,
  Clock,
  Check,
  CreditCard,
  ChefHat,
  Trash2,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function AdminOrderDetailPage({ params }: OrderDetailPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  
  const { orders, updateOrderStatus, updatePaymentStatus, cancelOrder } = useOrders();
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-6">
        <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-surface-2 text-2xl text-muted-foreground border border-border">
          <AlertTriangle className="h-6 w-6 text-muted-foreground/60" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-display font-semibold">Order Not Found</h2>
          <p className="text-sm text-muted-foreground">The order ID does not exist in our system logs.</p>
        </div>
        <Link href="/admin/orders">
          <button className="rounded-full bg-gold px-8 py-3 text-xs font-bold uppercase tracking-wider text-black gold-gradient hover:scale-105 transition duration-300 shadow-md cursor-pointer">
            Back to Orders Log
          </button>
        </Link>
      </div>
    );
  }

  const statusConf = ORDER_STATUS_CONFIG[order.status];
  const payConf = PAYMENT_STATUS_CONFIG[order.paymentStatus];

  const handleCancelOrder = () => {
    if (confirm('Are you sure you want to delete and cancel this order? This will free the table.')) {
      cancelOrder(order.id);
      router.push('/admin/orders');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Top Breadcrumb row */}
      <div className="flex items-center justify-between gap-4 border-b border-border/20 pb-5">
        <div className="flex items-center gap-3">
          <Link href="/admin/orders" className="flex items-center justify-center h-10 w-10 rounded-full border border-border bg-card/65 text-muted-foreground hover:text-gold hover:border-gold transition">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-display font-semibold tracking-tight uppercase">Order Details</h1>
            <p className="text-xs text-muted-foreground mt-0.5">ID: {order.id} • Table {order.tableNumber}</p>
          </div>
        </div>

        <button
          onClick={handleCancelOrder}
          className="flex items-center gap-1.5 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-2 text-xs font-semibold text-destructive hover:bg-destructive/20 transition cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
          <span className="hidden sm:inline">Delete Order</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details & Items receipt */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Order Details List */}
          <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border/20 bg-surface-1/45">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Order Breakdown</h2>
            </div>
            
            <div className="divide-y divide-border/20 px-5">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-4 flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">
                      {item.name} <span className="text-gold font-bold mx-1">x{item.quantity}</span>
                    </p>
                    {item.specialInstructions && (
                      <p className="text-[10px] text-gold/80 italic bg-gold/5 px-2 py-0.5 rounded border border-gold/10 w-fit mt-1">
                        “{item.specialInstructions}”
                      </p>
                    )}
                  </div>
                  <span className="font-bold text-foreground">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations summaries */}
            <div className="p-5 border-t border-border/20 bg-card/65 space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Tax (5%)</span>
                <span>{formatCurrency(order.tax)}</span>
              </div>
              <div className="flex justify-between text-foreground font-bold text-sm pt-2 border-t border-border/10">
                <span>Total Value</span>
                <span className="text-gold">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Table Cooking Notes */}
          {order.notes && (
            <div className="rounded-xl border border-border/50 bg-card p-5 space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <ChefHat className="h-4 w-4 text-gold" />
                <span>Special Table Cooking Instructions</span>
              </h3>
              <p className="text-xs text-foreground bg-surface-2/30 p-3 rounded-lg border border-border/40 italic leading-relaxed">
                “{order.notes}”
              </p>
            </div>
          )}

          {/* Time logs */}
          <div className="rounded-xl border border-border/50 bg-card p-5 grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Placed date
              </span>
              <p className="font-semibold">{formatDate(order.createdAt)}</p>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> Placed time
              </span>
              <p className="font-semibold">{formatTime(order.createdAt)}</p>
            </div>
          </div>

        </div>

        {/* Right Column: Interactive Status Modification Panels */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border/50 bg-card p-6 space-y-6 relative overflow-hidden">
            {/* Top luxury line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gold gold-gradient" />

            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Action Controls</h2>

            {/* Current status display */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Meal Production status</span>
                <div className="flex items-center gap-3">
                  <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-xs font-bold border", statusConf.color)}>
                    {statusConf.label}
                  </span>
                </div>
              </div>

              {/* Status Update Trigger Select */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Update Queue Column</label>
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                  className="w-full rounded-lg border border-border bg-surface-2/45 px-3 py-2 text-xs focus:outline-none focus:border-gold cursor-pointer"
                >
                  <option value="pending">Pending (Kitchen Queue)</option>
                  <option value="preparing">Preparing (Chef Cooking)</option>
                  <option value="ready">Ready to Serve (Wait Staff alert)</option>
                  <option value="completed">Completed (Served & Done)</option>
                </select>
              </div>
            </div>

            <div className="border-t border-border/20 pt-5 space-y-4">
              {/* Payment status display */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Cash Transaction Status</span>
                <div className="flex items-center gap-3">
                  <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-xs font-bold border", payConf.color)}>
                    {payConf.label}
                  </span>
                </div>
              </div>

              {/* Payment Update Trigger Select */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Update Payment Status</label>
                <select
                  value={order.paymentStatus}
                  onChange={(e) => updatePaymentStatus(order.id, e.target.value as any)}
                  className="w-full rounded-lg border border-border bg-surface-2/45 px-3 py-2 text-xs focus:outline-none focus:border-gold cursor-pointer"
                >
                  <option value="pending">Pending Payment (Unpaid)</option>
                  <option value="paid">Paid (Cash/Card Collected)</option>
                </select>
              </div>
            </div>
            
            <div className="text-[10px] text-muted-foreground/60 leading-relaxed pt-2 border-t border-border/20">
              Modifying these values will automatically trigger real-time layout updates across the Kitchen, Waiter, and Tables dashboard viewboards instantly.
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
