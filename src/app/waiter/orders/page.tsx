'use client';

import React, { useState, useMemo } from 'react';
import { useOrders } from '@/hooks/use-orders';
import { useTables } from '@/hooks/use-tables';
import { Clock, Eye, Search, Filter, ChefHat, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/formatters';
import { getOrderTimeDuration } from '@/lib/formatters-advanced';

export default function ActiveOrdersPage() {
  const { orders } = useOrders();
  const { tables } = useTables();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = searchTerm === '' || 
        order.tableNumber.toString().includes(searchTerm) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus && order.status !== 'completed';
    });
  }, [orders, searchTerm, statusFilter]);

  // Group orders by status
  const ordersByStatus = useMemo(() => {
    return {
      pending: filteredOrders.filter(o => o.status === 'pending'),
      preparing: filteredOrders.filter(o => o.status === 'preparing'),
      ready: filteredOrders.filter(o => o.status === 'ready'),
    };
  }, [filteredOrders]);

  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-amber-300 bg-amber-500/20 border-amber-500/30';
      case 'preparing': return 'text-blue-300 bg-blue-500/20 border-blue-500/30';
      case 'ready': return 'text-emerald-300 bg-emerald-500/20 border-emerald-500/30';
      default: return 'text-muted-foreground bg-surface-2 border-border/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'preparing': return <ChefHat className="h-4 w-4" />;
      case 'ready': return <CheckCircle2 className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const OrderCard = ({ order }: { order: any }) => {
    const table = tables.find(t => t.id === order.tableId);
    const isSelected = selectedOrderId === order.id;
    
    return (
      <div
        onClick={() => setSelectedOrderId(isSelected ? null : order.id)}
        className={cn(
          "border-2 rounded-lg p-4 cursor-pointer transition-all duration-300",
          isSelected
            ? "border-gold bg-gold/10 ring-2 ring-gold/50"
            : "border-border/50 bg-surface-1/50 hover:border-border hover:bg-surface-2/50"
        )}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-2 text-sm font-bold">
              {order.tableNumber}
            </div>
            <div>
              <p className="font-semibold text-foreground">Table {order.tableNumber}</p>
              <p className="text-xs text-muted-foreground">Order #{order.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
            <span className={cn(
              "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1",
              getStatusColor(order.status)
            )}>
              {getStatusIcon(order.status)}
              {order.status}
            </span>
            <span className="px-2.5 py-1 bg-surface-2 text-[10px] font-bold rounded text-muted-foreground">
              {getOrderTimeDuration(order.createdAt, order.updatedAt)}
            </span>
          </div>
        </div>

        {/* Order Items Preview */}
        <div className="space-y-1 mb-3 pb-3 border-b border-border/30">
          {order.items.slice(0, 3).map((item: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <span className="text-foreground">
                <span className="font-bold text-gold">{item.quantity}x</span> {item.name}
              </span>
              <span className="text-muted-foreground">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
          {order.items.length > 3 && (
            <p className="text-xs text-muted-foreground italic">
              +{order.items.length - 3} more items
            </p>
          )}
        </div>

        {/* Order Summary */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {order.items.length} item{order.items.length !== 1 ? 's' : ''} • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-sm font-bold text-gold">
            {formatCurrency(order.total)}
          </div>
        </div>

        {/* Special Instructions */}
        {order.notes && (
          <div className="mt-3 p-2 rounded bg-amber-500/10 border border-amber-500/30">
            <p className="text-xs font-semibold text-amber-300 mb-1">📝 Special Instructions:</p>
            <p className="text-xs text-amber-200/80">{order.notes}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">📋</span>
          <h1 className="text-3xl md:text-4xl font-display font-semibold tracking-tight">
            Active Orders
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Monitor and manage all active table orders
        </p>
      </div>

      {/* Filters */}
      <div className="glass rounded-lg border border-border/50 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by table, order ID, or item name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-2 border border-border/50 rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-gold/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-surface-2 border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-gold/50"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Orders List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Orders */}
          {ordersByStatus.pending.length > 0 && (
            <div className="glass rounded-lg border border-border/50 p-6">
              <h3 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-400" />
                Pending Orders ({ordersByStatus.pending.length})
              </h3>
              <div className="space-y-3">
                {ordersByStatus.pending.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            </div>
          )}

          {/* Preparing Orders */}
          {ordersByStatus.preparing.length > 0 && (
            <div className="glass rounded-lg border border-border/50 p-6">
              <h3 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
                <ChefHat className="h-5 w-5 text-blue-400" />
                Preparing Orders ({ordersByStatus.preparing.length})
              </h3>
              <div className="space-y-3">
                {ordersByStatus.preparing.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            </div>
          )}

          {/* Ready Orders */}
          {ordersByStatus.ready.length > 0 && (
            <div className="glass rounded-lg border border-border/50 p-6">
              <h3 className="text-lg font-display font-semibold mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                Ready for Delivery ({ordersByStatus.ready.length})
              </h3>
              <div className="space-y-3">
                {ordersByStatus.ready.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            </div>
          )}

          {/* No Orders */}
          {filteredOrders.length === 0 && (
            <div className="glass rounded-lg border border-border/50 p-12 text-center">
              <ChefHat className="h-16 w-16 mx-auto opacity-30 mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Active Orders</h3>
              <p className="text-sm text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No orders match your current filters' 
                  : 'All orders have been completed or no orders have been placed yet'}
              </p>
            </div>
          )}
        </div>

        {/* Order Details Sidebar */}
        <div className="lg:col-span-1">
          <div className="glass rounded-lg border border-border/50 p-6 sticky top-6">
            <h3 className="text-lg font-display font-semibold mb-6 flex items-center gap-2">
              <Eye className="h-5 w-5 text-gold" />
              Order Details
            </h3>

            {!selectedOrder ? (
              <div className="text-center py-12 text-muted-foreground">
                <div className="text-6xl mb-4 opacity-30">📋</div>
                <p className="text-sm">Select an order to view details</p>
                <p className="text-xs mt-1">Click on any order card to see full information</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Order Header */}
                <div className="text-center p-4 rounded-lg bg-gold/10 border border-gold/30">
                  <h4 className="text-lg font-bold text-gold mb-2">
                    Table {selectedOrder.tableNumber}
                  </h4>
                  <p className="text-xs text-muted-foreground">Order #{selectedOrder.id}</p>
                  <div className="mt-2">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center justify-center gap-1 w-fit mx-auto",
                      getStatusColor(selectedOrder.status)
                    )}>
                      {getStatusIcon(selectedOrder.status)}
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h5 className="text-sm font-bold text-foreground mb-3">Order Items</h5>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded bg-surface-1/50">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(item.price)} × {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-gold">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-2 border-t border-border/30 pt-4">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Tax (5%)</span>
                    <span>{formatCurrency(selectedOrder.tax)}</span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-gold border-t border-border/30 pt-2">
                    <span>Total</span>
                    <span>{formatCurrency(selectedOrder.total)}</span>
                  </div>
                </div>

                {/* Order Timeline */}
                <div>
                  <h5 className="text-sm font-bold text-foreground mb-3">Order Timeline</h5>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-emerald"></div>
                      <span>Placed: {new Date(selectedOrder.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span>Updated: {new Date(selectedOrder.updatedAt).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>Duration: {getOrderTimeDuration(selectedOrder.createdAt, selectedOrder.updatedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Special Instructions */}
                {selectedOrder.notes && (
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <h5 className="text-xs font-bold text-amber-300 mb-2">📝 Special Instructions</h5>
                    <p className="text-xs text-amber-200/80">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}