import type { MenuItem } from "@/data/types";

export const demoMenuItems: MenuItem[] = [
  {
    id: "demo-m1",
    name: "Butter Chicken",
    description: "Tender chicken in rich tomato-butter gravy",
    price: 38,
    isAvailable: true,
    isVeg: false,
    spiceLevel: "medium",
    preparationTime: 25,
    rating: 4.8,
    orderCount: 42,
  },
  {
    id: "demo-m2",
    name: "Paneer Butter Masala",
    description: "Cottage cheese in creamy tomato gravy",
    price: 32,
    isAvailable: true,
    isVeg: true,
    spiceLevel: "mild",
    preparationTime: 20,
    rating: 4.6,
    orderCount: 38,
  },
];
