import z from 'zod';

export const propertySchema = z.object({
  type: z.string(),
  streetAddress: z.string(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  zipCode: z.string().nullable(),

  images: z.array(z.string()),
  amenities: z.array(z.string()),
});

export const updatePropertySchema = propertySchema.partial().extend({
  id: z.string(),
});

export const deletePropertySchema = propertySchema
  .extend({
    id: z.string(),
  })
  .pick({ id: true });

export type PropertyValues = z.infer<typeof propertySchema>;
export type UpdatePropertyValues = z.infer<typeof updatePropertySchema>;
export type DeletePropertyValues = z.infer<typeof deletePropertySchema>;
