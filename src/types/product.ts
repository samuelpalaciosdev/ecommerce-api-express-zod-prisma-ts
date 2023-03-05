import { z } from 'zod';
import { reviewSchema } from './review';

const productSchema = z.object({
  name: z.string().max(100, { message: 'Name must be less than 100 characters' }),
  description: z.string().max(500, { message: 'Description must be less than 500 characters' }),
  price: z
    .number()
    .nonnegative()
    .min(0, { message: 'Please provide a valid price for the product' }),
  image: z.string().min(4, { message: 'Please provide a valid image URL' }),
  color: z.array(z.string()).min(1, { message: 'Please provide at least one color' }),
  inventory: z
    .number()
    .nonnegative({ message: 'Please provide a value greater than or equal to 0' })
    .default(0),
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
