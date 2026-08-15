import libphonenumber from 'google-libphonenumber';
import z from 'zod';

export { default as defaultValues } from './default-values';

import {
  hostLanguageEnum,
  propertyAccomodationsEnum,
  propertyAreaUnitsEnum,
  propertyEnvironmentsEnum,
  propertyOwnershipsEnum,
  propertySurroundingsEnum,
  propertySwapingsEnum,
  propertyTypesEnum,
} from '@/constants/property-assets';
import { emailRegex, validatePostalCode } from '@/lib/helpers/property-helpers';

const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

const WIZARD_STEPS = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | (10 as const);
const wizardRegistry = z.registry<{ step: typeof WIZARD_STEPS }>();

// STEP-1
const region = z
  .object({
    id: z.number(),
    name: z.string(),
    flag: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.name.length < 1) {
      ctx.addIssue({
        code: 'custom',
        path: [],
        message: 'Choose a region',
      });
      ctx.aborted = true;
    }
  })
  .register(wizardRegistry, { step: 1 });

const country = z
  .object({
    id: z.number(),
    name: z.string(),
    flag: z.string().optional(),
    iso2: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.name.length < 1) {
      ctx.addIssue({
        code: 'custom',
        path: [],
        message: 'Choose a country',
      });
      ctx.aborted = true;
    }
  })
  .register(wizardRegistry, { step: 1 });

const state = z
  .object({
    id: z.number(),
    name: z.string(),
    flag: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.name.length < 1) {
      ctx.addIssue({
        code: 'custom',
        path: [],
        message: 'Choose a state',
      });
      ctx.aborted = true;
    }
  })
  .register(wizardRegistry, { step: 1 });

const city = z
  .object({
    id: z.number(),
    name: z.string(),
    flag: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.name.length < 1) {
      ctx.addIssue({
        code: 'custom',
        path: [],
        message: 'Choose a city',
      });
      ctx.aborted = true;
    }
  })
  .register(wizardRegistry, { step: 1 });

const zipcode = z
  .string()
  .superRefine((data, ctx) => {
    if (!validatePostalCode(data, 'IN')) {
      console.log('fail-status:', validatePostalCode(data, 'IN'));
      ctx.addIssue({
        code: 'invalid_format',
        format: 'postal-code',
        validation: 'regex',
        path: [],
        message: 'Invalid postal code',
      });
      ctx.aborted = true;
    } else {
      console.log('pass-status:', validatePostalCode(data, 'IN'));
      ctx.aborted = false;
    }
  })
  .register(wizardRegistry, { step: 1 });

const streetAddress = z
  .string()
  .min(1, { error: 'Street address must be 1 to 50 characters.' })
  .max(50, { error: 'Street address must be 1 to 50 characters.' })
  .register(wizardRegistry, { step: 1 });

// STEP-2
const propertyArea = z
  .string()
  .min(1, { error: 'Property area is required' })
  .max(50, { error: 'Property area must be 1 to 50 characters.' })
  .register(wizardRegistry, { step: 2 });

const propertyAreaUnit = z
  .enum(propertyAreaUnitsEnum, { error: 'Please select a valid area unit.' })
  .register(wizardRegistry, { step: 2 });

const propertyDescription = z
  .string()
  .min(10, { error: 'Property description must be 10 character.' })
  .max(3000, { error: 'Property description max limit 1000 character.' })
  .register(wizardRegistry, { step: 2 });

// STEP-3
const propertyType = z
  .enum(propertyTypesEnum, { error: 'Please select a room type.' })
  .register(wizardRegistry, { step: 3 });
const propertyOwnership = z
  .enum(propertyOwnershipsEnum, { error: 'Please select a room ownership.' })
  .register(wizardRegistry, { step: 3 });
const propertySwaping = z
  .enum(propertySwapingsEnum, { error: 'Please select a swaping type.' })
  .register(wizardRegistry, { step: 3 });
const propertyRentalTypes = z
  .string()
  .min(1, { error: 'Property rental type is required' })
  .max(50, { error: 'Property rental type must be 1 to 50 characters.' })
  .register(wizardRegistry, { step: 3 });
const propertySurrounding = z
  .enum(propertySurroundingsEnum, {
    error: 'Please select a valid room surrounding',
  })
  .register(wizardRegistry, { step: 3 });
const propertyEnvironment = z
  .enum(propertyEnvironmentsEnum, {
    error: 'Please select a valid room environment',
  })
  .register(wizardRegistry, { step: 3 });

// STEP-4
const propertyBedRooms = z
  .string()
  .superRefine((data, ctx) => {
    if (data === '') {
      ctx.addIssue({
        code: 'custom',
        // origin: 'string',
        minimum: 1,
        inclusive: true,
        path: [],
        message: 'Bedrooms must be at least 1',
      });
      ctx.aborted = true;
    } else {
      ctx.aborted = false;
    }
  })
  .register(wizardRegistry, { step: 4 });
