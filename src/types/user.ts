import { z } from 'zod';

export type User = {
  id: string;
  name: string;
  lastName: string;
  email: string;
  password: string;
  isActive: boolean;
  role: string;
};

export type tokenUser = {
  id: string;
  name: string;
  lastName: string;
  email: string;
  isActive: boolean;
  role: string;
};

export const updateUserSchema = z.object({
  name: z.string().min(1).max(35, { message: 'Name must be less than 35 characters' }),
  lastName: z.string().min(1).max(35, { message: 'Last name must be less than 35 characters' }),
  email: z.string().email({ message: 'Please provide email' }),
});
