/* ── Table ────────────────────────────────────────────── */
export type TableStatus = 'available' | 'occupied' | 'cleaning';

export interface RestaurantTable {
  id: string;
  number: number;
  seats: number;
  status: TableStatus;
  currentOrderId?: string;
  floor: number;
}

/* ── Menu ─────────────────────────────────────────────── */
export type SpiceLevel = 'mild' | 'medium' | 'hot' | 'extra-hot';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isAvailable: boolean;
  isVeg: boolean;
  spiceLevel: SpiceLevel;
  preparationTime: number; // minutes
  rating: number;
  orderCount: number;
}

/* ── Cart ─────────────────────────────────────────────── */
export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

/* ── Order ────────────────────────────────────────────── */
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed';
export type PaymentStatus = 'pending' | 'paid';

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  tableId: string;
  tableNumber: number;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/* ── Analytics ────────────────────────────────────────── */
export interface DailyRevenue {
  date: string;
  revenue: number;
  orders: number;
}

export interface HourlyData {
  hour: string;
  orders: number;
}


export interface TableUtilization {
  tableNumber: number;
  usagePercent: number;
  totalOrders: number;
}

export interface AnalyticsSummary {
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  totalRevenue: number;
  availableTables: number;
  occupiedTables: number;
  todayRevenue: number;
  todayOrders: number;
  averageOrderValue: number;
  revenueGrowth: number;
  orderGrowth: number;
}

/* ── Auth ─────────────────────────────────────────────── */
export interface AdminUser {
  email: string;
  name: string;
  role: 'admin';
  avatar?: string;
}

/* ── Navigation ───────────────────────────────────────── */
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}
