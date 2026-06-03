import type { RestaurantTable } from "@/data/types";

export const demoTables: RestaurantTable[] = [
  { id: "demo-t1", number: 1, seats: 4, status: "available", floor: 1 },
  {
    id: "demo-t2",
    number: 2,
    seats: 4,
    status: "occupied",
    floor: 1,
    currentOrderId: "demo-ord-001",
  },
];
