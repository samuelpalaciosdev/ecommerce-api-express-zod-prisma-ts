import { z } from 'zod';
import { Product } from './product';

export const brandSchema = z.object({
  id: z.string(),
  name: z.string().max(50, { message: 'Name must be less than 50 characters' }),
  description: z.string().max(500, { message: 'Description must be less than 500 characters' }),
  logo: z.string(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().nullable(),
  products: Product.array().optional(),
});

export type Brand = z.infer<typeof brandSchema>;
