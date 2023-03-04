import { z } from 'zod';
import { Brand } from './brand';
import { Category } from './category';
import { Review } from './review';

export const productSchema = z.object({
  id: z.number(),
  name: z.string().max(50, { message: 'Name must be less than 100 characters' }),
  description: z.string().max(500, { message: 'Description must be less than 500 characters' }),
  price: z.number().positive(),
  image: z.string(),
  color: z.string().optional(),
  inventory: z.number().default(5),
  averageRating: z.number().optional(),
  featured: z.boolean().default(false),
  inStock: z.boolean().default(true),
  brand: Brand,
  brandId: z.string(),
  category: Category,
  categoryId: z.string(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().nullable(),
  Review: Review.array().optional(),
});

export type Product = z.infer<typeof productSchema>;
