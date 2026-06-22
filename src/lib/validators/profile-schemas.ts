import { z } from 'zod';

export const PROFILE_AVATAR_ACCEPT_FILE_TYPE = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
];
export const PROFILE_AVATAR_ACCEPT_FILE_SIZE = 2 * 1024 * 1024;

export const PROFILE_VERIFICATION_DOCUMENT_ACCEPT_FILE_TYPE = 'application/pdf';
export const PROFILE_VERIFICATION_DOCUMENT_ACCEPT_FILE_SIZE = 5 * 1024 * 1024;

export const personalInformationSchema = z
  .object({
    firstName: z.string().optional().nullable(),
    lastName: z.string().optional().nullable(),
    spokenLanguages: z.array(z.string()).optional().nullable(),
    country: z.string().optional().nullable(),
    about: z.string().optional().nullable(),
  })
  .superRefine((val, ctx) => {
    if (val?.firstName?.length && val.firstName.length > 50) {
      ctx.addIssue({
        code: 'custom',
        origin: 'firstName',
        inclusive: true,
        message: `First Name 50 characters allowed`,
        input: val,
        path: ['firstName'],
      });
      ctx.aborted = true;
    }
    if (val?.lastName?.length && val.lastName.length > 50) {
      ctx.addIssue({
        code: 'custom',
        origin: 'lastName',
        inclusive: true,
        message: `Last Name 50 characters allowed`,
        input: val,
        path: ['lastName'],
      });
      ctx.aborted = true;
    }
    if (val?.spokenLanguages?.length && val.spokenLanguages.length > 5) {
      ctx.addIssue({
        code: 'custom',
        origin: 'spokenLanguages',
        inclusive: true,
        message: `Maximum 5 languages allowed`,
        input: val,
        path: ['spokenLanguages'],
      });
      ctx.aborted = true;
    }
    if (val?.about?.length && val.about.length > 500) {
      ctx.addIssue({
        code: 'custom',
        origin: 'about',
        inclusive: true,
        message: `About 500 characters allowed`,
        input: val,
        path: ['about'],
      });
      ctx.aborted = true;
    }
  });

export const confidentialInformationSchema = z
  .object({
    yearOfBirth: z.string().optional().nullable(),
    contactNumber: z.string().optional().nullable(),
    email: z.email('Invalid email address'),
    password: z.string().optional().nullable(),
    confirmPassword: z.string().optional().nullable(),
    profileDocument: z.string().optional().nullable(),
    isUploaded: z.boolean(),
  })
  .superRefine((val, ctx) => {
    if (val?.yearOfBirth?.length && val.yearOfBirth.length > 4) {
      ctx.addIssue({
        code: 'custom',
        origin: 'yearOfBirth',
        inclusive: true,
        message: `Expect date of birth in YYYY format`,
        input: val,
        path: ['yearOfBirth'],
      });
      ctx.aborted = true;
    }
    if (val?.password?.length && val.password.length < 8) {
      ctx.addIssue({
        code: 'custom',
        origin: 'password',
        inclusive: true,
        message: `Expect password more that 8-digit`,
        input: val,
        path: ['password'],
      });
      ctx.aborted = true;
    }
    if (val?.confirmPassword?.length) {
      if (val.confirmPassword.length < 8) {
        ctx.addIssue({
          code: 'custom',
          origin: 'confirmPassword',
          inclusive: true,
          message: `Expect confirm password more that 8-digit`,
          input: val,
          path: ['confirmPassword'],
        });
        ctx.aborted = true;
      }

      if (val?.password?.length && val.password !== val.confirmPassword) {
        ctx.addIssue({
          code: 'custom',
          origin: 'confirmPassword',
          inclusive: true,
          message: `Passwords not matched`,
          input: val,
          path: ['confirmPassword'],
        });
      }
    }
  });

export const userAvatar = z.object({
  rawFile: z.object({
    base64: z.string().min(1, 'Image is required'),
    name: z.string().optional(),
    type: z
      .string()
      .refine(
        (t) => PROFILE_AVATAR_ACCEPT_FILE_TYPE.includes(t),
        'Only Image file are allowed',
      ),
    size: z
      .number()
      .max(
        PROFILE_AVATAR_ACCEPT_FILE_SIZE,
        `File must be ${PROFILE_AVATAR_ACCEPT_FILE_SIZE}MB or smaller`,
      ),
    lastModified: z.number().optional(),
  }),
});

export const userProfieDocument = z.object({
  rawFile: z.object({
    base64: z.string().min(1, 'Image is required'),
    name: z.string().optional(),
    type: z
      .string()
      .refine(
        (t) => t === PROFILE_VERIFICATION_DOCUMENT_ACCEPT_FILE_TYPE,
        'Only PDF file allowed!',
      ),
    size: z
      .number()
      .max(
        PROFILE_VERIFICATION_DOCUMENT_ACCEPT_FILE_SIZE,
        `File must be ${PROFILE_VERIFICATION_DOCUMENT_ACCEPT_FILE_SIZE}MB or smaller`,
      ),
    lastModified: z.number().optional(),
  }),
});

export const userPropertyDocumentUploadSchema = z.object({
  pdfDocument: z.object({
    base64: z.string().min(1, 'Document is required'),
    name: z.string().optional(),
    type: z
      .string()
      .refine((t) => t === 'application/pdf', 'Only PDF files are allowed'),
    size: z.number().max(5 * 1024 * 1024, 'File must be 5MB or smaller'),
    lastModified: z.number().optional(),
  }),
});

export type PersonalInformationClientValues = z.infer<
  typeof personalInformationSchema
>;

export type ConfidentialInformationClientValues = z.infer<
  typeof confidentialInformationSchema
>;

export type UserAvatarValues = z.infer<typeof userAvatar>;
export type UserProfieDocumentValues = z.infer<typeof userProfieDocument>;
