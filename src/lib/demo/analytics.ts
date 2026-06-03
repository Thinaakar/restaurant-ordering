import type { AnalyticsSummary, Order, RestaurantTable } from "@/data/types";
import { demoOrders } from "./orders";
import { demoTables } from "./tables";

export function computeAnalyticsSummary(
  orders: Order[],
  tables: RestaurantTable[],
): AnalyticsSummary {
  const completed = orders.filter((o) => o.status === "completed");
  const active = orders.filter((o) => o.status !== "completed");
  const paid = orders.filter(
    (o) => o.paymentStatus === "paid" || o.status === "completed",
  );
  const totalRevenue = paid.reduce((s, o) => s + o.total, 0);
  const today = new Date().toDateString();
  const todayOrders = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === today,
  );
  const todayRevenue = todayOrders
    .filter((o) => o.paymentStatus === "paid" || o.status === "completed")
    .reduce((s, o) => s + o.total, 0);

  return {
    totalOrders: orders.length,
    activeOrders: active.length,
    completedOrders: completed.length,
    totalRevenue,
    availableTables: tables.filter((t) => t.status === "available").length,
    occupiedTables: tables.filter((t) => t.status === "occupied").length,
    todayRevenue,
    todayOrders: todayOrders.length,
    averageOrderValue: orders.length ? totalRevenue / orders.length : 0,
    revenueGrowth: 0,
    orderGrowth: 0,
  };
}

export function getDemoAnalyticsSummary(): AnalyticsSummary {
  return computeAnalyticsSummary(demoOrders, demoTables);
}