const propertyBathRooms = z
  .string()
  .superRefine((data, ctx) => {
    if (data === '') {
      ctx.addIssue({
        code: 'custom',
        // origin: 'string',
        minimum: 1,
        inclusive: true,
        path: [],
        message: 'Bathrooms must be at least 1',
      });
      ctx.aborted = true;
    } else {
      ctx.aborted = false;
    }
  })
  .register(wizardRegistry, { step: 4 });
const numberOfGuests = z
  .string()
  .superRefine((data, ctx) => {
    if (data === '') {
      ctx.addIssue({
        code: 'custom',
        // origin: 'string',
        minimum: 1,
        inclusive: true,
        path: [],
        message: 'Guests must be at least 1',
      });
      ctx.aborted = true;
    } else {
      ctx.aborted = false;
    }
  })
  .register(wizardRegistry, { step: 4 });
const numberOfBeds = z
  .string()
  .superRefine((data, ctx) => {
    if (data === '') {
      ctx.addIssue({
        code: 'custom',
        // origin: 'string',
        minimum: 1,
        inclusive: true,
        path: [],
        message: 'Beds must be at least 1',
      });
      ctx.aborted = true;
    } else {
      ctx.aborted = false;
    }
  })
  .register(wizardRegistry, { step: 4 });
const propertyAccomodationType = z
  .enum(propertyAccomodationsEnum, {
    error: 'Please select an accomodation type.',
  })
  .register(wizardRegistry, { step: 4 });

// STEP-5
const propertyOwnerName = z
  .string()
  .optional()
  .superRefine((data, ctx) => {
    if (data) {
      if (data.length < 3) {
        ctx.addIssue({
          code: 'too_small',
          origin: 'string',
          minimum: 3,
          inclusive: true,
          message: 'Owner name must be at least 3 characters',
        });
      }
      ctx.aborted = true;
    } else {
      ctx.aborted = false;
    }
  })
  .register(wizardRegistry, { step: 5 });
const propertyOwnerEmail = z
  .string()
  .optional()
  .superRefine((data, ctx) => {
    if (data) {
      if (!emailRegex.test(data)) {
        ctx.addIssue({
          code: 'invalid_format',
          format: 'email',
          path: [],
          message: 'Invalid email address',
        });
        ctx.aborted = true;
      } else {
        ctx.aborted = false;
      }
    }
  })
  .register(wizardRegistry, { step: 5 });
const propertyOwnerPhone = z
  .string()
  .optional()
  .superRefine((data, ctx) => {
    if (data) {
      try {
        const phoneNumber = phoneUtil.parse(data);
        if (!phoneUtil.isPossibleNumber(phoneNumber)) {
          ctx.addIssue({
            code: 'invalid_format',
            format: 'phone',
            path: [],
            message: 'Invalid mobile number',
          });
          ctx.aborted = true;
        } else {
          ctx.aborted = false;
        }
      } catch (error) {
        console.warn(error, "Couldn't validate phone number");
        ctx.addIssue({
          code: 'custom',
          path: ['propertyOwnerPhone'],
          message: "Couldn't validate phone number",
        });
        ctx.aborted = true;
      }
    }
  })
  .register(wizardRegistry, { step: 5 });
const hostKnownLanguages = z
  .array(z.enum(hostLanguageEnum), {
    error: 'Please select a valid languages.',
  })
  .min(1, 'At least one language must be selected.')
  .register(wizardRegistry, { step: 5 });

// STEP-6
const propertyAmenities = z
  .array(
    z
      .string({ error: 'At least one amenity must be selected.' })
      .nonempty({ error: 'At least one amenity must be selected.' }),
  )
  .refine((amenities) => amenities.length > 0, {
    path: [],
    error: 'At least one amenity must be selected.',
    abort: true,
  })
  .register(wizardRegistry, { step: 6 });

// STEP-7
const propertyAccessibilities = z
  .array(
    z
      .string({ error: 'At least one accessibilities must be selected.' })
      .nonempty({ error: 'At least one accessibilities must be selected.' }),
  )
  .refine((accessibilities) => accessibilities.length > 0, {
    path: [],
    error: 'At least one accessibilities must be selected.',
    abort: true,
  })
  .register(wizardRegistry, { step: 7 });

// STEP-8
const propertyRules = z
  .array(
    z
      .string({ error: 'At least one rules must be selected.' })
      .nonempty({ error: 'At least one rules must be selected.' }),
  )
  .refine((rules) => rules.length > 0, {
    path: [],
    error: 'At least one rules must be selected.',
    abort: true,
  })
  .register(wizardRegistry, { step: 8 });

