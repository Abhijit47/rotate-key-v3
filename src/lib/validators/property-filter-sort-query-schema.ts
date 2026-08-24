import {
  propertyTypesEnum,
  sortOrderEnum,
} from '@/constants/property-assets-enums';
import { z } from 'zod';

export const basicFilterSchema = z.object({
  offset: z.string().optional().default('0'),
  limit: z.string().optional().default('20'),
  // sortBy: z
  //   .literal("createdAt")
  //   .or(z.literal("updatedAt"))
  //   .or(z.literal("title"))
  //   .or(z.literal("description"))
  //   .optional()
  //   .default("createdAt"),
  sort: z.enum(sortOrderEnum).optional().default('asc'),
});

export const basicFilterAddonSchema = z
  .object({
    goto: z.string().optional(),
    roomType: z.literal(propertyTypesEnum).optional().nullable(),
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
  })
  .extend(basicFilterSchema.shape);

export type BasicFilterValues = z.infer<typeof basicFilterSchema>;
export type BasicFilterAddonValues = z.infer<typeof basicFilterAddonSchema>;
