import { z } from 'zod';
import { productSchema } from './product';

const categorySchema = z.object({
  name: z.string().max(25, { message: 'Name must be less than 25 characters' }),
  description: z.string().max(500, { message: 'Description must be less than 500 characters' }),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
  products: productSchema.array().optional(),
});

type Category = z.infer<typeof categorySchema>;

export { categorySchema, Category };