// STEP-9
const staysDateRange = z
  .object({
    from: z.date({ error: 'Start date is required' }),
    to: z.date({ error: 'End date is required' }),
  })
  .register(wizardRegistry, { step: 9 });
const staysDurationInDays = z
  .string()
  .min(1)
  .register(wizardRegistry, { step: 9 });

// STEP-10
// const files = z
//   .array(z.custom<File & { publicId?: string }>())
//   .min(1, 'Please select at least one file')
//   .max(6, 'Please select up to 6 files')
//   .refine((files) => files.every((file) => file.size <= 10 * 1024 * 1024), {
//     message: 'File size must be less than 10MB',
//     path: [],
//   })
//   .register(wizardRegistry, { step: 10 });
const propertyImages = z
  .array(z.url())
  .refine(
    (urls) => urls.some((url) => url !== ''),
    'At least one image is required',
  )
  .register(wizardRegistry, { step: 10 });

export const combinedPropertySchema = z.object({
  region,
  country,
  state,
  city,
  zipcode,
  streetAddress,
  propertyArea,
  propertyAreaUnit,
  propertyDescription,
  propertyType,
  propertyOwnership,
  propertySwaping,
  propertyRentalTypes,
  propertySurrounding,
  propertyEnvironment,
  propertyBedRooms,
  propertyBathRooms,
  numberOfGuests,
  numberOfBeds,
  propertyAccomodationType,
  propertyOwnerName,
  propertyOwnerEmail,
  propertyOwnerPhone,
  hostKnownLanguages,
  propertyAmenities,
  propertyAccessibilities,
  propertyRules,
  staysDateRange,
  staysDurationInDays,
  // files,
  propertyImages,
});

export type WizardValues = z.infer<typeof combinedPropertySchema>;
export type WizardFieldKey = keyof WizardValues;
type CombinedShape = typeof combinedPropertySchema.shape;
type CombinedShapeEntry = {
  [K in keyof CombinedShape]: [K, CombinedShape[K]];
}[keyof CombinedShape];

export const currentStepFields = (
  Object.entries(combinedPropertySchema.shape) as CombinedShapeEntry[]
).reduce((acc, [key, fieldSchema]) => {
  const meta = wizardRegistry.get(fieldSchema);
  if (!meta) throw new Error(`Missing step metadata for field: ${String(key)}`);
  (acc[meta.step] ??= []).push(key);
  return acc;
}, [] as WizardFieldKey[][]);

export type Step = keyof typeof currentStepFields; // typically 0 | 1 | 2 ... (depends on your array)
export function getFieldsForStep<S extends Step>(step: S) {
  return currentStepFields[step];
}

// TODO: UNUSED will remove later
// export type WizardSchemaShape = typeof wizardSchema.shape;

// export type WizardValues = z.infer<typeof wizardSchema>;

// type GroupKey = keyof WizardValues;

// type FieldKeys = {
//   [K in GroupKey]: keyof WizardValues[K];
// };

// type FlatFieldPath = `${Extract<GroupKey, string>}.${string}`;
// type FieldPaths = {
//   [K in GroupKey]: `${K}.${FieldKeys[K]}`;
// }[GroupKey];

// export const stepGroups = (
//   Object.entries(wizardSchema.shape) as Array<
//     [GroupKey, (typeof wizardSchema.shape)[GroupKey]]
//   >
// ).reduce((acc, [groupKey, groupSchema]) => {
//   const meta = wizardRegistry.get(groupSchema);
//   if (!meta)
//     throw new Error(`Missing step metadata for group: ${String(groupKey)}`);
//   (acc[meta.step] ??= []).push(groupKey);
//   return acc;
// }, [] as GroupKey[][]);

// export const stepFlatFields = (
//   Object.entries(wizardSchema.shape) as Array<
//     [GroupKey, WizardSchemaShape[GroupKey]]
//   >
// ).reduce((acc, [groupKey, groupSchema]) => {
//   const meta = wizardRegistry.get(groupSchema);
//   if (!meta)
//     throw new Error(`Missing step metadata for group: ${String(groupKey)}`);

//   // groupSchema is a Zod object schema, so it has `.shape`
//   const fieldKeys = Object.keys(groupSchema.shape);

//   for (const fieldKey of fieldKeys) {
//     // const path = `${String(groupKey)}.${fieldKey}` as FlatFieldPath;
//     const path = `${String(groupKey)}.${fieldKey}` as FieldPaths;
//     (acc[meta.step] ??= []).push(path);
//   }

//   return acc;
//   // }, [] as FlatFieldPath[][]);
// }, [] as FieldPaths[][]);
