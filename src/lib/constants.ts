export const ORDER_STATUSES = ['pending', 'preparing', 'ready', 'completed'] as const;
export const TABLE_STATUSES = ['available', 'occupied', 'cleaning'] as const;
export const PAYMENT_STATUSES = ['pending', 'paid'] as const;

export const TAX_RATE = 0.05; // 5%

export const ORDER_STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  preparing: { label: 'Preparing', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  ready: { label: 'Ready', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  completed: { label: 'Completed', color: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30' },
} as const;

export const TABLE_STATUS_CONFIG = {
  available: { label: 'Available', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  occupied: { label: 'Occupied', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  cleaning: { label: 'Cleaning', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
} as const;

export const PAYMENT_STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  paid: { label: 'Paid', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
} as const;

export const RESTAURANT_NAME = 'Aura';
export const RESTAURANT_TAGLINE = 'Fine Dining & Culinary Excellence';
export const CURRENCY_SYMBOL = '$';
