'use client';

import React, { useMemo, useState } from 'react';
import { useOrders } from '@/hooks/use-orders';
import { useTables } from '@/hooks/use-tables';
import { useAnalytics } from '@/hooks/use-analytics';
import { useAuth } from '@/hooks/use-auth';
import { apiJson } from '@/lib/http/client';
import { StatCard } from '@/components/ui/stat-card';
import { formatCurrency } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import {
  ShoppingBag,
  DollarSign,
  Clock,
  Armchair,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { buildPeakHours, buildWeeklyRevenue } from '@/lib/analytics/compute-from-orders';

const CHART_TOOLTIP = {
  contentStyle: {
    backgroundColor: 'hsl(var(--surface-1))',
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    padding: '10px 14px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
  },
  labelStyle: { color: '#fff', fontSize: '11px', fontWeight: 'bold' as const },
};

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { orders, refresh: refreshOrders } = useOrders();
  const { tables, refresh: refreshTables } = useTables();
  const { summary, refresh: refreshAnalytics } = useAnalytics();
  const [dataAction, setDataAction] = useState<'idle' | 'loading'>('idle');

  const refreshAll = async () => {
    await Promise.all([refreshOrders(), refreshTables(), refreshAnalytics()]);
  };

  const handleClearData = async () => {
    if (!confirm('Clear all tables, menu, orders, and users? Dashboard will show zero.')) return;
    setDataAction('loading');
    try {
      await apiJson('/api/data/reset', { method: 'POST' });
      await refreshAll();
    } finally {
      setDataAction('idle');
    }
  };

  const handleLoadSample = async () => {
    setDataAction('loading');
    try {
      await apiJson<{ seeded: boolean; message: string }>('/api/seed', { method: 'POST' });
      await refreshAll();
    } finally {
      setDataAction('idle');
    }
  };

  const weeklyRevenue = useMemo(() => buildWeeklyRevenue(orders), [orders]);
  const peakHoursData = useMemo(() => buildPeakHours(orders), [orders]);
  const peakHoursSlice = useMemo(() => peakHoursData.slice(2, 11), [peakHoursData]);

  const occupiedTablesCount = tables.filter((t) => t.status === 'occupied').length;
  const occupancyPct =
    tables.length > 0 ? Math.round((occupiedTablesCount / tables.length) * 100) : 0;

  const statCards = [
    {
      label: 'Gross Revenue',
      value: formatCurrency(summary?.totalRevenue ?? 0),
      icon: <DollarSign className="h-5 w-5" />,
      color: 'gold' as const,
    },
    {
      label: 'Active Orders',
      value: String(summary?.activeOrders ?? 0),
      icon: <Clock className="h-5 w-5" />,
      color: 'blue' as const,
    },
    {
      label: 'Completed Meals',
      value: String(summary?.completedOrders ?? 0),
      icon: <ShoppingBag className="h-5 w-5" />,
      color: 'emerald' as const,
    },
    {
      label: 'Table Occupancy',
      value: `${occupancyPct}%`,
      icon: <Armchair className="h-5 w-5" />,
      color: 'amber' as const,
    },
  ];

  const pieData = [
    { name: 'Pending', value: orders.filter((o) => o.status === 'pending').length, color: 'hsl(38, 92%, 50%)' },
    { name: 'Preparing', value: orders.filter((o) => o.status === 'preparing').length, color: 'hsl(200, 70%, 50%)' },
    { name: 'Ready', value: orders.filter((o) => o.status === 'ready').length, color: 'hsl(160, 60%, 45%)' },
  ];

  const recentOrders = orders.slice(0, 5);
  const hasChartData = orders.length > 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/20 pb-5">
        <div>
          <h1 className="text-3xl font-display font-semibold tracking-tight">Executive Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Starts at zero until you add data or load sample data
          </p>
        </div>
        {user?.role === 'super_admin' && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={dataAction === 'loading'}
              onClick={() => void handleClearData()}
              className="rounded-lg border border-border px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:border-destructive hover:text-destructive transition disabled:opacity-50"
            >
              Clear all data
            </button>
            <button
              type="button"
              disabled={dataAction === 'loading'}
              onClick={() => void handleLoadSample()}
              className="rounded-lg bg-gold px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-black gold-gradient transition disabled:opacity-50"
            >
              Load sample data
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <StatCard
            key={idx}
            title={stat.label}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-border/20 bg-card/40 backdrop-blur-md p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Revenue Trend (7-Day)</h3>
            <span className="text-[10px] text-emerald bg-emerald/10 border border-emerald/20 px-2 py-0.5 rounded-full font-bold uppercase">
              From orders
            </span>
          </div>
          <div className="h-[280px] w-full">
            {hasChartData ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="rgba(255, 255, 255, 0.04)" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" opacity={0.6} fontSize={10} axisLine={false} tickLine={false} dy={8} />
                  <YAxis stroke="hsl(var(--muted-foreground))" opacity={0.6} fontSize={10} axisLine={false} tickLine={false} dx={-8} />
                  <Tooltip {...CHART_TOOLTIP} itemStyle={{ color: 'hsl(38, 92%, 50%)', fontSize: '11px' }} />
                  <Area type="monotone" dataKey="revenue" stroke="hsl(38, 92%, 50%)" strokeWidth={1.5} fillOpacity={1} fill="url(#revenueGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="flex h-full items-center justify-center text-sm text-muted-foreground">No order data yet</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border/20 bg-card/40 backdrop-blur-md p-6 flex flex-col justify-between shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Queue Distribution</h3>
          <div className="h-[180px] w-full flex items-center justify-center my-4">
            {pieData.some((d) => d.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={58} outerRadius={70} paddingAngle={6} cornerRadius={4} dataKey="value">
                    {pieData.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip {...CHART_TOOLTIP} itemStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground">No active queue</p>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-[10px] uppercase font-bold tracking-wider pt-2 border-t border-border/20">
            {pieData.map((d, idx) => (
              <div key={idx} className="space-y-1">
                <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                <p className="text-muted-foreground">{d.name}</p>
                <p className="text-foreground text-xs">{d.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border/20 bg-card/40 backdrop-blur-md p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Busy Peak Hours</h3>
          <div className="h-[280px] w-full">
            {hasChartData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={peakHoursSlice} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" opacity={0.6} fontSize={8} axisLine={false} tickLine={false} dy={8} />
                  <YAxis stroke="hsl(var(--muted-foreground))" opacity={0.6} fontSize={8} axisLine={false} tickLine={false} dx={-8} />
                  <Tooltip {...CHART_TOOLTIP} itemStyle={{ color: 'hsl(200, 70%, 50%)', fontSize: '10px' }} />
                  <Bar dataKey="orders" fill="hsl(200, 70%, 50%)" radius={[6, 6, 0, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="flex h-full items-center justify-center text-sm text-muted-foreground">No order data yet</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border/20 bg-card/40 backdrop-blur-md p-6 flex flex-col justify-between shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Incoming Feed</h3>
          <div className="flex-1 overflow-y-auto max-h-[250px] space-y-3.5 py-4 scrollbar-thin">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No orders yet</p>
            ) : (
              recentOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-border/30 bg-surface-2/20"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-foreground uppercase truncate">{ord.id}</p>
                    <p className="text-[10px] text-muted-foreground">
                      Table {ord.tableNumber} • {ord.items.length} items
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-xs font-bold text-foreground">{formatCurrency(ord.total)}</p>
                    <span
                      className={cn(
                        'inline-block rounded-full px-2 py-0.5 text-[9px] font-bold border shrink-0',
                        ord.status === 'pending'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : ord.status === 'preparing'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : ord.status === 'ready'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
                      )}
                    >
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
