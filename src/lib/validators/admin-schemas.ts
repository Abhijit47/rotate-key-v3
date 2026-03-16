import { roles } from '@/constants/db-constants';
import z from 'zod';

export const createUserSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  name: z.string().min(1, 'Name is required'),
  role: z.enum(roles).default('user').optional(),
  // data: z.object(z.string()).optional(),
});

export const getUserSchema = z.object({
  id: z.string().min(1, 'user id required'),
});

export type CreateUserValues = z.infer<typeof createUserSchema>;
export type GetUserValue = z.infer<typeof getUserSchema>;
