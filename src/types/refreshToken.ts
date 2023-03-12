import { z } from 'zod';

export const refreshTokenSchema = z.object({
  id: z.string(),
  refreshToken: z.string(),
  ip: z.string(),
  isValid: z.boolean(),
  userAgent: z.string(),
  userId: z.string().cuid(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type refreshToken = z.infer<typeof refreshTokenSchema>;
