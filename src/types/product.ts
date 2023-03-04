import { z } from 'zod';
import { reviewSchema } from './review';

const productSchema = z.object({
  name: z.string().max(50, { message: 'Name must be less than 100 characters' }),
  description: z.string().max(500, { message: 'Description must be less than 500 characters' }),
  price: z.number().positive(),
  image: z.string(),
  color: z.string().optional(),
  inventory: z.number().default(5),
  averageRating: z.number().optional(),
  featured: z.boolean().default(false),
  inStock: z.boolean().default(true),
  brandId: z.string().cuid('Please provide a valid brand id'),
  categoryId: z.string().cuid('Please provide a valid category id'),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
  review: reviewSchema.array().optional(),
});

type Product = z.infer<typeof productSchema>;

export { productSchema, Product };
