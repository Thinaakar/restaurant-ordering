import type { RestaurantTable } from './types';

export const mockTables: RestaurantTable[] = [
  { id: 't1', number: 1, seats: 2, status: 'available', floor: 1 },
  { id: 't2', number: 2, seats: 2, status: 'occupied', floor: 1, currentOrderId: 'ord-001' },
  { id: 't3', number: 3, seats: 4, status: 'available', floor: 1 },
  { id: 't4', number: 4, seats: 4, status: 'cleaning', floor: 1 },
  { id: 't5', number: 5, seats: 4, status: 'occupied', floor: 1, currentOrderId: 'ord-003' },
  { id: 't6', number: 6, seats: 6, status: 'available', floor: 1 },
];
