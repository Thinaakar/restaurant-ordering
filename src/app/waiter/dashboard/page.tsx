'use client';

import React from 'react';
import Link from 'next/link';
import { useTables } from '@/hooks/use-tables';
import { useOrders } from '@/hooks/use-orders';
import { Clock, Users, ShoppingCart, ChefHat, Plus, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/formatters';

export default function WaiterDashboard() {
  const { tables } = useTables();
  const { orders } = useOrders();

  // Calculate stats
  const availableTables = tables.filter(t => t.status === 'available').length;
  const occupiedTables = tables.filter(t => t.status === 'occupied').length;
  const activeOrders = orders.filter(o => ['pending', 'preparing'].includes(o.status)).length;
  const todayRevenue = orders
    .filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString())
    .reduce((sum, o) => sum + o.total, 0);

  const recentOrders = orders
    .filter(o => o.status !== 'completed')
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">👨💼</span>
          <h1 className="text-3xl md:text-4xl font-display font-semibold tracking-tight">
            Waiter Dashboard
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Manage table orders and customer service operations
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass rounded-lg border border-border/50 p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Users className="h-6 w-6 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400">{availableTables}</p>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Available Tables</p>
        </div>
        
        <div className="glass rounded-lg border border-border/50 p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="h-6 w-6 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-blue-400">{occupiedTables}</p>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Occupied Tables</p>
        </div>
        
        <div className="glass rounded-lg border border-border/50 p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <ShoppingCart className="h-6 w-6 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400">{activeOrders}</p>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Active Orders</p>
        </div>
        
        <div className="glass rounded-lg border border-border/50 p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <span className="text-xl">💰</span>
          </div>
          <p className="text-2xl font-bold text-gold">{formatCurrency(todayRevenue)}</p>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Today's Revenue</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/waiter/tables" className="group">
          <div className="glass rounded-xl border border-border/50 p-6 hover:border-gold/50 transition-all duration-300 hover:shadow-lg hover:shadow-gold/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold border border-gold/20 group-hover:scale-110 transition duration-300">
                <Plus className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-gold transition">
                  New Order
                </h3>
                <p className="text-sm text-muted-foreground">
                  Select table and take customer order
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold">
              <span>Start Taking Order</span>
              <Plus className="h-3.5 w-3.5" />
            </div>
          </div>
        </Link>

        <Link href="/waiter/orders" className="group">
          <div className="glass rounded-xl border border-border/50 p-6 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:scale-110 transition duration-300">
                <Eye className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-blue-400 transition">
                  Active Orders
                </h3>
                <p className="text-sm text-muted-foreground">
                  View and manage current table orders
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
              <span>View Orders</span>
              <Eye className="h-3.5 w-3.5" />
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="glass rounded-xl border border-border/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-display font-semibold text-foreground">Recent Orders</h3>
          <Link href="/waiter/orders" className="text-xs font-bold uppercase tracking-widest text-gold hover:text-gold/80 transition">
            View All
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <ChefHat className="h-12 w-12 mx-auto opacity-30 mb-4" />
            <p className="text-sm">No recent orders</p>
            <p className="text-xs mt-1">Orders will appear here once placed</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 rounded-lg bg-surface-1/50 border border-border/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 text-sm font-bold">
                    {order.tableNumber}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">Table {order.tableNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''} • {formatCurrency(order.total)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                    order.status === 'pending' ? 'bg-amber-500/20 text-amber-300' :
                    order.status === 'preparing' ? 'bg-blue-500/20 text-blue-300' :
                    order.status === 'ready' ? 'bg-emerald-500/20 text-emerald-300' :
                    'bg-green-500/20 text-green-300'
                  )}>
                    {order.status}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Table Status Overview */}
      <div className="glass rounded-xl border border-border/50 p-6">
        <h3 className="text-lg font-display font-semibold text-foreground mb-6">Table Status Overview</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {tables.map((table) => (
            <div
              key={table.id}
              className={cn(
                "p-3 rounded-lg border-2 text-center transition-all duration-300",
                table.status === 'available'
                  ? 'border-emerald/40 bg-emerald-500/5'
                  : table.status === 'occupied'
                    ? 'border-blue-500/40 bg-blue-500/5'
                    : 'border-amber-500/40 bg-amber-500/5'
              )}
            >
              <div className="text-lg font-bold text-foreground">{table.number}</div>
              <div className="text-xs text-muted-foreground">{table.seats} seats</div>
              <div className={cn(
                "text-[9px] font-bold uppercase tracking-wider mt-1",
                table.status === 'available' ? 'text-emerald' :
                table.status === 'occupied' ? 'text-blue-400' : 'text-amber-400'
              )}>
                {table.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}