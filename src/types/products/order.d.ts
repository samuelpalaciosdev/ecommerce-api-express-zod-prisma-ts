import { z } from 'zod';
import { User } from '../user';
import { OrderItem } from './orderItem';

export const orderSchema = z.object({
  id: z.string(),
  total: z.number().positive(),
  state: z.string().enum(['pending', 'processing', 'cancelled', 'completed']),
  user: User,
  userId: z.string(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().nullable(),
  orderItems: OrderItem.array().optional(),
});

export type Order = z.infer<typeof orderSchema>;
