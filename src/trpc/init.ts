import * as Sentry from '@sentry/nextjs';
import { headers } from 'next/headers';
import { cache } from 'react';
import superjson from 'superjson';

import { db } from '@/drizzle/db';
import { property } from '@/drizzle/schema';
import { auth } from '@/lib/auth';
import { polarClient } from '@/lib/polar';
import { initTRPC, TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';

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
    const { user } = ctx.auth;
    const PRODUCT_TIER_MAP: Record<string, string> = {
      '75b68aa7-45d4-41a8-a658-9c0b9cd60695': 'free',
      'd8839644-f591-4ae4-b4cf-5df7eebe1005': 'basic-monthly',
      'ac96bf48-4e16-4943-9f65-5fe37afa6819': 'basic-yearly',
      '44057f38-5c6b-431d-9633-be7ef9433c0e': 'pro-monthly',
      'e5cb95ff-a6be-4549-81d0-5c10170a52ca': 'pro-yearly',
    };

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

    // 1. Check if the customer has an active subscription
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

    const activeSubscription = customer.activeSubscriptions[0];
    const tier = PRODUCT_TIER_MAP[activeSubscription.productId];

    if (!tier) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Unknown subscription plan. Please contact support.',
      });
    }

    const propertyListingBenefitId = '80e0511a-1961-4554-addc-9d72e872f8dd';
    // TODO: in the future, we can check for these other benefits to gate those features as well
    // const voiceCallsBenefitId = 'b1404eae-afb4-4159-8971-74b8d1acbfdd';
    // const videoCallsBenefitId = '33c6880a-2b06-4ac2-912b-55a6594f031e';
    // const messageSendingBenefitId = 'b27278f8-ba2e-46a6-be9b-2440c1c61e1d';
    // const engagementBenefitId = 'cfab83e0-4f03-4b15-a165-25840da7c865';

    const propertyListingBenefit = customer.grantedBenefits.find(
      (benefit) => benefit.benefitId === propertyListingBenefitId,
    );

    if (!propertyListingBenefit) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Your plan does not include property listing access.',
      });
    }

    const rawLimit = propertyListingBenefit.benefitMetadata?.[tier];
    const limit =
      rawLimit === 'unlimited' ? Infinity : parseInt(String(rawLimit), 10);

    if (isNaN(limit)) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Could not determine your property listing limit.',
      });
    }

    // how much properties the user has listed
    const currentPropertyCount = await db.$count(
      property,
      eq(property.authorId, user.id),
    );

    if (currentPropertyCount >= limit) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `You've reached your plan's limit of ${limit} properties. Please upgrade to add more.`,
      });
    }

    return next({ ctx: { ...ctx, customer, createPropertyLimit: limit } });
  },
);
