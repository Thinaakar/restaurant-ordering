'use client';

import React, { useMemo, useState } from 'react';
import { useOrders } from '@/hooks/use-orders';
import { useTables } from '@/hooks/use-tables';
import { formatCurrency, formatTime, formatRelativeTime } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import {
  Clock,
  ChefHat,
  CheckCircle2,
  AlertCircle,
  Receipt,
  Search,
  Filter,
  Eye,
  X,
  CreditCard,
} from 'lucide-react';

export function ActiveOrders() {
  const { orders, updateOrderStatus, updatePaymentStatus } = useOrders();
  const { tables } = useTables();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Filter out completed orders and apply search/status filters
  const activeOrdersList = useMemo(() => {
    return orders.filter((order) => {
      const isCompleted = order.status === 'completed';
      if (isCompleted) return false;

      const matchesSearch =
        searchTerm === '' ||
        order.tableNumber.toString().includes(searchTerm) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some((i) => i.name.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'preparing':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'ready':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default:
        return 'text-muted-foreground bg-surface-2 border-border/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-3.5 w-3.5" />;
      case 'preparing':
        return <ChefHat className="h-3.5 w-3.5" />;
      case 'ready':
        return <CheckCircle2 className="h-3.5 w-3.5" />;
      default:
        return <AlertCircle className="h-3.5 w-3.5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row gap-4 bg-card/40 border border-border/40 p-4 rounded-xl backdrop-blur-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by table, ID, or dish name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-2 border border-border/50 rounded-lg text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-gold/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-surface-2 border border-border/50 rounded-lg text-xs text-foreground focus:outline-none focus:border-gold/50 cursor-pointer font-bold uppercase tracking-wider"
          >
            <option value="all">All Stages</option>
            <option value="pending">Pending</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
          </select>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Active Cards List */}
        <div className="xl:col-span-2 space-y-3">
          {activeOrdersList.length === 0 ? (
            <div className="text-center py-16 bg-card/25 border border-dashed border-border/30 rounded-xl">
              <ChefHat className="h-12 w-12 mx-auto opacity-20 mb-3" />
              <p className="text-sm font-semibold text-muted-foreground">No active table orders found</p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try relaxing your filters'
                  : 'Start placing new orders from the menu!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeOrdersList.map((order) => {
                const isSelected = selectedOrderId === order.id;

                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrderId(isSelected ? null : order.id)}
                    className={cn(
                      'border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-fit',
                      isSelected
                        ? 'border-gold bg-gold/5 ring-2 ring-gold/45 shadow-lg shadow-gold/5 scale-[1.01]'
                        : 'border-border/50 bg-card/45 hover:border-border hover:bg-card/75'
                    )}
                  >
                    <div>
                      {/* Top Row */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 border border-border/25 text-sm font-bold text-foreground">
                            {order.tableNumber}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-foreground">Table {order.tableNumber}</p>
                            <p className="text-[9px] font-mono text-muted-foreground uppercase">
                              #{order.id.slice(0, 8)}
                            </p>
                          </div>
                        </div>

                        <span
                          className={cn(
                            'px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border flex items-center gap-1',
                            getStatusColor(order.status)
                          )}
                        >
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </div>

                      {/* Items Preview */}
                      <div className="space-y-1 py-2 border-t border-b border-border/10 mb-3 text-[11px]">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span className="text-foreground truncate max-w-[150px]">
                              <span className="font-bold text-gold">{item.quantity}x</span>{' '}
                              {item.name}
                            </span>
                            <span className="text-muted-foreground shrink-0">
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <p className="text-[10px] text-muted-foreground italic mt-1">
                            +{order.items.length - 3} more items
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Footer / Total */}
                    <div className="flex items-center justify-between mt-1 text-[11px]">
                      <span className="text-muted-foreground">
                        {formatRelativeTime(order.createdAt)}
                      </span>
                      <span className="font-bold text-gold text-xs">
                        {formatCurrency(order.total)}
                      </span>
                    </div>

                    {/* Special Instructions Indicator */}
                    {order.notes && (
                      <div className="mt-2.5 p-1.5 rounded bg-amber-500/5 border border-amber-500/20 text-[9px] text-amber-300 line-clamp-1">
                        📝 {order.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Order Detail Panel */}
        <div className="xl:col-span-1">
          <div className="rounded-xl border border-border/50 bg-card p-5 sticky top-6 space-y-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Eye className="h-4 w-4 text-gold" />
              Order Info Panel
            </h3>

            {!selectedOrder ? (
              <div className="text-center py-12 text-muted-foreground">
                <div className="text-5xl mb-3 opacity-30">📋</div>
                <p className="text-xs font-semibold">No order selected</p>
                <p className="text-[10px] mt-1">Click on any card to view detailed ticket</p>
              </div>
            ) : (
              <div className="space-y-5 animate-fade-in text-xs">
                {/* Header Ticket block */}
                <div className="p-4 rounded-xl bg-gold/5 border border-gold/20 text-center space-y-1">
                  <h4 className="text-base font-bold text-gold">Table {selectedOrder.tableNumber}</h4>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                    Order ID: {selectedOrder.id}
                  </p>
                  <div className="pt-2 flex justify-center">
                    <span
                      className={cn(
                        'px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border flex items-center gap-1',
                        getStatusColor(selectedOrder.status)
                      )}
                    >
                      {getStatusIcon(selectedOrder.status)}
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-2">
                  <p className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground">
                    Ordered Dishes
                  </p>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {selectedOrder.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded bg-surface-2/40 border border-border/10"
                      >
                        <div>
                          <p className="font-bold text-foreground">
                            {item.name} <span className="text-gold">x{item.quantity}</span>
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {formatCurrency(item.price)} each
                          </p>
                        </div>
                        <p className="font-bold text-foreground">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Special Instructions Box */}
                {selectedOrder.notes && (
                  <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/25 space-y-1">
                    <p className="font-bold text-[9px] uppercase tracking-wider text-amber-300 flex items-center gap-1">
                      <span>📝</span> Special Instructions
                    </p>
                    <p className="text-amber-200/80 leading-relaxed text-[10px]">
                      {selectedOrder.notes}
                    </p>
                  </div>
                )}

                {/* Breakdown totals */}
                <div className="space-y-1.5 border-t border-border/15 pt-3">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax (5%)</span>
                    <span>{formatCurrency(selectedOrder.tax)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-gold border-t border-border/25 pt-2">
                    <span>Total Amount</span>
                    <span>{formatCurrency(selectedOrder.total)}</span>
                  </div>
                </div>

                {/* Timeline info */}
                <div className="space-y-1 text-[10px] text-muted-foreground border-t border-border/15 pt-3">
                  <p>Placed at: {formatTime(selectedOrder.createdAt)}</p>
                  <p>Last update: {formatTime(selectedOrder.updatedAt)}</p>
                </div>

                {/* Action controls */}
                <div className="space-y-2 pt-2 border-t border-border/15">
                  {selectedOrder.status === 'ready' && (
                    <button
                      onClick={() => updateOrderStatus(selectedOrder.id, 'completed')}
                      className="w-full py-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald hover:text-black rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Mark Served & Complete
                    </button>
                  )}
                  {selectedOrder.status === 'completed' && selectedOrder.paymentStatus !== 'paid' && (
                    <button
                      onClick={() => updatePaymentStatus(selectedOrder.id, 'paid')}
                      className="w-full py-2.5 gold-gradient text-black rounded-lg text-xs font-bold uppercase tracking-wider hover:scale-[1.01] hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CreditCard className="h-4 w-4" />
                      Collect Cash Payment
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedOrderId(null)}
                    className="w-full py-2 bg-surface-2 text-muted-foreground rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-surface-3 transition"
                  >
                    Close Panel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
