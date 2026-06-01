import type { Order, OrderStatus, PaymentStatus } from '@/data/types';

export const orderStatusConfig = {
  pending: {
    label: "Pending",
    color: "bg-amber-500/20 text-amber-300",
    badgeColor: "bg-amber-500",
    icon: "⏳",
  },
  preparing: {
    label: "Preparing",
    color: "bg-blue-500/20 text-blue-300",
    badgeColor: "bg-blue-500",
    icon: "👨‍🍳",
  },
  ready: {
    label: "Ready",
    color: "bg-emerald-500/20 text-emerald-300",
    badgeColor: "bg-emerald-500",
    icon: "✅",
  },
  completed: {
    label: "Completed",
    color: "bg-green-500/20 text-green-300",
    badgeColor: "bg-green-500",
    icon: "🎉",
  },
};

export const paymentStatusConfig = {
  pending: {
    label: "Pending",
    color: "bg-orange-500/20 text-orange-300",
    badgeColor: "bg-orange-500",
  },
  paid: {
    label: "Paid",
    color: "bg-green-500/20 text-green-300",
    badgeColor: "bg-green-500",
  },
};

export const tableStatusConfig = {
  available: {
    label: "Available",
    color: "bg-emerald-500/20 text-emerald-300",
    badgeColor: "bg-emerald-500",
    icon: "✓",
  },
  occupied: {
    label: "Occupied",
    color: "bg-ruby-500/20 text-ruby-300",
    badgeColor: "bg-ruby-500",
    icon: "👥",
  },
  cleaning: {
    label: "Cleaning",
    color: "bg-blue-500/20 text-blue-300",
    badgeColor: "bg-blue-500",
    icon: "🧹",
  },
};

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyShort(amount: number): string {
  if (amount >= 100000) {
    return "$" + (amount / 100000).toFixed(1) + "L";
  }
  if (amount >= 1000) {
    return "$" + (amount / 1000).toFixed(1) + "K";
  }
  return "$" + amount;
}

export function getOrderStatusColor(status: OrderStatus): string {
  return (orderStatusConfig as Record<string, { color: string }>)[status]?.color || 'bg-gray-500/20 text-gray-300';
}

export function getOrderStatusBadgeColor(status: OrderStatus): string {
  return (orderStatusConfig as Record<string, { badgeColor: string }>)[status]?.badgeColor || 'bg-gray-500';
}

export function getOrderStatusLabel(status: OrderStatus): string {
  return (orderStatusConfig as Record<string, { label: string }>)[status]?.label || status;
}

export function getOrderStatusIcon(status: OrderStatus): string {
  return (orderStatusConfig as Record<string, { icon: string }>)[status]?.icon || '❓';
}

export function getPaymentStatusColor(status: PaymentStatus): string {
  return (paymentStatusConfig as Record<string, { color: string }>)[status]?.color || 'bg-gray-500/20 text-gray-300';
}

export function getPaymentStatusLabel(status: PaymentStatus): string {
  return (paymentStatusConfig as Record<string, { label: string }>)[status]?.label || status;
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getOrderTimeDuration(
  createdAt: string,
  updatedAt: string,
): string {
  const start = new Date(createdAt).getTime();
  const end = new Date(updatedAt).getTime();
  const durationMs = end - start;
  const durationMins = Math.floor(durationMs / 60000);

  if (durationMins < 1) return "< 1 min";
  if (durationMins === 1) return "1 min";
  if (durationMins < 60) return `${durationMins} mins`;

  const hours = Math.floor(durationMins / 60);
  return `${hours}h ${durationMins % 60}m`;
}

export function calculateRevenueGrowth(
  current: number,
  previous: number,
): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

export function getTopItems(orders: Order[], limit: number = 5) {
  const itemMap = new Map<string, { name: string; quantity: number; revenue: number }>();

  orders.forEach((order) => {
    order.items.forEach((item: { menuItemId: string; name: string; price: number; quantity: number }) => {
      if (itemMap.has(item.menuItemId)) {
        const existing = itemMap.get(item.menuItemId)!;
        existing.quantity += item.quantity;
        existing.revenue += item.price * item.quantity;
      } else {
        itemMap.set(item.menuItemId, {
          name: item.name,
          quantity: item.quantity,
          revenue: item.price * item.quantity,
        });
      }
    });
  });

  return Array.from(itemMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
}

export function getRevenueByHour(orders: Order[]): Map<number, number> {
  const revenueMap = new Map<number, number>();

  orders
    .filter((o) => o.status === "completed")
    .forEach((order) => {
      const hour = new Date(order.createdAt).getHours();
      revenueMap.set(hour, (revenueMap.get(hour) || 0) + order.total);
    });

  return revenueMap;
}

export function getPeakBusinessHours(
  orders: Order[],
): Array<{ hour: number; count: number }> {
  const hourMap = new Map<number, number>();

  orders.forEach((order) => {
    const hour = new Date(order.createdAt).getHours();
    hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
  });

  return Array.from(hourMap.entries())
    .map(([hour, count]) => ({ hour, count }))
    .sort((a, b) => b.count - a.count);
}
