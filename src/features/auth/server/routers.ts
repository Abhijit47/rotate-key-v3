import { eq } from 'drizzle-orm';

import { db } from '@/drizzle/db';
import { user as userTable } from '@/drizzle/schema';
import { onboardingSchema } from '@/lib/validators/auth-schemas';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { TRPCError } from '@trpc/server';

export const usersRouter = createTRPCRouter({
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
    }),
});
