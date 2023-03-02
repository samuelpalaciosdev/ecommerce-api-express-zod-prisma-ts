import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(1).max(35, { message: 'Name must be less than 35 characters' }),
  lastName: z.string().min(1).max(35, { message: 'Last name must be less than 35 characters' }),
  email: z.string().email({ message: 'Please provide email' }),
  password: z.string().min(8, { message: 'Please provide a valid password with minimum 8 characters' }),
  role: z.enum(['client', 'admin', 'superAdmin']).optional(),
});

export const loginSchema = z.object({
  email: z.string().email({ message: 'Please provide email' }),
  password: z.string().min(8, { message: 'Please provide valid password' }),
});
