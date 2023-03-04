// import { z } from 'zod';
// import { userSchema } from '../user';
// import { orderItemSchema } from './orderItem';

// export const orderSchema = z.object({
//   id: z.string(),
//   total: z.number().positive(),
//   state: z.string().enum(['pending', 'processing', 'cancelled', 'completed']),
//   user: userSchema,
//   userId: z.string(),
//   createdAt: z.date().default(() => new Date()),
//   updatedAt: z.date().nullable(),
//   orderItems: orderItemSchema.array().optional(),
// });

// export type Order = z.infer<typeof orderSchema>;
