import { z } from 'zod/v4';

export const propertyReviewFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title must be at least 1 character long')
    .max(100, 'Title must be at most 100 characters long'),
  rating: z
    .number()
    .int()
    .positive()
    .superRefine((arg, ctx) => {
      if (arg < 1 || arg > 5) {
        ctx.addIssue({
          code: 'custom',
          message: 'Rating must be between 1 and 5',
        });
      }
    }),
  description: z
    .string()
    .min(1, 'Description must be at least 1 character long')
    .max(1000, 'Description must be at most 1000 characters long'),
});

export type PropertyReviewFormValues = z.infer<typeof propertyReviewFormSchema>;
