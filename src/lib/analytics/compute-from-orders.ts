import type { DailyRevenue, HourlyData, Order, RestaurantTable, TableUtilization } from '@/data/types';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function isRevenueOrder(order: Order): boolean {
  return order.paymentStatus === 'paid' || order.status === 'completed';
}

function formatHour(h: number): string {
  if (h === 0) return '12 AM';
  if (h < 12) return `${h} AM`;
  if (h === 12) return '12 PM';
  return `${h - 12} PM`;
}

/** Last 7 calendar days (oldest → newest). */
export function buildWeeklyRevenue(orders: Order[]): DailyRevenue[] {
  const now = new Date();
  const result: DailyRevenue[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const dayKey = d.toDateString();
    const dayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === dayKey);
    const revenue = dayOrders.filter(isRevenueOrder).reduce((s, o) => s + o.total, 0);
    result.push({
      date: DAY_LABELS[d.getDay()],
      revenue,
      orders: dayOrders.length,
    });
  }

  return result;
}

/** Last 4 weeks (Week 1 … Week 4). */
export function buildMonthlyRevenue(orders: Order[]): DailyRevenue[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const result: DailyRevenue[] = [];

  for (let w = 3; w >= 0; w--) {
    const weekEnd = new Date(now);
    weekEnd.setDate(weekEnd.getDate() - w * 7);
    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekStart.getDate() - 6);

    const weekOrders = orders.filter((o) => {
      const created = new Date(o.createdAt);
      created.setHours(0, 0, 0, 0);
      return created >= weekStart && created <= weekEnd;
    });

    const revenue = weekOrders.filter(isRevenueOrder).reduce((s, o) => s + o.total, 0);
    result.push({
      date: `Week ${4 - w}`,
      revenue,
      orders: weekOrders.length,
    });
  }

  return result;
}

/** Today’s orders grouped by hour (10 AM – 10 PM buckets, zero-filled). */
export function buildDailyHourlyRevenue(orders: Order[]): DailyRevenue[] {
  const today = new Date().toDateString();
  const todayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === today);
  const result: DailyRevenue[] = [];

  for (let h = 10; h <= 22; h++) {
    const hourOrders = todayOrders.filter((o) => new Date(o.createdAt).getHours() === h);
    const revenue = hourOrders.filter(isRevenueOrder).reduce((s, o) => s + o.total, 0);
    result.push({
      date: formatHour(h),
      revenue,
      orders: hourOrders.length,
    });
  }

  return result;
}

/** Order count by hour (10 AM – 11 PM). */
export function buildPeakHours(orders: Order[]): HourlyData[] {
  const result: HourlyData[] = [];

  for (let h = 10; h <= 23; h++) {
    const count = orders.filter((o) => new Date(o.createdAt).getHours() === h).length;
    result.push({ hour: formatHour(h), orders: count });
  }

  return result;
}

/** Relative usage per table from order volume. */
export function buildTableUtilization(
  orders: Order[],
  tables: RestaurantTable[],
): TableUtilization[] {
  const counts = new Map<number, number>();
  for (const o of orders) {
    counts.set(o.tableNumber, (counts.get(o.tableNumber) ?? 0) + 1);
  }

  const max = Math.max(1, ...Array.from(counts.values()));
  const sorted = [...tables].sort((a, b) => a.number - b.number);

  return sorted.map((t) => {
    const totalOrders = counts.get(t.number) ?? 0;
    return {
      tableNumber: t.number,
      totalOrders,
      usagePercent: Math.round((totalOrders / max) * 100),
    };
  });
}
