import libphonenumber from 'google-libphonenumber';
import { z } from 'zod';

import {
  hostLanguages,
  propertyAccomodationsEnum,
  propertyEnvironmentsEnum,
  propertyOwnershipsEnum,
  propertySurroundingsEnum,
  propertySwapingsEnum,
  propertyTypesEnum,
} from '@/constants/property-assets';
import { emailRegex, validatePostalCode } from '@/lib/helpers/property-helpers';

const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();

// const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
// const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|in)$/;
const propertyAreaUnit = /^(sqft|sqm|acre|hectare)$/;
const hostLanguageEnum = hostLanguages.map((language) => language.language) as [
  string,
  ...string[],
];

export const addPropertySchema = z.object({
  /* Basic Information */
  streetAddress: z
    .string()
    .min(1, {
      error: 'Street address must be 1 to 50 characters.',
    })
    .max(50, {
      error: 'Street address must be 1 to 50 characters.',
    }),
  countryOrNation: z
    .object({
      id: z.number({ error: 'Choose a country' }),
      name: z.string({ error: 'Choose a country' }),
    })
    .superRefine((data, ctx) => {
      if (data.name.length < 1) {
        ctx.addIssue({
          code: 'too_small',
          origin: 'string',
          minimum: 1,
          inclusive: true,
          path: ['countryOrNation'],
          message: 'Choose a country',
        });
        ctx.aborted = true;
      }
      return;
    }),
  stateOrProvince: z
    .object({
      id: z.number({ error: 'Choose a state' }),
      name: z.string({ error: 'Choose a state' }),
    })
    .superRefine((data, ctx) => {
      if (data.name.length < 1) {
        ctx.addIssue({
          code: 'too_small',
          origin: 'string',
          minimum: 1,
          inclusive: true,
          path: ['stateOrProvince'],
          message: 'Choose a state',
        });
        ctx.aborted = true;
      }
    }),
  cityOrTown: z
    .object({
      id: z.number({ error: 'Choose a city' }),
      name: z.string({ error: 'Choose a city' }),
    })
    .superRefine((data, ctx) => {
      if (data.name.length < 1) {
        ctx.addIssue({
          code: 'too_small',
          origin: 'string',
          minimum: 1,
          inclusive: true,
          path: ['cityOrTown'],
          message: 'Choose a city',
        });
        ctx.aborted = true;
      }
    }),
  zipcode: z.string().superRefine((data, ctx) => {
    if (!validatePostalCode(data, 'IN')) {
      console.log('fail-status:', validatePostalCode(data, 'IN'));
      ctx.addIssue({
        code: 'invalid_format',
        format: 'postal-code',
        validation: 'regex',
        path: ['zipcode'],
        message: 'Invalid postal code',
      });
      ctx.aborted = true;
    } else {
      console.log('pass-status:', validatePostalCode(data, 'IN'));
      ctx.aborted = false;
    }
  }),
  propertyArea: z
    .string()
    .min(1, { error: 'Property area is required' })
    .max(50, { error: 'Property area must be 1 to 50 characters.' }),
  propertyAreaUnit: z.string().regex(propertyAreaUnit, {
    error: 'Please select a valid area unit.',
  }),
  propertyDescription: z
    .string()
    .min(10, {
      error: 'Property description must be 10 character.',
    })
    .max(3000, {
      error: 'Property description max limit 1000 character.',
    }),

  /* Property types information */
  propertyType: z.enum(propertyTypesEnum, {
    error: 'Please select a room type.',
  }),

  /* Property Ownership types information */
  propertyOwnership: z.enum(propertyOwnershipsEnum, {
    error: 'Please select a room ownership.',
  }),

  /* Property Swapping types information */
  propertySwaping: z.enum(propertySwapingsEnum, {
    error: 'Please select a swaping type.',
  }),

  /* Property Rental types information */
  propertyRentalTypes: z
    .string()
    .min(1, { error: 'Property rental type is required' })
    .max(50, { error: 'Property rental type must be 1 to 50 characters.' }),

  /* Property Surrounding types information */
  propertySurrounding: z.enum(propertySurroundingsEnum, {
    error: 'Please select a valid room surrounding',
  }),

  /* Property Environment types information */
  propertyEnvironment: z.enum(propertyEnvironmentsEnum, {
    error: 'Please select a valid room environment',
  }),

  /* Owner Infomation (optional) */
  propertyOwnerName: z
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
    }),
  propertyOwnerEmail: z
    .string()
    .optional()
    .superRefine((data, ctx) => {
      if (data) {
        if (!emailRegex.test(data)) {
          ctx.addIssue({
            code: 'invalid_format',
            format: 'email',
            path: ['propertyOwnerEmail'],
            message: 'Invalid email address',
          });
          ctx.aborted = true;
        } else {
          ctx.aborted = false;
        }
      }
    }),
  propertyOwnerPhone: z
    .string()
    .optional()
    .superRefine((data, ctx) => {
      if (data) {
        const phoneNumber = phoneUtil?.parse(data);
        try {
          if (!phoneUtil.isPossibleNumber(phoneNumber)) {
            ctx.addIssue({
              code: 'invalid_format',
              format: 'phone',
              path: ['propertyOwnerPhone'],
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
    }),

  /* Addl. information */
  propertyBedRooms: z.string().superRefine((data, ctx) => {
    if (data === '') {
      ctx.addIssue({
        code: 'too_small',
        origin: 'string',
        minimum: 1,
        inclusive: true,
        path: ['propertyBedRooms'],
        message: 'Bedrooms must be at least 1',
      });
      ctx.aborted = true;
    } else {
      ctx.aborted = false;
    }
  }),
  propertyBathRooms: z.string().superRefine((data, ctx) => {
    if (data === '') {
      ctx.addIssue({
        code: 'too_small',
        origin: 'string',
        minimum: 1,
        inclusive: true,
        path: ['propertyBathRooms'],
        message: 'Bathrooms must be at least 1',
      });
      ctx.aborted = true;
    } else {
      ctx.aborted = false;
    }
  }),
  numberOfGuests: z.string().superRefine((data, ctx) => {
    if (data === '') {
      ctx.addIssue({
        code: 'too_small',
        origin: 'string',
        minimum: 1,
        inclusive: true,
        path: ['numberOfGuests'],
        message: 'Guests must be at least 1',
      });
      ctx.aborted = true;
    } else {
      ctx.aborted = false;
    }
  }),
  numberOfBeds: z.string().superRefine((data, ctx) => {
    if (data === '') {
      ctx.addIssue({
        code: 'too_small',
        origin: 'string',
        minimum: 1,
        inclusive: true,
        path: ['numberOfBeds'],
        message: 'Beds must be at least 1',
      });
      ctx.aborted = true;
    } else {
      ctx.aborted = false;
    }
  }),
  hostLanguages: z
    .array(z.enum(hostLanguageEnum), {
      error: 'Please select a valid languages.',
    })
    .min(1, 'At least one language must be selected.'),

  /* Property Accomodation types information */
  propertyAccomodationType: z.enum(propertyAccomodationsEnum, {
    error: 'Please select an accomodation type.',
  }),

  /* Property Amenities information */
  propertyAmenities: z
    .array(
      z
        .string({ error: 'At least one amenity must be selected.' })
        .nonempty({ error: 'At least one amenity must be selected.' }),
    )
    .refine((amenities) => amenities.length > 0, {
      path: ['propertyAmenities'],
      error: 'At least one amenity must be selected.',
      abort: true,
    }),

  /* Property Rules information */
  propertyRules: z
    .array(
      z
        .string({ error: 'At least one rules must be selected.' })
        .nonempty({ error: 'At least one rules must be selected.' }),
    )
    .refine((rules) => rules.length > 0, {
      path: ['propertyRules'],
      error: 'At least one rules must be selected.',
      abort: true,
    }),

  /* Property Accessibilities information */
  propertyAccessibilities: z
    .array(
      z
        .string({
          error: 'At least one accessibilities must be selected.',
        })
        .nonempty({
          error: 'At least one accessibilities must be selected.',
        }),
    )
    .refine((accessibilities) => accessibilities.length > 0, {
      path: ['propertyAccessibilities'],
      error: 'At least one accessibilities must be selected.',
      abort: true,
    }),

  /* Property DateRange information */
  staysDateRange: z.object({
    from: z.date({
      error: 'Start date is required',
    }),
    to: z.date({
      error: 'End date is required',
    }),
  }),
  staysDurationInDays: z.string(),

  /* Temp. Local files store for performing upload */
  files: z
    .array(z.custom<File & { publicId?: string }>())
    .min(1, 'Please select at least one file')
    .max(6, 'Please select up to 6 files')
    .refine((files) => files.every((file) => file.size <= 10 * 1024 * 1024), {
      message: 'File size must be less than 10MB',
      path: ['files'],
    }),
  /* Property Images */
  propertyImages: z
    .array(z.url())
    .refine(
      (urls) => urls.some((url) => url !== ''),
      'At least one image is required',
    ),
});

export type AddPropertyFormValues = z.infer<typeof addPropertySchema>;
