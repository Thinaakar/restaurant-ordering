"use client";

import React, { useState, useMemo } from "react";
import { useOrders } from "@/hooks/use-orders";
import { Clock, CheckCircle2, AlertCircle, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatTime,
  getOrderTimeDuration,
  formatCurrency,
} from "@/lib/formatters-advanced";
import type { OrderStatus } from "@/data/types";

export default function KitchenQueuePage() {
  const { orders, updateOrderStatus } = useOrders();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Organize orders by status
  const pendingOrders = useMemo(
    () => orders.filter((o) => o.status === "pending"),
    [orders],
  );
  const preparingOrders = useMemo(
    () => orders.filter((o) => o.status === "preparing"),
    [orders],
  );
  const readyOrders = useMemo(
    () => orders.filter((o) => o.status === "ready"),
    [orders],
  );
  const completedOrders = useMemo(
    () => orders.filter((o) => o.status === "completed"),
    [orders],
  );

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const KitchenOrderCard = ({
    order,
    isPriority = false,
  }: {
    order: any;
    isPriority?: boolean;
  }) => {
    const isSelected = selectedOrderId === order.id;

    return (
      <div
        onClick={() => setSelectedOrderId(isSelected ? null : order.id)}
        className={cn(
          "border-2 rounded-lg p-4 cursor-pointer transition-all duration-300",
          isSelected
            ? "border-gold bg-gold/10 ring-2 ring-gold/50"
            : "border-border/50 bg-surface-1/50 hover:border-border hover:bg-surface-2/50",
          isPriority && "ring-2 ring-ruby/50",
        )}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="text-xl">🍽️</div>
            <div>
              <p className="font-mono text-sm font-bold text-foreground">
                {order.id}
              </p>
              <p className="text-xs text-muted-foreground">
                Table {order.tableNumber}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isPriority && (
              <span className="px-2 py-1 bg-ruby/20 text-ruby rounded text-xs font-bold">
                PRIORITY
              </span>
            )}
            <span className="px-2 py-1 bg-surface-2 text-xs font-bold rounded">
              {getOrderTimeDuration(order.createdAt, order.updatedAt)}
            </span>
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-1 mb-3 pb-3 border-b border-border/30 max-h-40 overflow-y-auto">
          {order.items.map((item: any, idx: number) => (
            <div key={idx} className="flex items-start justify-between text-xs">
              <span className="text-foreground">
                <span className="font-bold text-gold">{item.quantity}x</span>{" "}
                {item.name}
              </span>
              <span className="text-muted-foreground italic">
                {item.preparationTime || "15"}m
              </span>
            </div>
          ))}
        </div>

        {/* Special Instructions */}
        {order.notes && (
          <div className="mb-3 p-2 rounded bg-amber-500/10 border border-amber-500/30">
            <p className="text-xs font-semibold text-amber-300 mb-1">
              📝 Special Instructions:
            </p>
            <p className="text-xs text-amber-200/80">{order.notes}</p>
          </div>
        )}

        {/* Status Buttons */}
        {isSelected && (
          <div className="space-y-2 pt-3 border-t border-border/30">
            {order.status === "pending" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(order.id, "preparing");
                }}
                className="w-full py-2 px-3 rounded-lg bg-blue-500/20 border border-blue-500/50 text-blue-300 font-bold uppercase tracking-widest text-xs hover:bg-blue-500/30 transition"
              >
                👨‍🍳 Start Preparing
              </button>
            )}
            {order.status === "preparing" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(order.id, "ready");
                }}
                className="w-full py-2 px-3 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-bold uppercase tracking-widest text-xs hover:bg-emerald-500/30 transition"
              >
                ✅ Mark Ready
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const OrderQueue = ({ title, orders: queueOrders, icon, color }: any) => (
    <div className="glass rounded-lg border border-border/50 p-6">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border/30">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <h3 className="font-display font-semibold text-foreground">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground">
            {queueOrders.length} order{queueOrders.length !== 1 ? "s" : ""}
          </p>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${color}`}>
          {queueOrders.length}
        </span>
      </div>

      {queueOrders.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">No orders in this queue</p>
          <p className="text-xs mt-1">Check back soon!</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {queueOrders.map((order: any) => (
            <KitchenOrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">👨‍🍳</span>
          <h1 className="text-3xl md:text-4xl font-display font-semibold tracking-tight">
            Kitchen Queue
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Manage orders and track preparation status
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass rounded-lg border border-border/50 p-4 text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
            Pending
          </p>
          <p className="text-3xl font-bold text-amber-400">
            {pendingOrders.length}
          </p>
        </div>
        <div className="glass rounded-lg border border-border/50 p-4 text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
            Preparing
          </p>
          <p className="text-3xl font-bold text-blue-400">
            {preparingOrders.length}
          </p>
        </div>
        <div className="glass rounded-lg border border-border/50 p-4 text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
            Ready
          </p>
          <p className="text-3xl font-bold text-emerald-400">
            {readyOrders.length}
          </p>
        </div>
        <div className="glass rounded-lg border border-border/50 p-4 text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
            Completed
          </p>
          <p className="text-3xl font-bold text-green-400">
            {completedOrders.length}
          </p>
        </div>
      </div>

      {/* Order Queues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderQueue
          title="Pending Orders"
          orders={pendingOrders}
          icon="⏳"
          color="bg-amber-500/20 text-amber-300"
        />
        <OrderQueue
          title="Preparing"
          orders={preparingOrders}
          icon="👨‍🍳"
          color="bg-blue-500/20 text-blue-300"
        />
      </div>

      {/* Ready & Completed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderQueue
          title="Ready for Delivery"
          orders={readyOrders}
          icon="✅"
          color="bg-emerald-500/20 text-emerald-300"
        />
        <OrderQueue
          title="Completed Orders"
          orders={completedOrders.slice(0, 10)}
          icon="🎉"
          color="bg-green-500/20 text-green-300"
        />
      </div>

      {/* Tips */}
      <div className="glass rounded-lg border border-border/50 p-6">
        <h3 className="font-display font-semibold mb-3 flex items-center gap-2">
          <span>💡</span>
          Kitchen Tips
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>✓ Click on an order to see details and mark status</li>
          <li>✓ Longer wait times are highlighted as priority</li>
          <li>✓ Check special instructions before preparing</li>
          <li>✓ Mark items as ready immediately when done</li>
        </ul>
      </div>
    </div>
  );
}
