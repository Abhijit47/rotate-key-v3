import z from 'zod';

export const newsLetterFormSchema = z.object({
  email: z.email({
    error: 'Please enter a valid email address',
  }),
});

export type NewsLetterFormValues = z.infer<typeof newsLetterFormSchema>;
