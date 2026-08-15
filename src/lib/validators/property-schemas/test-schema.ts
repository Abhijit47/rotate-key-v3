import { z } from 'zod';

const formSchema = z.object({
  title: z
    .string()
    .min(5, 'Bug title must be at least 5 characters.')
    .max(32, 'Bug title must be at most 32 characters.'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters.')
    .max(100, 'Description must be at most 100 characters.'),
});

const fromSchmea1 = z.object({
  name1: z.string().min(1),
});
const fromSchmea2 = z.object({
  name2: z.string().min(1),
});
const fromSchmea3 = z.object({
  name3: z.string().min(1),
});
const fromSchmea4 = z.object({
  name4: z.string().min(1),
});
const fromSchmea5 = z.object({
  name5: z.string().min(1),
});
const fromSchmea6 = z.object({
  name6: z.string().min(1),
});

// const mergedSchema = formSchema
//   .extend(fromSchmea1.shape)
//   .extend(fromSchmea2.shape)
//   .extend(fromSchmea3.shape)
//   .extend(fromSchmea4.shape)
//   .extend(fromSchmea5.shape)
//   .extend(fromSchmea6.shape);

// type MergedValues = z.infer<typeof mergedSchema>;

export const combinedSchema = z.object({
  ...formSchema.shape,
  ...fromSchmea1.shape,
  ...fromSchmea2.shape,
  ...fromSchmea3.shape,
  ...fromSchmea4.shape,
  ...fromSchmea5.shape,
  ...fromSchmea6.shape,
});

export type CombinedValues = z.infer<typeof combinedSchema>;
