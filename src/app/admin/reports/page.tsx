'use client';

import React, { useMemo, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { useOrders } from '@/hooks/use-orders';
import { useTables } from '@/hooks/use-tables';
import { formatCurrency } from '@/lib/formatters';
import {
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  Calendar,
  ArrowDownToLine,
  Clock,
  Table2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  buildDailyHourlyRevenue,
  buildMonthlyRevenue,
  buildPeakHours,
  buildTableUtilization,
  buildWeeklyRevenue,
} from '@/lib/analytics/compute-from-orders';

const CHART_TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: 'hsl(var(--surface-1))',
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    padding: '10px 14px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
  },
  labelStyle: { color: '#fff', fontSize: '11px', fontWeight: 'bold' as const },
  itemStyle: { fontSize: '11px' },
};

type Tab = 'daily' | 'weekly' | 'monthly';

export default function AdminReportsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('weekly');
  const { orders } = useOrders();
  const { tables } = useTables();

  const weeklyRevenue = useMemo(() => buildWeeklyRevenue(orders), [orders]);
  const monthlyRevenue = useMemo(() => buildMonthlyRevenue(orders), [orders]);
  const dailyRevenue = useMemo(() => buildDailyHourlyRevenue(orders), [orders]);
  const peakHoursData = useMemo(() => buildPeakHours(orders), [orders]);
  const tableUtilization = useMemo(() => buildTableUtilization(orders, tables), [orders, tables]);

  const revenueData =
    activeTab === 'daily' ? dailyRevenue : activeTab === 'weekly' ? weeklyRevenue : monthlyRevenue;

  const totalRevenue = revenueData.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = revenueData.reduce((s, d) => s + d.orders, 0);
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const hasData = orders.length > 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/20 pb-5">
        <div>
          <h1 className="text-3xl font-display font-semibold tracking-tight uppercase">Reports Analytics</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Sales and dining patterns from live orders</p>
        </div>
        <button
          type="button"
          onClick={() => alert('Export coming soon — data is loaded from Firestore orders.')}
          className="flex items-center gap-1.5 rounded-full bg-gold px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black gold-gradient hover:scale-105 transition duration-300 shadow-md cursor-pointer"
        >
          <ArrowDownToLine className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      <div className="flex gap-2 border border-border/40 rounded-xl bg-card p-2 w-fit">
        {(['daily', 'weekly', 'monthly'] as Tab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer',
              activeTab === tab ? 'bg-gold text-black' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Revenue`,
            value: formatCurrency(totalRevenue),
            icon: TrendingUp,
            color: 'text-gold bg-gold/10 border-gold/20',
          },
          {
            label: 'Total Orders',
            value: totalOrders.toString(),
            icon: BarChart3,
            color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
          },
          {
            label: 'Avg Order Value',
            value: formatCurrency(avgOrderValue),
            icon: PieIcon,
            color: 'text-emerald bg-emerald/10 border-emerald/20',
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="stat-card">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </span>
                <div className={cn('flex h-9 w-9 items-center justify-center rounded-full border', item.color)}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-bold tabular-nums text-foreground mt-4">{item.value}</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-border/20 bg-card/40 backdrop-blur-md p-6 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gold" />
          {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Revenue Trend
        </h3>
        <div className="h-[280px] w-full">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(38,92%,50%)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(38,92%,50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(255, 255, 255, 0.04)" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" opacity={0.6} fontSize={10} axisLine={false} tickLine={false} dy={8} />
                <YAxis stroke="hsl(var(--muted-foreground))" opacity={0.6} fontSize={10} axisLine={false} tickLine={false} dx={-8} />
                <Tooltip {...CHART_TOOLTIP_STYLE} itemStyle={{ color: 'hsl(38,92%,50%)', fontSize: '11px' }} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(38,92%,50%)" strokeWidth={1.5} fillOpacity={1} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <p className="flex h-full items-center justify-center text-sm text-muted-foreground">No order data yet</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border/20 bg-card/40 backdrop-blur-md p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4 text-gold" /> Peak Business Hours
          </h3>
          <div className="h-[240px] w-full">
            {hasData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={peakHoursData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" opacity={0.6} fontSize={8} axisLine={false} tickLine={false} dy={8} />
                  <YAxis stroke="hsl(var(--muted-foreground))" opacity={0.6} fontSize={8} axisLine={false} tickLine={false} dx={-8} />
                  <Tooltip {...CHART_TOOLTIP_STYLE} itemStyle={{ color: 'hsl(280,65%,60%)', fontSize: '10px' }} />
                  <Bar dataKey="orders" fill="hsl(280,65%,60%)" radius={[6, 6, 0, 0]} barSize={10} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="flex h-full items-center justify-center text-sm text-muted-foreground">No order data yet</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border/20 bg-card/40 backdrop-blur-md p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Table2 className="h-4 w-4 text-gold" /> Most Frequently Used Tables
          </h3>
          <div className="h-[240px] w-full">
            {tables.length > 0 && hasData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tableUtilization} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <XAxis
                    dataKey="tableNumber"
                    stroke="hsl(var(--muted-foreground))"
                    opacity={0.6}
                    fontSize={9}
                    tickFormatter={(v) => `T${v}`}
                    axisLine={false}
                    tickLine={false}
                    dy={8}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" opacity={0.6} fontSize={9} unit="%" axisLine={false} tickLine={false} dx={-8} />
                  <Tooltip
                    {...CHART_TOOLTIP_STYLE}
                    itemStyle={{ color: 'hsl(160,60%,45%)', fontSize: '10px' }}
                    formatter={(v: unknown) => [`${v}%`, 'Usage']}
                    labelFormatter={(l) => `Table ${l}`}
                  />
                  <Bar dataKey="usagePercent" fill="hsl(160,60%,45%)" radius={[6, 6, 0, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="flex h-full items-center justify-center text-sm text-muted-foreground">No table usage data yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
