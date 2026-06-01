import type { AnalyticsSummary, DailyRevenue, HourlyData, TableUtilization } from './types';

export const analyticsSummary: AnalyticsSummary = {
  totalOrders: 1247,
  activeOrders: 5,
  completedOrders: 1242,
  totalRevenue: 487520,
  availableTables: 3,
  occupiedTables: 2,
  todayRevenue: 18450,
  todayOrders: 42,
  averageOrderValue: 391,
  revenueGrowth: 12.5,
  orderGrowth: 8.3,
};

export const weeklyRevenue: DailyRevenue[] = [
  { date: 'Mon', revenue: 14200, orders: 38 },
  { date: 'Tue', revenue: 16800, orders: 44 },
  { date: 'Wed', revenue: 13500, orders: 35 },
  { date: 'Thu', revenue: 18900, orders: 48 },
  { date: 'Fri', revenue: 24500, orders: 62 },
  { date: 'Sat', revenue: 28700, orders: 71 },
  { date: 'Sun', revenue: 22400, orders: 55 },
];

export const monthlyRevenue: DailyRevenue[] = [
  { date: 'Week 1', revenue: 98000, orders: 245 },
  { date: 'Week 2', revenue: 112000, orders: 280 },
  { date: 'Week 3', revenue: 105000, orders: 262 },
  { date: 'Week 4', revenue: 127000, orders: 318 },
];

export const peakHoursData: HourlyData[] = [
  { hour: '10 AM', orders: 5 },
  { hour: '11 AM', orders: 12 },
  { hour: '12 PM', orders: 28 },
  { hour: '1 PM', orders: 42 },
  { hour: '2 PM', orders: 35 },
  { hour: '3 PM', orders: 15 },
  { hour: '4 PM', orders: 8 },
  { hour: '5 PM', orders: 10 },
  { hour: '6 PM', orders: 18 },
  { hour: '7 PM', orders: 38 },
  { hour: '8 PM', orders: 52 },
  { hour: '9 PM', orders: 45 },
  { hour: '10 PM', orders: 25 },
  { hour: '11 PM', orders: 10 },
];


export const tableUtilization: TableUtilization[] = [
  { tableNumber: 1, usagePercent: 72, totalOrders: 89 },
  { tableNumber: 2, usagePercent: 85, totalOrders: 105 },
  { tableNumber: 3, usagePercent: 68, totalOrders: 84 },
  { tableNumber: 4, usagePercent: 55, totalOrders: 68 },
  { tableNumber: 5, usagePercent: 90, totalOrders: 111 },
  { tableNumber: 6, usagePercent: 78, totalOrders: 96 },
];

export const orderStatusDistribution = [
  { name: 'Pending', value: 2, fill: 'hsl(38, 92%, 50%)' },
  { name: 'Preparing', value: 2, fill: 'hsl(200, 70%, 50%)' },
  { name: 'Ready', value: 2, fill: 'hsl(160, 60%, 45%)' },
  { name: 'Completed', value: 9, fill: 'hsl(0, 0%, 40%)' },
];
