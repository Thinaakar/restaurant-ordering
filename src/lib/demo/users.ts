import type { ManagedUser } from "@/data/types";

export const demoManagedUsers: ManagedUser[] = [
  {
    id: "demo-usr-001",
    fullName: "Arjun Mehta",
    email: "arjun.mehta@yumm.com",
    phone: "+91 98400 11234",
    role: "waiter",
    status: "active",
    createdAt: "2024-06-01T10:00:00Z",
    updatedAt: "2024-06-15T12:00:00Z",
    avatar: "👨‍🍳",
  },
  {
    id: "demo-usr-002",
    fullName: "Priya Sharma",
    email: "priya.sharma@yumm.com",
    phone: "+91 98400 55678",
    role: "kitchen_chef",
    status: "active",
    createdAt: "2024-06-05T09:00:00Z",
    updatedAt: "2024-06-20T11:00:00Z",
    avatar: "👩‍🍳",
  },
];
