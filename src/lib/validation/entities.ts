import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const tableCreateSchema = z.object({
  number: z.number().int().positive(),
  seats: z.number().int().positive(),
  floor: z.number().int().positive().default(1),
  status: z.enum(['available', 'occupied', 'cleaning']).optional(),
});

export const tableUpdateSchema = tableCreateSchema.partial().extend({
  currentOrderId: z.string().optional().nullable(),
});

export const menuItemCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().default(''),
  price: z.number().positive(),
  isAvailable: z.boolean().default(true),
  isVeg: z.boolean().default(true),
  dishTypeValue: z.string().optional(),
  spiceLevel: z.string().min(1).default('medium'),
  preparationTime: z.number().int().positive().default(15),
  rating: z.number().min(0).max(5).default(4),
  orderCount: z.number().int().nonnegative().default(0),
});

export const menuItemUpdateSchema = menuItemCreateSchema.partial();

export const orderItemSchema = z.object({
  menuItemId: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().int().positive(),
  specialInstructions: z.string().optional(),
});

export const orderCreateSchema = z.object({
  tableId: z.string(),
  tableNumber: z.number().int(),
  items: z.array(orderItemSchema).min(1),
  notes: z.string().optional(),
});

export const orderUpdateSchema = z.object({
  status: z.enum(['pending', 'preparing', 'ready', 'completed']).optional(),
  paymentStatus: z.enum(['pending', 'paid']).optional(),
  items: z.array(orderItemSchema).optional(),
  notes: z.string().optional(),
});

export const managedUserCreateSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  password: z.string().min(8),
  role: z.string().min(1),
  status: z.enum(['active', 'inactive']).default('active'),
  avatar: z.string().optional(),
});

export const managedUserUpdateSchema = managedUserCreateSchema.partial();

export const roleCreateSchema = z.object({
  label: z.string().min(1),
  description: z.string().min(1),
  status: z.enum(['active', 'inactive']).default('active'),
  permissions: z.array(z.string()).default([]),
});

export const roleUpdateSchema = roleCreateSchema.partial();

export const rolePermissionsSchema = z.object({
  permissions: z.array(z.string()),
});

export const settingsUpdateSchema = z.record(z.unknown());

export const dishTypeCreateSchema = z.object({
  label: z.string().min(1),
  isVeg: z.boolean(),
  status: z.enum(['active', 'inactive']).default('active'),
});

export const dishTypeUpdateSchema = dishTypeCreateSchema.partial();

export const spiceLevelCreateSchema = z.object({
  label: z.string().min(1),
  status: z.enum(['active', 'inactive']).default('active'),
});

export const spiceLevelUpdateSchema = spiceLevelCreateSchema.partial();
