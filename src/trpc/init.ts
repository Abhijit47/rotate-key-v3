import * as Sentry from '@sentry/nextjs';
import { headers } from 'next/headers';
import { cache } from 'react';
import superjson from 'superjson';

import { auth } from '@/lib/auth';
import { polarClient } from '@/lib/polar';
import { initTRPC, TRPCError } from '@trpc/server';

export const createTRPCContext = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  return session;
});
export type TRPCContext = ReturnType<typeof createTRPCContext>;
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<TRPCContext>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(
  t.middleware(async ({ ctx, next }) => {
    const session = await ctx;

    if (!session?.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'You must be logged in to access this resource.',
      });
    }

    return next({ ctx: { ...ctx, auth: session } });
  }),
);
export const premiumProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    // const customer = await polarClient.customers.getStateExternal({
    //   externalId: ctx.auth.user.id,
    // });

    let customer;
    try {
      customer = await polarClient.customers.getStateExternal({
        externalId: ctx.auth.user.id,
      });
    } catch (error) {
      Sentry.captureException(error, {
        extra: {
          context: 'Error fetching customer subscription status',
          userId: ctx.auth.user.id,
        },
      });
      throw new TRPCError({
        code: 'SERVICE_UNAVAILABLE',
        message:
          'Unable to verify subscription right now. Please try again shortly.',
      });
    }

    if (
      !customer.activeSubscriptions ||
      customer.activeSubscriptions.length === 0
    ) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message:
          'Active subscription required to access this resource. Please upgrade your plan.',
      });
    }

    return next({ ctx: { ...ctx, customer } });
  },
);
