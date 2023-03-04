import { z } from 'zod';
import { orderSchema } from './order';

export const orderItemSchema = z.object({
  id: z.string(),
  quantity: z.number().int().min(1),
  name: z.string(),
  price: z.number().positive(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().nullable(),
  order: orderSchema,
  orderId: z.string(),
});

export type OrderItem = z.infer<typeof orderItemSchema>;
