import type { Order } from "@/data/types";

const now = new Date();

function todayAt(hour: number, minute = 0): string {
  const d = new Date(now);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function daysAgo(days: number, hour: number): string {
  const d = new Date(now);
  d.setDate(d.getDate() - days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

export const demoOrders: Order[] = [
  {
    id: "demo-ord-001",
    tableId: "demo-t2",
    tableNumber: 2,
    items: [
      { menuItemId: "demo-m1", name: "Butter Chicken", price: 38, quantity: 2 },
      { menuItemId: "demo-m2", name: "Paneer Butter Masala", price: 32, quantity: 1 },
    ],
    status: "ready",
    paymentStatus: "pending",
    subtotal: 108,
    tax: 5.4,
    total: 113.4,
    createdAt: todayAt(12, 15),
    updatedAt: todayAt(12, 30),
  },
  {
    id: "demo-ord-002",
    tableId: "demo-t1",
    tableNumber: 1,
    items: [{ menuItemId: "demo-m1", name: "Butter Chicken", price: 38, quantity: 2 }],
    status: "completed",
    paymentStatus: "paid",
    subtotal: 76,
    tax: 3.8,
    total: 79.8,
    createdAt: daysAgo(1, 14),
    updatedAt: daysAgo(1, 15),
  },
];
