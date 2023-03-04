import { z } from 'zod';
import { productSchema } from './product';

const brandSchema = z.object({
  name: z.string().max(50, { message: 'Name must be less than 50 characters' }),
  description: z.string().max(500, { message: 'Description must be less than 500 characters' }),
  logo: z.string(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
  products: productSchema.array().optional(),
});

type Brand = z.infer<typeof brandSchema>;

export { brandSchema, Brand };
