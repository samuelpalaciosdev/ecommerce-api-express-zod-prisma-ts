import { z } from 'zod';
import { User } from '../user';
import { productSchema } from './product';

export const reviewSchema = z.object({
  id: z.number(),
  title: z.string().max(50),
  description: z
    .string()
    .optional()
    .max(250, { message: 'Description must be less than 250 characters' }),
  rating: z.number().min(1).max(5),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().nullable(),
  user: User,
  userId: z.string(),
  product: productSchema,
  productId: z.number(),
});

export type Review = z.infer<typeof reviewSchema>;
