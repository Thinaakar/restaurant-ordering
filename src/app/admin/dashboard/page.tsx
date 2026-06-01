'use client';

import React from 'react';
import { useOrders } from '@/hooks/use-orders';
import { useTables } from '@/hooks/use-tables';
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
import {
  weeklyRevenue,
  peakHoursData,
  analyticsSummary,
} from '@/data/mock-analytics';

export default function AdminDashboardPage() {
  const { orders } = useOrders();
  const { tables } = useTables();

  // Compute live statistics based on state
  const activeOrdersCount = orders.filter((o) => o.status !== 'completed').length;
  const completedOrdersCount = orders.filter((o) => o.status === 'completed').length;
  
  const liveTotalRevenue = orders
    .filter((o) => o.status === 'completed' || o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.total, 0);

  const availableTablesCount = tables.filter((t) => t.status === 'available').length;
  const occupiedTablesCount = tables.filter((t) => t.status === 'occupied').length;

  const statCards = [
    {
      label: 'Gross Revenue',
      value: formatCurrency(analyticsSummary.totalRevenue + liveTotalRevenue),
      change: 12.5,
      isPositive: true,
      icon: <DollarSign className="h-5 w-5" />,
      color: 'gold' as const,
    },
    {
      label: 'Active Orders',
      value: activeOrdersCount.toString(),
      change: 5.2,
      isPositive: true,
      icon: <Clock className="h-5 w-5" />,
      color: 'blue' as const,
    },
    {
      label: 'Completed Meals',
      value: (analyticsSummary.completedOrders + completedOrdersCount).toString(),
      change: 8.3,
      isPositive: true,
      icon: <ShoppingBag className="h-5 w-5" />,
      color: 'emerald' as const,
    },
    {
      label: 'Table Occupancy',
      value: `${Math.round((occupiedTablesCount / tables.length) * 100)}%`,
      change: 3.1,
      isPositive: occupiedTablesCount > 3,
      icon: <Armchair className="h-5 w-5" />,
      color: 'amber' as const,
    },
  ];

  // Pie chart statuses calculation
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const preparingOrders = orders.filter((o) => o.status === 'preparing').length;
  const readyOrders = orders.filter((o) => o.status === 'ready').length;

  const pieData = [
    { name: 'Pending', value: pendingOrders + 1, color: 'hsl(38, 92%, 50%)' }, // Add 1 as fallback baseline
    { name: 'Preparing', value: preparingOrders + 2, color: 'hsl(200, 70%, 50%)' },
    { name: 'Ready', value: readyOrders + 1, color: 'hsl(160, 60%, 45%)' },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/20 pb-5">
        <div>
          <h1 className="text-3xl font-display font-semibold tracking-tight">Executive Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Operational analytics and live orders tracking</p>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <StatCard
            key={idx}
            title={stat.label}
            value={stat.value}
            change={stat.change}
            isPositive={stat.isPositive}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Primary Graphs Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Revenue Trend Area Chart */}
        <div className="lg:col-span-2 rounded-xl border border-border/20 bg-card/40 backdrop-blur-md p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Revenue Trend (7-Day)</h3>
            <span className="text-[10px] text-emerald bg-emerald/10 border border-emerald/20 px-2 py-0.5 rounded-full font-bold uppercase">
              Live updates
            </span>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(255, 255, 255, 0.04)" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" opacity={0.6} fontSize={10} axisLine={false} tickLine={false} dy={8} />
                <YAxis stroke="hsl(var(--muted-foreground))" opacity={0.6} fontSize={10} axisLine={false} tickLine={false} dx={-8} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--surface-1))',
                    borderColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                  }}
                  labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                  itemStyle={{ color: 'hsl(38, 92%, 50%)', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(38, 92%, 50%)" strokeWidth={1.5} fillOpacity={1} fill="url(#revenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Distribution Donut Chart */}
        <div className="rounded-xl border border-border/20 bg-card/40 backdrop-blur-md p-6 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Queue Distribution</h3>
          </div>

          <div className="h-[180px] w-full flex items-center justify-center my-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={58} outerRadius={70} paddingAngle={6} cornerRadius={4} dataKey="value">
                  {pieData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--surface-1))',
                    borderColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                  }}
                  itemStyle={{ fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Legends list */}
          <div className="grid grid-cols-3 gap-2 text-center text-[10px] uppercase font-bold tracking-wider pt-2 border-t border-border/20">
            {pieData.map((d, idx) => (
              <div key={idx} className="space-y-1">
                <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                <p className="text-muted-foreground">{d.name}</p>
                <p className="text-foreground text-xs">{d.value - (idx === 1 ? 2 : 1)} live</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Analytics & Live Feed Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak ordering hours column bar graph */}
        <div className="rounded-xl border border-border/20 bg-card/40 backdrop-blur-md p-6 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Busy Peak Hours</h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakHoursData.slice(2, 11)} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" opacity={0.6} fontSize={8} axisLine={false} tickLine={false} dy={8} />
                <YAxis stroke="hsl(var(--muted-foreground))" opacity={0.6} fontSize={8} axisLine={false} tickLine={false} dx={-8} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--surface-1))',
                    borderColor: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                  }}
                  itemStyle={{ color: 'hsl(200, 70%, 50%)', fontSize: '10px' }}
                />
                <Bar dataKey="orders" fill="hsl(200, 70%, 50%)" radius={[6, 6, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Orders Feed */}
        <div className="rounded-xl border border-border/20 bg-card/40 backdrop-blur-md p-6 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between border-b border-border/20 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Incoming Feed</h3>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[250px] space-y-3.5 py-4 scrollbar-thin">
            {recentOrders.map((ord) => (
              <div
                key={ord.id}
                className="flex items-center justify-between p-2.5 rounded-lg border border-border/30 bg-surface-2/20 transition duration-300"
              >
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-foreground uppercase truncate">{ord.id}</p>
                  <p className="text-[10px] text-muted-foreground">Table {ord.tableNumber} • {ord.items.length} items</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-xs font-bold text-foreground">{formatCurrency(ord.total)}</p>
                  <span className={cn(
                    "inline-block rounded-full px-2 py-0.5 text-[9px] font-bold border shrink-0",
                    ord.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    ord.status === 'preparing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                    ord.status === 'ready' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                    'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                  )}>
                    {ord.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
