"use client";

import React, { useState } from "react";
import { useOrders } from "@/hooks/use-orders";
import { formatCurrency, formatTime } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { ORDER_STATUS_CONFIG, PAYMENT_STATUS_CONFIG } from "@/lib/constants";
import { Eye, Calendar } from "lucide-react";
import { getOrderTimeDuration } from "@/lib/formatters-advanced";

export default function AdminOrdersPage() {
  const { orders } = useOrders();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  return (
    <div className="w-full">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/20 pb-5 mb-8">
        <div>
          <h1 className="text-3xl font-display font-semibold tracking-tight">
            Orders
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Take and manage orders
          </p>
        </div>
      </div>

      {/* Grid or Table listing */}
      {orders.length > 0 ? (
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-border/20 bg-surface-1/45 text-muted-foreground font-bold uppercase tracking-wider">
                  <th className="px-5 py-4">Order ID</th>
                  <th className="px-5 py-4">Table</th>
                  <th className="px-5 py-4">Dishes Ordered</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Payment</th>
                  <th className="px-5 py-4">Time Placed</th>
                  <th className="px-5 py-4 text-right">Grand Total</th>
                  <th className="px-5 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 font-medium">
                {orders.map((ord) => {
                  const statusConf = ORDER_STATUS_CONFIG[ord.status];
                  const payConf = PAYMENT_STATUS_CONFIG[ord.paymentStatus];
                  const isExpanded = expandedOrderId === ord.id;

                  return (
                    <React.Fragment key={ord.id}>
                      <tr
                        onClick={() =>
                          setExpandedOrderId(isExpanded ? null : ord.id)
                        }
                        className="hover:bg-surface-2/10 transition-colors group cursor-pointer"
                      >
                        {/* ID */}
                        <td className="px-5 py-4 font-mono font-bold uppercase text-foreground">
                          {ord.id}
                        </td>

                        {/* Table */}
                        <td className="px-5 py-4 text-foreground">
                          Table {ord.tableNumber}
                        </td>

                        {/* Items summarize list */}
                        <td className="px-5 py-4 text-muted-foreground max-w-[200px] truncate">
                          {ord.items
                            .map((i) => `${i.name} (${i.quantity})`)
                            .join(", ")}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span
                            className={cn(
                              "inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold border",
                              statusConf.color,
                            )}
                          >
                            {statusConf.label}
                          </span>
                        </td>

                        {/* Payment status */}
                        <td className="px-5 py-4">
                          <span
                            className={cn(
                              "inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold border",
                              payConf.color,
                            )}
                          >
                            {payConf.label}
                          </span>
                        </td>

                        {/* Time */}
                        <td className="px-5 py-4 text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 shrink-0" />
                            <span>{formatTime(ord.createdAt)}</span>
                          </div>
                        </td>

                        {/* Total cost */}
                        <td className="px-5 py-4 text-right font-bold text-foreground">
                          {formatCurrency(ord.total)}
                        </td>

                        {/* Actions link */}
                        <td className="px-5 py-4 text-center">
                          <button className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card/50 text-muted-foreground hover:border-gold hover:text-gold transition">
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="border-t border-border/30 bg-surface-1/30">
                          <td colSpan={8} className="px-5 py-4">
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold text-foreground mb-2">
                                  📦 Order Details
                                </h4>
                                <div className="space-y-1">
                                  {ord.items.map((item, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center justify-between text-sm bg-surface-2/50 p-2 rounded"
                                    >
                                      <div>
                                        <span className="text-foreground font-semibold">
                                          {item.quantity}x {item.name}
                                        </span>
                                        {item.specialInstructions && (
                                          <p className="text-xs text-muted-foreground mt-1">
                                            📝 {item.specialInstructions}
                                          </p>
                                        )}
                                      </div>
                                      <span className="text-gold font-bold">
                                        {formatCurrency(
                                          item.price * item.quantity,
                                        )}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div className="bg-surface-2/50 p-3 rounded">
                                  <p className="text-muted-foreground text-xs mb-1">
                                    Subtotal
                                  </p>
                                  <p className="font-semibold text-foreground">
                                    {formatCurrency(ord.subtotal)}
                                  </p>
                                </div>
                                <div className="bg-surface-2/50 p-3 rounded">
                                  <p className="text-muted-foreground text-xs mb-1">
                                    Tax
                                  </p>
                                  <p className="font-semibold text-foreground">
                                    {formatCurrency(ord.tax)}
                                  </p>
                                </div>
                                <div className="bg-surface-2/50 p-3 rounded">
                                  <p className="text-muted-foreground text-xs mb-1">
                                    Duration
                                  </p>
                                  <p className="font-semibold text-foreground">
                                    {getOrderTimeDuration(
                                      ord.createdAt,
                                      ord.updatedAt,
                                    )}
                                  </p>
                                </div>
                                <div className="bg-gold/10 border border-gold/30 p-3 rounded">
                                  <p className="text-muted-foreground text-xs mb-1">
                                    Total
                                  </p>
                                  <p className="font-bold text-gold text-lg">
                                    {formatCurrency(ord.total)}
                                  </p>
                                </div>
                              </div>

                              {ord.notes && (
                                <div className="bg-amber-500/10 border border-amber-500/30 rounded p-3">
                                  <p className="text-xs font-semibold text-amber-300 mb-1">
                                    📝 Special Instructions:
                                  </p>
                                  <p className="text-sm text-amber-200/80">
                                    {ord.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="py-16 text-center space-y-2 border border-border/40 rounded-2xl bg-card/10">
          <p className="text-base text-muted-foreground font-semibold">
            No orders to display.
          </p>
        </div>
      )}
    </div>
  );
}
