import z from 'zod';

export const propertySchema = z.object({
  type: z.string().trim().min(1, 'Property type is required'),
  streetAddress: z.string().trim().min(1, 'Street address is required'),
  city: z.string().nullable(),
  state: z.string().nullable(),
  zipCode: z.string().nullable(),

  images: z.array(z.url()),
  amenities: z.array(z.string()),
});

export const propertyIdSchema = z.object({
  id: z.uuid(),
});

export const updatePropertySchema = propertySchema
  .partial()
  .extend(propertyIdSchema.shape);

export const deletePropertySchema = updatePropertySchema.pick({ id: true });

export type PropertyValues = z.infer<typeof propertySchema>;
export type UpdatePropertyValues = z.infer<typeof updatePropertySchema>;
export type DeletePropertyValues = z.infer<typeof deletePropertySchema>;
