import z from 'zod';

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Full name must be at least 2 characters long')
      .max(100, 'Full name must be less than 100 characters long'),
    email: z.email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z
      .string()
      .min(8, 'Confirm password must be at least 8 characters long'),
    privacyAndTerms: z.boolean().refine((value) => value === true, {
      message: 'You must accept the privacy policy and terms of service',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.email('Provide correct email id').min(1, 'Email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  rememberMe: z.boolean(),
});

export const onboardingSchema = z.object({
  whereAreYouFrom: z.string().optional(),
  whereDoYouWantToGo: z.string().optional(),
});

export type SignupValues = z.infer<typeof signupSchema>;
export type LoginValues = z.infer<typeof loginSchema>;
export type OnboardingValues = z.infer<typeof onboardingSchema>;
