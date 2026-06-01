'use client';

import React, { useState } from 'react';
import { useOrders } from '@/hooks/use-orders';
import { useToast } from '@/hooks/use-toast';
import type { Order } from '@/data/types';
import { formatCurrency, formatTime } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { CheckCircle2, Receipt, Truck, CreditCard, X } from 'lucide-react';

export default function WaiterDeliveryPage() {
  const { orders, updateOrderStatus, updatePaymentStatus } = useOrders();
  const { addToast } = useToast();
  const [billOrder, setBillOrder] = useState<Order | null>(null);

  const readyOrders = orders.filter((o) => o.status === 'ready');
  const completedOrders = orders.filter((o) => o.status === 'completed');

  return (
    <div className="space-y-8">
      <div className="border-b border-border/20 pb-4">
        <h1 className="text-2xl font-display font-semibold tracking-tight">Ready for Delivery</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Deliver food and collect payments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-center">
          <p className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Ready to Deliver</p>
          <p className="text-3xl font-bold tabular-nums text-amber-400 mt-1">{readyOrders.length}</p>
        </div>
        <div className="rounded-xl border border-emerald/30 bg-emerald-500/5 p-4 text-center">
          <p className="text-[10px] uppercase font-bold text-emerald tracking-wider">Delivered Today</p>
          <p className="text-3xl font-bold tabular-nums text-emerald mt-1">{completedOrders.length}</p>
        </div>
      </div>

      {/* Ready Orders */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Truck className="h-4 w-4 text-gold" /> Ready Orders
        </h2>

        {readyOrders.length === 0 ? (
          <div className="py-10 text-center border border-dashed border-border/30 rounded-xl text-xs text-muted-foreground/60 uppercase font-bold">
            No orders ready for delivery
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {readyOrders.map((ord) => (
              <div key={ord.id} className="rounded-xl border border-emerald/25 bg-emerald-500/5 p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold text-foreground uppercase">{ord.id}</p>
                    <p className="text-xl font-bold text-gold mt-0.5">Table {ord.tableNumber}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-bold">{formatTime(ord.updatedAt)}</span>
                </div>

                <div className="space-y-1 text-xs text-muted-foreground">
                  {ord.items.map((i, idx) => (
                    <p key={idx}>• {i.name} <span className="text-foreground font-bold">x{i.quantity}</span></p>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm font-bold border-t border-border/20 pt-3">
                  <span className="text-muted-foreground text-xs">Total</span>
                  <span className="text-gold">{formatCurrency(ord.total)}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      updateOrderStatus(ord.id, 'completed');
                      addToast({
                        title: 'Order Delivered',
                        description: `Table ${ord.tableNumber} - Order completed`,
                        type: 'success',
                      });
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 py-2.5 text-[10px] font-bold uppercase tracking-wider text-emerald hover:bg-emerald hover:text-black transition cursor-pointer"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Mark Delivered
                  </button>
                  <button
                    onClick={() => setBillOrder(ord)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-gold/10 border border-gold/25 py-2.5 text-[10px] font-bold uppercase tracking-wider text-gold hover:bg-gold hover:text-black transition cursor-pointer"
                  >
                    <Receipt className="h-3.5 w-3.5" />
                    View Bill
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Orders */}
      {completedOrders.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-gold" /> Completed Deliveries
          </h2>
          <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/20 bg-surface-1/45 text-muted-foreground font-bold uppercase tracking-wider">
                    <th className="px-4 py-3 text-left">Order</th>
                    <th className="px-4 py-3 text-left">Table</th>
                    <th className="px-4 py-3 text-left">Items</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3 text-center">Payment</th>
                    <th className="px-4 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {completedOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-surface-2/10 transition">
                      <td className="px-4 py-3 font-mono font-bold text-foreground">{ord.id}</td>
                      <td className="px-4 py-3 text-foreground">Table {ord.tableNumber}</td>
                      <td className="px-4 py-3 text-muted-foreground">{ord.items.length} items</td>
                      <td className="px-4 py-3 text-right font-bold text-foreground">{formatCurrency(ord.total)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn(
                          'inline-block rounded-full px-2 py-0.5 text-[9px] font-bold border',
                          ord.paymentStatus === 'paid'
                            ? 'border-emerald/30 bg-emerald/10 text-emerald'
                            : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                        )}>
                          {ord.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => setBillOrder(ord)}
                          className="inline-flex items-center gap-1 rounded border border-border bg-card/50 px-2 py-1 text-[9px] font-bold uppercase text-muted-foreground hover:border-gold hover:text-gold transition"
                        >
                          <Receipt className="h-3 w-3" /> Bill
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Bill Modal */}
      {billOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 space-y-5 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gold gold-gradient" />

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-semibold text-lg">Bill Details</h3>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">{billOrder.id} • Table {billOrder.tableNumber}</p>
              </div>
              <button onClick={() => setBillOrder(null)} className="text-muted-foreground hover:text-foreground transition">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="divide-y divide-border/20 border-y border-border/25 py-2 text-xs">
              {billOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between py-1.5 font-medium">
                  <span>{item.name} x{item.quantity}</span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(billOrder.subtotal)}</span></div>
              <div className="flex justify-between"><span>GST (5%)</span><span>{formatCurrency(billOrder.tax)}</span></div>
              <div className="flex justify-between text-foreground font-bold text-sm border-t border-border/20 pt-2">
                <span>Grand Total</span>
                <span className="text-gold">{formatCurrency(billOrder.total)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs border-t border-border/20 pt-3">
              <span className="text-muted-foreground font-bold uppercase">Payment Status</span>
              <span className={cn(
                'rounded-full px-2.5 py-1 font-bold border text-[10px]',
                billOrder.paymentStatus === 'paid'
                  ? 'border-emerald/30 bg-emerald/10 text-emerald'
                  : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
              )}>
                {billOrder.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
              </span>
            </div>

            {billOrder.paymentStatus !== 'paid' && (
              <button
                onClick={() => {
                  updatePaymentStatus(billOrder.id, 'paid');
                  setBillOrder(null);
                  addToast({
                    title: 'Payment Collected',
                    description: `Payment received for ${billOrder.id}`,
                    type: 'success',
                  });
                }}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-gold py-3 text-xs font-bold uppercase tracking-wider text-black gold-gradient hover:scale-[1.02] transition cursor-pointer shadow-md"
              >
                <CreditCard className="h-4 w-4" />
                Confirm Payment Collected
              </button>
            )}

            <button
              onClick={() => setBillOrder(null)}
              className="w-full py-2 rounded-lg border border-border text-xs font-bold uppercase text-muted-foreground hover:bg-surface-2 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
