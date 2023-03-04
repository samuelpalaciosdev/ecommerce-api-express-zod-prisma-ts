import { z } from 'zod';

const reviewSchema = z.object({
  id: z.number(),
  title: z.string().max(50),
  description: z
    .string()
    .max(250, { message: 'Description must be less than 250 characters' })
    .optional(),
  rating: z.number().min(1).max(5),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().nullable(),
  userId: z.string(),
  productId: z.number(),
});

type Review = z.infer<typeof reviewSchema>;

export { reviewSchema, Review };
