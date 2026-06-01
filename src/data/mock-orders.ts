import type { Order } from './types';

const now = new Date();
const h = (hoursAgo: number) => new Date(now.getTime() - hoursAgo * 3600000).toISOString();
const m = (minsAgo: number) => new Date(now.getTime() - minsAgo * 60000).toISOString();

export const mockOrders: Order[] = [
  {
    id: 'ord-001', tableId: 't2', tableNumber: 2,
    items: [
      { menuItemId: 'm12', name: 'Chicken Biryani', price: 350, quantity: 2 },
      { menuItemId: 'm20', name: 'Mango Lassi', price: 150, quantity: 2 },
      { menuItemId: 'm16', name: 'Butter Naan', price: 60, quantity: 3 },
    ],
    status: 'preparing', paymentStatus: 'pending',
    subtotal: 1180, tax: 59, total: 1239,
    createdAt: m(25), updatedAt: m(18),
  },
  {
    id: 'ord-002', tableId: 't3', tableNumber: 3,
    items: [
      { menuItemId: 'm6', name: 'Butter Chicken', price: 380, quantity: 1 },
      { menuItemId: 'm17', name: 'Garlic Naan', price: 80, quantity: 2 },
      { menuItemId: 'm21', name: 'Masala Chai', price: 80, quantity: 2 },
    ],
    status: 'ready', paymentStatus: 'pending',
    subtotal: 700, tax: 35, total: 735,
    createdAt: m(40), updatedAt: m(10),
  },
  {
    id: 'ord-003', tableId: 't5', tableNumber: 5,
    items: [
      { menuItemId: 'm14', name: 'Mutton Biryani', price: 420, quantity: 2 },
      { menuItemId: 'm1', name: 'Paneer Tikka', price: 280, quantity: 1 },
      { menuItemId: 'm22', name: 'Fresh Lime Soda', price: 100, quantity: 3 },
    ],
    status: 'pending', paymentStatus: 'pending',
    subtotal: 1420, tax: 71, total: 1491,
    createdAt: m(5), updatedAt: m(5),
  },
  {
    id: 'ord-004', tableId: 't1', tableNumber: 1,
    items: [
      { menuItemId: 'm7', name: 'Paneer Butter Masala', price: 320, quantity: 1 },
      { menuItemId: 'm16', name: 'Butter Naan', price: 60, quantity: 4 },
      { menuItemId: 'm24', name: 'Gulab Jamun', price: 120, quantity: 2 },
    ],
    status: 'completed', paymentStatus: 'paid',
    subtotal: 800, tax: 40, total: 840,
    createdAt: h(2), updatedAt: h(1.2),
  },
  {
    id: 'ord-005', tableId: 't6', tableNumber: 6,
    items: [
      { menuItemId: 'm8', name: 'Mutton Rogan Josh', price: 450, quantity: 2 },
      { menuItemId: 'm12', name: 'Chicken Biryani', price: 350, quantity: 3 },
      { menuItemId: 'm19', name: 'Cheese Naan', price: 100, quantity: 4 },
      { menuItemId: 'm25', name: 'Rasmalai', price: 150, quantity: 3 },
      { menuItemId: 'm23', name: 'Cold Coffee', price: 180, quantity: 4 },
    ],
    status: 'completed', paymentStatus: 'paid',
    subtotal: 3170, tax: 158.5, total: 3328.5,
    createdAt: m(35), updatedAt: m(20),
  },
  {
    id: 'ord-006', tableId: 't6', tableNumber: 6,
    items: [
      { menuItemId: 'm2', name: 'Chicken 65', price: 320, quantity: 2 },
      { menuItemId: 'm9', name: 'Dal Makhani', price: 260, quantity: 1 },
      { menuItemId: 'm18', name: 'Tandoori Roti', price: 40, quantity: 6 },
    ],
    status: 'completed', paymentStatus: 'paid',
    subtotal: 1140, tax: 57, total: 1197,
    createdAt: h(3), updatedAt: h(2),
  },
  {
    id: 'ord-007', tableId: 't1', tableNumber: 1,
    items: [
      { menuItemId: 'm3', name: 'Veg Spring Rolls', price: 220, quantity: 1 },
      { menuItemId: 'm11', name: 'Palak Paneer', price: 290, quantity: 1 },
      { menuItemId: 'm15', name: 'Jeera Rice', price: 180, quantity: 1 },
    ],
    status: 'completed', paymentStatus: 'paid',
    subtotal: 690, tax: 34.5, total: 724.5,
    createdAt: h(4), updatedAt: h(3),
  },
  {
    id: 'ord-008', tableId: 't3', tableNumber: 3,
    items: [
      { menuItemId: 'm10', name: 'Prawn Masala', price: 480, quantity: 1 },
      { menuItemId: 'm17', name: 'Garlic Naan', price: 80, quantity: 2 },
      { menuItemId: 'm27', name: 'Chocolate Brownie', price: 200, quantity: 1 },
    ],
    status: 'completed', paymentStatus: 'pending',
    subtotal: 840, tax: 42, total: 882,
    createdAt: h(1.5), updatedAt: h(0.5),
  },
  {
    id: 'ord-009', tableId: 't4', tableNumber: 4,
    items: [
      { menuItemId: 'm6', name: 'Butter Chicken', price: 380, quantity: 2 },
      { menuItemId: 'm12', name: 'Chicken Biryani', price: 350, quantity: 1 },
      { menuItemId: 'm16', name: 'Butter Naan', price: 60, quantity: 4 },
      { menuItemId: 'm20', name: 'Mango Lassi', price: 150, quantity: 2 },
    ],
    status: 'completed', paymentStatus: 'paid',
    subtotal: 1650, tax: 82.5, total: 1732.5,
    createdAt: h(5), updatedAt: h(4),
  },
  {
    id: 'ord-010', tableId: 't6', tableNumber: 6,
    items: [
      { menuItemId: 'm4', name: 'Fish Amritsari', price: 380, quantity: 2 },
      { menuItemId: 'm13', name: 'Veg Biryani', price: 280, quantity: 1 },
      { menuItemId: 'm26', name: 'Kulfi', price: 130, quantity: 4 },
    ],
    status: 'completed', paymentStatus: 'paid',
    subtotal: 1560, tax: 78, total: 1638,
    createdAt: h(6), updatedAt: h(5),
  },
  {
    id: 'ord-011', tableId: 't1', tableNumber: 1,
    items: [
      { menuItemId: 'm5', name: 'Hara Bhara Kebab', price: 240, quantity: 1 },
      { menuItemId: 'm7', name: 'Paneer Butter Masala', price: 320, quantity: 1 },
      { menuItemId: 'm16', name: 'Butter Naan', price: 60, quantity: 2 },
    ],
    status: 'pending', paymentStatus: 'pending',
    subtotal: 680, tax: 34, total: 714,
    createdAt: m(3), updatedAt: m(3),
  },
  {
    id: 'ord-012', tableId: 't3', tableNumber: 3,
    items: [
      { menuItemId: 'm14', name: 'Mutton Biryani', price: 420, quantity: 1 },
      { menuItemId: 'm21', name: 'Masala Chai', price: 80, quantity: 1 },
    ],
    status: 'ready', paymentStatus: 'pending',
    subtotal: 500, tax: 25, total: 525,
    createdAt: m(50), updatedAt: m(8),
  },
  // Historical orders for reports
  {
    id: 'ord-013', tableId: 't4', tableNumber: 4,
    items: [
      { menuItemId: 'm6', name: 'Butter Chicken', price: 380, quantity: 1 },
      { menuItemId: 'm16', name: 'Butter Naan', price: 60, quantity: 2 },
    ],
    status: 'completed', paymentStatus: 'paid',
    subtotal: 500, tax: 25, total: 525,
    createdAt: h(8), updatedAt: h(7),
  },
  {
    id: 'ord-014', tableId: 't6', tableNumber: 6,
    items: [
      { menuItemId: 'm12', name: 'Chicken Biryani', price: 350, quantity: 3 },
      { menuItemId: 'm24', name: 'Gulab Jamun', price: 120, quantity: 3 },
    ],
    status: 'completed', paymentStatus: 'paid',
    subtotal: 1410, tax: 70.5, total: 1480.5,
    createdAt: h(10), updatedAt: h(9),
  },
  {
    id: 'ord-015', tableId: 't3', tableNumber: 3,
    items: [
      { menuItemId: 'm8', name: 'Mutton Rogan Josh', price: 450, quantity: 1 },
      { menuItemId: 'm15', name: 'Jeera Rice', price: 180, quantity: 1 },
      { menuItemId: 'm22', name: 'Fresh Lime Soda', price: 100, quantity: 2 },
    ],
    status: 'completed', paymentStatus: 'paid',
    subtotal: 830, tax: 41.5, total: 871.5,
    createdAt: h(12), updatedAt: h(11),
  },
];
