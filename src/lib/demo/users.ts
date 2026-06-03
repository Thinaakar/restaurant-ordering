import type { ManagedUser } from "@/data/types";

export const demoManagedUsers: ManagedUser[] = [
  {
    id: "demo-usr-001",
    fullName: "Sam",
    email: "sam@yumm.com",
    phone: "+91 98400 11234",
    role: "admin",
    status: "active",
    createdAt: "2024-06-01T10:00:00Z",
    updatedAt: "2024-06-15T12:00:00Z",
    avatar: "👨‍🍳",
  },
  {
    id: "demo-usr-002",
    fullName: "Roshini",
    email: "roshini@yumm.com",
    phone: "+91 98400 55678",
    role: "super_admin",
    status: "active",
    createdAt: "2024-06-05T09:00:00Z",
    updatedAt: "2024-06-20T11:00:00Z",
    avatar: "👩‍🍳",
  },
];
