'use client';

import React, { useMemo, useState } from 'react';
import { useOrders } from '@/hooks/use-orders';
import type { Order } from '@/data/types';
import { formatCurrency, formatTime } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Receipt,
  WalletCards,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function CashierPage() {
  const { orders, updatePaymentStatus } = useOrders();
  const [activeBillOrder, setActiveBillOrder] = useState<Order | null>(null);

  const completedOrders = useMemo(
    () => orders.filter((order) => order.status === 'completed'),
    [orders]
  );

  const paidOrders = completedOrders.filter((order) => order.paymentStatus === 'paid');
  const pendingOrders = completedOrders.filter((order) => order.paymentStatus === 'pending');
  const paidRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0);
  const pendingRevenue = pendingOrders.reduce((sum, order) => sum + order.total, 0);



  const handlePaymentToggle = (order: Order) => {
    updatePaymentStatus(order.id, order.paymentStatus === 'paid' ? 'pending' : 'paid');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/20 pb-5">
        <div>
          <h1 className="text-3xl font-display font-semibold tracking-tight uppercase">Cashier</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Review completed bills, manage payment status, and monitor table-wise collections
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          {
            label: 'Completed Bills',
            value: completedOrders.length,
            icon: Receipt,
            color: 'border-gold/20 bg-gold/5 text-gold',
          },
          {
            label: 'Paid Collections',
            value: formatCurrency(paidRevenue),
            icon: CheckCircle2,
            color: 'border-emerald/20 bg-emerald/5 text-emerald',
          },
          {
            label: 'Pending Amount',
            value: formatCurrency(pendingRevenue),
            icon: AlertCircle,
            color: 'border-amber-500/20 bg-amber-500/5 text-amber-500 dark:text-amber-400',
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className={cn('rounded-xl border p-5 flex items-center justify-between', item.color)}>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-85">{item.label}</span>
                <p className="text-2xl font-bold tabular-nums">{item.value}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-card">
                <Icon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-border/50 bg-card overflow-hidden w-full animate-fade-in shadow-sm">
        <div className="px-5 py-4 border-b border-border/20 bg-surface-1/45 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <WalletCards className="h-4 w-4 text-gold" />
            <span>Completed Order Bills</span>
          </h2>
          <span className="text-[10px] font-bold bg-surface-2 border border-border px-2 py-0.5 rounded-full">
            {completedOrders.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/20 bg-surface-1/45 text-muted-foreground font-bold uppercase tracking-wider">
                <th className="px-5 py-3">Order ID</th>
                <th className="px-5 py-3">Table</th>
                <th className="px-5 py-3">Items</th>
                <th className="px-5 py-3">Bill Total</th>
                <th className="px-5 py-3">Payment</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {completedOrders.length > 0 ? (
                completedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-2/10 transition">
                    <td className="px-5 py-4 font-mono font-bold uppercase text-foreground">{order.id}</td>
                    <td className="px-5 py-4 font-semibold text-foreground">Table {order.tableNumber}</td>
                    <td className="px-5 py-4 text-muted-foreground">{order.items.length} items</td>
                    <td className="px-5 py-4 font-bold text-foreground">{formatCurrency(order.total)}</td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          'inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase',
                          order.paymentStatus === 'paid'
                            ? 'border-emerald/20 bg-emerald/10 text-emerald'
                            : 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        )}
                      >
                        {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveBillOrder(order)}
                          className="rounded-lg border border-border bg-card/65 px-3 py-2 text-[10px] font-bold uppercase text-muted-foreground hover:border-gold hover:text-gold transition"
                        >
                          Bill Details
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePaymentToggle(order)}
                          className={cn(
                            'rounded-lg border px-3 py-2 text-[10px] font-bold uppercase transition',
                            order.paymentStatus === 'paid'
                              ? 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-black'
                              : 'border-emerald/20 bg-emerald/10 text-emerald hover:bg-emerald hover:text-black'
                          )}
                        >
                          Mark {order.paymentStatus === 'paid' ? 'Pending' : 'Paid'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                    No completed orders are ready for billing yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {activeBillOrder && (
        <Dialog open={!!activeBillOrder} onOpenChange={(open) => !open && setActiveBillOrder(null)}>
          <DialogContent className="max-w-sm p-6 rounded-xl">
            <DialogHeader>
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-gold/15 text-gold border border-gold/20 mb-3">
                <CreditCard className="h-5 w-5" />
              </div>
              <DialogTitle className="text-center font-display font-semibold text-lg">
                Bill Details
              </DialogTitle>
              <p className="text-[10px] text-muted-foreground text-center mt-1 uppercase font-semibold">
                Order ID: {activeBillOrder.id} - Table {activeBillOrder.tableNumber} - {formatTime(activeBillOrder.updatedAt)}
              </p>
            </DialogHeader>

            <div className="space-y-4 my-3 text-xs">
              <div className="divide-y divide-border/20 border-y border-border/25 py-2">
                {activeBillOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-1.5 font-medium">
                    <span>{item.name} x{item.quantity}</span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-2 text-[11px] text-muted-foreground">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(activeBillOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST Tax (5%)</span>
                  <span>{formatCurrency(activeBillOrder.tax)}</span>
                </div>
                <div className="flex justify-between text-foreground font-bold text-sm pt-2 border-t border-border/10">
                  <span>Grand Total</span>
                  <span className="text-gold">{formatCurrency(activeBillOrder.total)}</span>
                </div>
              </div>

              <div className="border-t border-border/20 pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setActiveBillOrder(null)}
                  className="flex-1 rounded-lg border border-border bg-card/65 py-2.5 text-[10px] font-semibold uppercase hover:bg-surface-2 transition text-center text-muted-foreground"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handlePaymentToggle(activeBillOrder);
                    setActiveBillOrder(null);
                  }}
                  className={cn(
                    "flex-1 rounded-lg py-2.5 text-[10px] font-bold uppercase tracking-wider transition-all duration-300 shadow-sm text-center border cursor-pointer hover:scale-[1.02]",
                    activeBillOrder.paymentStatus === 'paid'
                      ? "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-black"
                      : "border-emerald/20 bg-emerald/10 text-emerald hover:bg-emerald hover:text-black"
                  )}
                >
                  Mark {activeBillOrder.paymentStatus === 'paid' ? 'Pending' : 'Paid'}
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
