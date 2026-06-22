import { DrizzleError, eq, sql } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { UploadApiOptions, UploadApiResponse } from 'cloudinary';
import { isAPIError } from 'better-auth/api';
import { logger } from '@sentry/nextjs';

import { db } from '@/drizzle/db';
import { user as UserTable } from '@/drizzle/schema';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { env } from '@/env';
import cloudinary from '@/configs/cloudinary';
import {
  confidentialInformationSchema,
  personalInformationSchema,
  userAvatar,
  userProfieDocument,
  userPropertyDocumentUploadSchema,
} from '@/lib/validators/profile-schemas';

export const userRouter = createTRPCRouter({
  getProfileRatio: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx.auth;

    try {
      const statement = db
        .select({
          percentage: sql<number>`
          round(
            (
              (case when ${UserTable.emailVerified} = true then 1 else 0 end) +
              (case when ${UserTable.image} != '/api/avatar?name=user' then 1 else 0 end) +
              (case when ${UserTable.whereAreYouFrom} is not null and ${UserTable.whereAreYouFrom} != '' then 1 else 0 end) +
              (case when ${UserTable.whereDoYouWantToGo} is not null and ${UserTable.whereDoYouWantToGo} != '' then 1 else 0 end) +
              (case when ${UserTable.socialProvider} is not null then 1 else 0 end) +
              (case when ${UserTable.isOnboarded} = true then 1 else 0 end) +
              (case when ${UserTable.firstName} is not null and ${UserTable.firstName} != '' then 1 else 0 end) +
              (case when ${UserTable.lastName} is not null and ${UserTable.lastName} != '' then 1 else 0 end) +
              (case when array_length(${UserTable.spokenLanguages}, 1) > 0 then 1 else 0 end) +
              (case when ${UserTable.country} is not null and ${UserTable.country} != '' then 1 else 0 end) +
              (case when ${UserTable.aboutMe} is not null and ${UserTable.aboutMe} != '' then 1 else 0 end) +
              (case when ${UserTable.yearOfBirth} is not null and ${UserTable.yearOfBirth} != '' then 1 else 0 end) +
              (case when ${UserTable.contactNumber} is not null and ${UserTable.contactNumber} != '' then 1 else 0 end) +
              (case when ${UserTable.isContactNumberVerified} = true then 1 else 0 end) +
              (case when ${UserTable.profileVerificationDocument} is not null and ${UserTable.profileVerificationDocument} != '' then 1 else 0 end) +
              (case when ${UserTable.isProfileDocumentVerified} = true then 1 else 0 end) +
              (case when ${UserTable.propertyDocument} is not null and ${UserTable.propertyDocument} != '' then 1 else 0 end) +
              (case when ${UserTable.isPropertyDocumentUploaded} = true then 1 else 0 end) +
              (case when ${UserTable.isPropertyDocumentVerified} = true then 1 else 0 end)
            )::numeric * 100 / 19,
            2
          )
        `.as('percentage'),
        })
        .from(UserTable)
        .where(eq(UserTable.id, user.id))
        .prepare('user-profile-ratio');

      const [profileCompletionRatio] = await statement.execute();

      if (!profileCompletionRatio) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Something went wrong.',
        });
      }

      return profileCompletionRatio;
    } catch (err) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error.',
      });
    }
  }),

  updateUserPersonalInfo: protectedProcedure
    .input(personalInformationSchema)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.auth;

      try {
        const [updateInfo] = await db
          .update(UserTable)
          .set({
            firstName: input.firstName,
            lastName: input.lastName,
            spokenLanguages: input.spokenLanguages,
            country: input.country,
            aboutMe: input.about,
          })
          .where(eq(UserTable.id, user.id))
          .returning();

        if (!updateInfo) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Personal Information update not successful.',
          });
        }
      } catch (err) {
        if (isAPIError(err)) {
          console.log(err.message, err.status);
          throw new Error(err.message);
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Internal server error. 💣💣💣💣',
        });
      }
    }),

  updateUserConfidentialInfo: protectedProcedure
    .input(confidentialInformationSchema)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.auth;

      try {
        const [updateInfo] = await db
          .update(UserTable)
          .set({
            yearOfBirth: input.yearOfBirth,
            contactNumber: input.contactNumber,
          })
          .where(eq(UserTable.id, user.id))
          .returning();

        if (!updateInfo) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Confidential Information update not successful.',
          });
        }
      } catch (err) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Internal server error.',
        });
      }
    }),

  updateUserAvatar: protectedProcedure
    .input(userAvatar)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.auth;
      const { rawFile } = input;
      if (!rawFile.base64) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Image data is required.',
        });
      }

      // Rough limit: 2MB binary is ~3+MB base64
      const MAX_BASE64_LENGTH = 3 * 1024 * 1024;
      if (rawFile.base64.length > MAX_BASE64_LENGTH) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Image is too large (max 2MB).',
        });
      }

      const fileName = `${user.id}:user-avatar:${Date.now()}`;
      const buffer = Buffer.from(rawFile.base64, 'base64');
      const uploadOptions: UploadApiOptions = {
        resource_type: 'auto',
        public_id: fileName,
        upload_preset: env.CLOUDINARY_UPLOAD_PRESET_NAME,
        tags: ['my-avatars', `user_id:${user.id}`],
        folder: `${env.CLOUDINARY_BASE_FOLDER_NAME}/${user.id}/my-avatars`,
        // TODO: Add notification URL to handle post-upload processing if needed
        // notification_url: `${BASE_URL}/${locale}/api/webhooks/cloudinary`,
        filename_override: fileName,
      };

      try {
        // Cloudinary upload and get back the URL
        const result: UploadApiResponse = await new Promise(
          (resolve, reject) => {
            cloudinary.uploader
              .upload_stream(uploadOptions, (error, result) => {
                if (error) reject(error);
                else if (result) resolve(result);
                else
                  reject(
                    new TRPCError({
                      code: 'BAD_REQUEST',
                      message: 'Cloudinary upload failed',
                    }),
                  );
              })
              .end(buffer);
          },
        );

        const [updateInfo] = await db
          .update(UserTable)
          .set({ image: result.secure_url })
          .where(eq(UserTable.id, user.id))
          .returning();

        if (!updateInfo) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'User Avatar update failed.',
          });
        }
        return true;
      } catch (err) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Internal server error.',
        });
      }
    }),

  updateProfileDocument: protectedProcedure
    .input(userProfieDocument)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.auth;
      const { rawFile } = input;
      if (!rawFile.base64) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'PDF not uploaded',
        });
      }

      // Rough limit: 5MB binary is ~6+MB base64
      const MAX_BASE64_LENGTH = 7 * 1024 * 1024;
      if (rawFile.base64.length > MAX_BASE64_LENGTH) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'PDF is too large (max 5MB).',
        });
      }

      const fileName = `${user.id}:user-profile-document:${Date.now()}`;
      const buffer = Buffer.from(rawFile.base64, 'base64');
      const uploadOptions: UploadApiOptions = {
        resource_type: 'auto',
        public_id: fileName,
        upload_preset: env.CLOUDINARY_UPLOAD_PRESET_NAME,
        tags: ['my-documents', `user_id:${user.id}`],
        folder: `${env.CLOUDINARY_BASE_FOLDER_NAME}/${user.id}/my-documents`,
        // TODO: Add notification URL to handle post-upload processing if needed
        // notification_url: `${BASE_URL}/${locale}/api/webhooks/cloudinary`,
        filename_override: fileName,
      };

      try {
        // Cloudinary upload and get back the URL
        const result: UploadApiResponse = await new Promise(
          (resolve, reject) => {
            cloudinary.uploader
              .upload_stream(uploadOptions, (error, result) => {
                if (error) reject(error);
                else if (result) resolve(result);
                else
                  reject(
                    new TRPCError({
                      code: 'BAD_REQUEST',
                      message: 'Cloudinary upload failed',
                    }),
                  );
              })
              .end(buffer);
          },
        );

        const [updateInfo] = await db
          .update(UserTable)
          .set({ profileVerificationDocument: result.secure_url })
          .where(eq(UserTable.id, user.id))
          .returning();

        if (!updateInfo) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'User profile document update failed.',
          });
        }
        return true;
      } catch (err) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Internal server error.',
        });
      }
    }),

  userPropertyDocumentUploadComplete: protectedProcedure
    .input(userPropertyDocumentUploadSchema)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.auth;
      const { pdfDocument } = input;

      const fileName = `${user.id}:property-document:${Date.now()}`;

      if (!pdfDocument.base64) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Document data is required.',
        });
      }

      // Rough limit: 5MB binary is ~6.7MB base64
      const MAX_BASE64_LENGTH = 7 * 1024 * 1024;
      if (pdfDocument.base64.length > MAX_BASE64_LENGTH) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Document is too large (max 5MB).',
        });
      }

      const buffer = Buffer.from(pdfDocument.base64, 'base64');

      const uploadOptions: UploadApiOptions = {
        resource_type: 'auto',
        public_id: fileName,
        upload_preset: env.CLOUDINARY_UPLOAD_PRESET_NAME,
        tags: ['my-docs', `user_id:${user.id}`],
        folder: `${env.CLOUDINARY_BASE_FOLDER_NAME}/${user.id}/my-docs`,
        // TODO: Add notification URL to handle post-upload processing if needed
        // notification_url: `${BASE_URL}/${locale}/api/webhooks/cloudinary`,
        filename_override: fileName,
      };

      try {
        // Cloudinary upload and get back the URL
        const result: UploadApiResponse = await new Promise(
          (resolve, reject) => {
            cloudinary.uploader
              .upload_stream(uploadOptions, (error, result) => {
                if (error) reject(error);
                else if (result) resolve(result);
                else
                  reject(
                    new TRPCError({
                      code: 'BAD_REQUEST',
                      message: 'Cloudinary upload failed',
                    }),
                  );
              })
              .end(buffer);
          },
        );

        const [updatingUser] = await db
          .update(UserTable)
          .set({
            isPropertyDocumentUploaded: true,
            propertyDocument: result.secure_url,
          })
          .where(eq(UserTable.id, user.id))
          .returning();

        if (!updatingUser) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'User not found.',
          });
        }

        return {
          url: result.secure_url,
          isUploaded: updatingUser.isPropertyDocumentUploaded,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        if (error instanceof DrizzleError) {
          logger.error('Database error during property document upload', {
            errorMessage: error.message,
            cause: error.cause,
          });
        } else {
          logger.error('Failed to upload property document', {
            errorMessage:
              error instanceof Error ? error.message : 'Unknown error',
          });
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to upload property document.',
          cause: error instanceof Error ? error : 'Unknown error',
        });
      }
    }),
});
