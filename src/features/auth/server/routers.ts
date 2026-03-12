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
import { TRPCError } from '@trpc/server';

export const usersRouter = createTRPCRouter({
  signUpUser: baseProcedure.input(signupSchema).mutation(async ({ input }) => {
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
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Failed to sign up user.',
      });
    }

    const responseClone = response.clone();
    const responseData = (await responseClone.json()) as ServerSession;

    // start the background task
    await inngest.send({
      name: 'user/new.signup',
      data: responseData.user,
    });
    
    return responseData;
  }),

  // signUpComplete: protectedProcedure.input().mutation(async ({ ctx, input }) => { }),

  signInUser: baseProcedure.input(loginSchema).mutation(async ({ input }) => {
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
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: errorData.error || 'Failed to sign in user.',
      });
    }

    return response;
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
});
