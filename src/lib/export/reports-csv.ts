import type {
  DailyRevenue,
  HourlyData,
  Order,
  TableUtilization,
} from '@/data/types';
import { downloadCsv } from './csv';

export type ReportsTab = 'daily' | 'weekly' | 'monthly';

export interface ReportsExportInput {
  isDemo?: boolean;
  activeTab: ReportsTab;
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  revenueData: DailyRevenue[];
  peakHoursData: HourlyData[];
  tableUtilization: TableUtilization[];
  orders: Order[];
}

function formatItems(order: Order): string {
  return order.items
    .map((i) => `${i.name} x${i.quantity}`)
    .join('; ');
}

export function buildReportsCsvRows(input: ReportsExportInput): (string | number)[][] {
  const rows: (string | number)[][] = [];
  const periodLabel =
    input.activeTab.charAt(0).toUpperCase() + input.activeTab.slice(1);

  rows.push(['YUMM Reports Export']);
  rows.push(['Generated', new Date().toISOString()]);
  rows.push(['Mode', input.isDemo ? 'Demo preview (sample data)' : 'Live']);
  rows.push([]);

  rows.push(['SUMMARY']);
  rows.push(['Metric', 'Value']);
  rows.push(['Period tab', periodLabel]);
  rows.push([`${periodLabel} revenue`, input.totalRevenue]);
  rows.push(['Total orders (period)', input.totalOrders]);
  rows.push(['Average order value', input.avgOrderValue]);
  rows.push(['Orders in export', input.orders.length]);
  rows.push([]);

  rows.push([`REVENUE TREND (${input.activeTab})`]);
  rows.push(['Period', 'Revenue', 'Orders']);
  for (const row of input.revenueData) {
    rows.push([row.date, row.revenue, row.orders]);
  }
  rows.push([]);

  rows.push(['PEAK BUSINESS HOURS']);
  rows.push(['Hour', 'Orders']);
  for (const row of input.peakHoursData) {
    rows.push([row.hour, row.orders]);
  }
  rows.push([]);

  rows.push(['TABLE UTILIZATION']);
  rows.push(['Table', 'Total orders', 'Usage %']);
  for (const row of input.tableUtilization) {
    rows.push([row.tableNumber, row.totalOrders, row.usagePercent]);
  }
  rows.push([]);

  rows.push(['ORDER DETAILS']);
  rows.push([
    'Order ID',
    'Table',
    'Status',
    'Payment',
    'Subtotal',
    'Tax',
    'Total',
    'Created at',
    'Items',
  ]);
  for (const order of input.orders) {
    rows.push([
      order.id,
      order.tableNumber,
      order.status,
      order.paymentStatus,
      order.subtotal,
      order.tax,
      order.total,
      order.createdAt,
      formatItems(order),
    ]);
  }

  return rows;
}

export function exportReportsCsv(input: ReportsExportInput): void {
  const date = new Date().toISOString().slice(0, 10);
  const prefix = input.isDemo ? 'yumm-reports-demo' : 'yumm-reports';
  const filename = `${prefix}-${input.activeTab}-${date}.csv`;
  downloadCsv(filename, buildReportsCsvRows(input));
}
