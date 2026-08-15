import * as z from "zod";

// 1) Registry that stores wizard metadata per schema instance
const wizardRegistry = z.registry<{ step: number }>(); // [(1)](https://zod.dev/metadata)

// 2) Define fields and register step metadata "inline"
const title = z.string().min(5).max(32).register(wizardRegistry, { step: 1 }); // [(1)](https://zod.dev/metadata)
const description = z
  .string()
  .min(20)
  .max(100)
  .register(wizardRegistry, { step: 1 }); // [(1)](https://zod.dev/metadata)

const name1 = z.string().min(1).register(wizardRegistry, { step: 2 }); // [(1)](https://zod.dev/metadata)
const name2 = z.string().min(1).register(wizardRegistry, { step: 3 }); // [(1)](https://zod.dev/metadata)

// 3) Build the combined object schema from the field schemas
export const combinedSchema = z.object({
  title,
  description,
  name1,
  name2,
}); // [(2)](https://zod.dev/api#objects)

// 4) Derive stepFields dynamically from the schema + registry
export type CombinedValues = z.infer<typeof combinedSchema>; // [(2)](https://zod.dev/api#objects)
type FieldKey = keyof CombinedValues;

export const stepFields = (
  Object.entries(combinedSchema.shape) as Array<[FieldKey, z.ZodTypeAny]>
) // [(2)](https://zod.dev/api#objects)
  .reduce((acc, [key, fieldSchema]) => {
    const meta = wizardRegistry.get(fieldSchema); // [(1)](https://zod.dev/metadata)
    if (!meta)
      throw new Error(`Missing step metadata for field: ${String(key)}`); // [(1)](https://zod.dev/metadata)
    (acc[meta.step] ??= []).push(key); // [(1)](https://zod.dev/metadata)
    return acc; // [(1)](https://zod.dev/metadata)
  }, [] as FieldKey[][]); // [(1)](https://zod.dev/metadata)

// ex. step-1
const grp1 = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string().min(8),
  confirmpassword: z.string().min(8),
});

// ex. step no 2
const grp2 = z.object({
  phone: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zip: z.string(),
});
// snd so on
