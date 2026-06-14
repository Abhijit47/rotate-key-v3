import z from 'zod';

export const reviewFormSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.email({ message: 'Invalid email address.' }),
  propertyCondition: z
    .number()
    .min(1, 'Property condition must be at least 1')
    .max(10, 'Property condition must be at most 10'),
  communicationWithOwner: z
    .number()
    .min(1, 'Communication with owner must be at least 1')
    .max(10, 'Communication with owner must be at most 10'),
  locationAccessibility: z
    .number()
    .min(1, 'Location accessibility must be at least 1')
    .max(10, 'Location accessibility must be at most 10'),
  amenitiesFacilities: z
    .number()
    .min(1, 'Amenities facilities must be at least 1')
    .max(10, 'Amenities facilities must be at most 10'),
  overallExperience: z
    .number()
    .min(1, 'Overall experience must be at least 1')
    .max(10, 'Overall experience must be at most 10'),
  reason: z
    .string()
    .min(10, { message: 'Reason must be at least 10 characters.' })
    .max(500, { message: 'Reason must be at most 500 characters.' }),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;
