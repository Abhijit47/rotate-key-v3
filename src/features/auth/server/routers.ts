import { logger } from '@sentry/nextjs';
import { TRPCError } from '@trpc/server';
import { isAPIError } from 'better-auth/api';
import { eq } from 'drizzle-orm';

import { db } from '@/drizzle/db';
import { user as userTable } from '@/drizzle/schema';
import { env } from '@/env';
import { inngest } from '@/inngest/client';
import { auth, ServerSession } from '@/lib/auth';
import {
  loginSchema,
  onboardingSchema,
  signupSchema,
} from '@/lib/validators/auth-schemas';
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from '@/trpc/init';

export const authRouter = createTRPCRouter({
  signUpUser: baseProcedure.input(signupSchema).mutation(async ({ input }) => {
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
        logger.error('Failed to sign up user with email', {
          statusCode: response.status,
          errorMessage: response.statusText,
        });
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Failed to sign up user.',
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
      }

      return responseData;
    } catch (error) {
      if (isAPIError(error)) {
        // console.log('signup with email->', error.message, error.status);
        logger.error('Failed to sign up user with email', {
          errorMessage: error.message,
          statusCode: error.status,
        });
      }
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Failed to sign up user.',
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

      if (!response.ok) {
        const errorData = await response.json();
        logger.error('Failed to sign in user with email', {
          statusCode: response.status,
          errorMessage: errorData.error || response.statusText,
        });
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: errorData.error || 'Failed to sign in user.',
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
      }
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Failed to sign in user.',
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

      await db
        .update(userTable)
        .set({
          whereAreYouFrom,
          whereDoYouWantToGo,
          isOnboarded: true,
        })
        .where(eq(userTable.id, user.id));

      await inngest.send({
        name: 'user/onboarding.complete',
        data: {
          ...user,
          whereAreYouFrom,
          whereDoYouWantToGo,
          isOnboarded: true,
        },
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
        // console.log('login with facebook->', error.message, error.status);
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

    const result = await inngest.send({
      name: 'user/oauth.signup.complete',
      data: user,
    });

    return result;
  }),
});
