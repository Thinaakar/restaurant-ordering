import {
  RESTAURANT_FULL_NAME,
  RESTAURANT_RESERVATIONS_EMAIL,
} from "@/lib/constants";

export const demoSettings: Record<string, unknown> = {
  restaurantName: RESTAURANT_FULL_NAME,
  email: RESTAURANT_RESERVATIONS_EMAIL,
  phone: "+1 555 010 2001",
  taxRate: 0.05,
  currency: "USD",
  paymentMethods: [
    { id: "demo-pay-1", name: "Cash", enabled: true },
    { id: "demo-pay-2", name: "Card", enabled: true },
  ],
  kitchenStations: [
    { id: "demo-kitchen-1", name: "Grill", active: true },
    { id: "demo-kitchen-2", name: "Tandoor", active: true },
  ],
};
