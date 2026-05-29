import { logger } from '@sentry/nextjs';
import { TRPCError } from '@trpc/server';
import { isAPIError } from 'better-auth/api';
import { UploadApiOptions, UploadApiResponse } from 'cloudinary';
import { DrizzleError, eq } from 'drizzle-orm';

import cloudinary from '@/configs/cloudinary';
import { db } from '@/drizzle/db';
import { user as userTable } from '@/drizzle/schema';
import { env } from '@/env';
import { inngest } from '@/inngest/client';
import { auth, ServerSession } from '@/lib/auth';
import {
  loginSchema,
  onboardingSchema,
  signupSchema,
  userPropertyDocumentUploadSchema,
} from '@/lib/validators/auth-schemas';
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from '@/trpc/init';

export const authRouter = createTRPCRouter({
  signUpUser: baseProcedure.input(signupSchema).mutation(async ({ input }) => {
    // Prevent creating a duplicate account when this email already exists.
    // Existing users should sign in instead, or use the forgot-password flow if needed
    const userFound = await db.query.user.findFirst({
      where: eq(userTable.email, input.email),
    });
    if (userFound) {
      logger.error('Attempt to sign up with an email that already exists', {
        email: input.email,
      });
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'account exists',
      });
    }
    try {
      const response = await auth.api.signUpEmail({
        body: {
          name: input.fullName,
          email: input.email,
          password: input.password,
          callbackURL: `${env.BETTER_AUTH_URL}/onboarding`,
        },
        asResponse: true,
      });

      if (!response.ok) {
        // console.log('response place', { response });
        logger.error('Failed to sign up user with email', {
          statusCode: response.status,
          errorMessage: response.statusText,
        });
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: response.statusText || 'Failed to sign up user.',
        });
      }

      const responseClone = response.clone();
      const responseData = (await responseClone.json()) as ServerSession;

      // best-effort background task; don't fail signup if dispatch fails
      try {
        // start the background task
        await inngest.send({
          name: 'user/new.signup.complete',
          data: responseData.user,
        });
      } catch (dispatchError) {
        logger.error('Failed to dispatch user/new.signup.complete', {
          errorMessage:
            dispatchError instanceof Error
              ? dispatchError.message
              : 'Unknown error',
        });
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Failed to dispatch post-signup event.',
          cause:
            dispatchError instanceof Error ? dispatchError : 'Unknown error',
        });
      }

      return responseData;
    } catch (error) {
      // console.log('catch block->', error);
      if (isAPIError(error)) {
        logger.error('Failed to sign up user with email', {
          errorMessage: error.message,
          statusCode: error.status,
          url: '/auth/email-signup',
        });
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Failed to sign up user. 💣',
          cause: error,
        });
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Unexpected error during sign up. 😬',
        cause: error instanceof Error ? error : 'Unknown error',
      });
    }
  }),

  signInUser: baseProcedure.input(loginSchema).mutation(async ({ input }) => {
    try {
      const response = await auth.api.signInEmail({
        body: {
          email: input.email,
          password: input.password,
          rememberMe: input.rememberMe,
          callbackURL: `${env.BETTER_AUTH_URL}/onboarding`,
        },
        asResponse: true,
      });

      if (response.ok === false) {
        const errorData = (await response.json()) as {
          message: string;
          code: string;
        };
        // console.log('errorData place', { errorData });
        logger.error('Failed to sign in user with email', {
          statusCode: response.status,
          errorMessage: errorData.message || errorData.code || 'Unknown error',
        });
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: errorData.message,
          cause: new Error(errorData.message),
        });
      }

      const responseClone = response.clone();
      const responseData = (await responseClone.json()) as ServerSession;

      return responseData;
    } catch (error) {
      if (isAPIError(error)) {
        // console.log('login with email->', error.message, error.status);
        logger.error('Failed to sign in user with email', {
          errorMessage: error.message,
          statusCode: error.status,
        });
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message,
          cause: error.cause ?? error,
        });
      }
      throw new TRPCError({
        code: error instanceof TRPCError ? error.code : 'INTERNAL_SERVER_ERROR',
        message:
          error instanceof Error
            ? error.message
            : 'Unexpected error during sign in.',
      });
    }
  }),

  getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    const { auth } = ctx;
    const user = auth.user;

    const currentUser = await db.query.user.findFirst({
      where: eq(userTable.id, user.id),
    });

    if (!currentUser) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found.',
      });
    }

    return currentUser;
  }),

  onboardingUser: protectedProcedure
    .input(onboardingSchema)
    .mutation(async ({ ctx, input }) => {
      const { auth } = ctx;
      const { whereAreYouFrom, whereDoYouWantToGo } = input;
      const user = auth.user;

      await db.transaction(async (tx) => {
        try {
          const [updatingUser] = await tx
            .update(userTable)
            .set({
              whereAreYouFrom,
              whereDoYouWantToGo,
              isOnboarded: true,
            })
            .where(eq(userTable.id, user.id))
            .returning();

          if (!updatingUser) {
            tx.rollback();
            return;
          }
        } catch (error) {
          if (error instanceof DrizzleError) {
            logger.error('Database error during user onboarding', {
              errorMessage: error.message,
              cause: error.cause,
            });
          }

          logger.error('Failed to update user during onboarding', {
            errorMessage:
              error instanceof Error ? error.message : 'Unknown error',
          });
          tx.rollback();
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to update user during onboarding.',
            cause: error instanceof Error ? error : 'Unknown error',
          });
        }

        try {
          await inngest.send({
            name: 'user/onboarding.complete',
            data: {
              ...user,
              whereAreYouFrom,
              whereDoYouWantToGo,
              isOnboarded: true,
            },
          });
        } catch (dispatchError) {
          logger.error('Failed to dispatch user/onboarding.complete', {
            errorMessage:
              dispatchError instanceof Error
                ? dispatchError.message
                : 'Unknown error',
          });
          throw new TRPCError({
            code: 'SERVICE_UNAVAILABLE',
            message: 'Failed to dispatch onboarding complete event.',
            cause:
              dispatchError instanceof Error ? dispatchError : 'Unknown error',
          });
        }
      });
    }),

  signInWithGoogle: baseProcedure.mutation(async () => {
    try {
      const response = await auth.api.signInSocial({
        body: {
          provider: 'google',
          callbackURL: `${env.NEXT_PUBLIC_BETTER_AUTH_URL}/oauth-redirect`,
          // newUserCallbackURL: `${env.NEXT_PUBLIC_BETTER_AUTH_URL}/onboarding`,
          errorCallbackURL: `${env.NEXT_PUBLIC_BETTER_AUTH_URL}/login?error=google_auth_failed`,
          requestSignUp: true,
        },
      });
      return response;
    } catch (error) {
      if (isAPIError(error)) {
        // console.log('login with google->', error.message, error.status);
        logger.error('Failed to sign in user with google', {
          errorMessage: error.message,
          statusCode: error.status,
        });
      }
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Failed to sign in user with google.',
      });
    }
  }),

  signInWithFacebook: baseProcedure.mutation(async () => {
    try {
      const response = await auth.api.signInSocial({
        body: {
          provider: 'facebook',
          callbackURL: `${env.NEXT_PUBLIC_BETTER_AUTH_URL}/oauth-redirect`,
          // newUserCallbackURL: `${env.NEXT_PUBLIC_BETTER_AUTH_URL}/onboarding`,
          errorCallbackURL: `${env.NEXT_PUBLIC_BETTER_AUTH_URL}/login?error=facebook_auth_failed`,
          requestSignUp: true,
        },
      });
      return response;
    } catch (error) {
      if (isAPIError(error)) {
        // console.log('login with facebook->', error.message, error.status);
        logger.error('Failed to sign in user with facebook', {
          errorMessage: error.message,
          statusCode: error.status,
        });
      }

      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Failed to sign in user with facebook.',
      });
    }
  }),

  oauthSignUpComplete: protectedProcedure.mutation(async ({ ctx }) => {
    const { user } = ctx.auth;

    // const result = await inngest.send({
    //   name: 'user/oauth.signup.complete',
    //   data: user,
    // });

    // return result;
    // best-effort background task; don't fail if dispatch fails
    try {
      const result = await inngest.send({
        name: 'user/oauth.signup.complete',
        data: user,
      });
      return result;
    } catch (dispatchError) {
      logger.error('Failed to dispatch user/oauth.signup.complete', {
        errorMessage:
          dispatchError instanceof Error
            ? dispatchError.message
            : 'Unknown error',
      });
      return { dispatched: false };
    }
  }),

  // TODO: Later Move to user router
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
                else reject(new Error('Upload result is undefined'));
              })
              .end(buffer);
          },
        );

        const [updatingUser] = await db
          .update(userTable)
          .set({
            isPropertyDocumentUploaded: true,
            propertyDocument: result.secure_url,
          })
          .where(eq(userTable.id, user.id))
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
