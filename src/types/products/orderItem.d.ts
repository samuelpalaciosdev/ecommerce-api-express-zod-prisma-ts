import { z } from 'zod';
import { Order } from './order';

export const orderItemSchema = z.object({
  id: z.string(),
  quantity: z.number().int().min(1),
  name: z.string(),
  price: z.number().positive(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().nullable(),
  order: Order,
  orderId: z.string(),
});

export type OrderItem = z.infer<typeof orderItemSchema>;
