import * as Sentry from '@sentry/nextjs';
import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import {
  ChannelFilters,
  MessageFilters,
  SearchOptions,
  StreamChat,
} from 'stream-chat';
import z from 'zod';

import { db } from '@/drizzle/db';
import { user as userTable } from '@/drizzle/schema';
import { env } from '@/env';
import { polarClient } from '@/lib/polar';
import { generateTokenForUser } from '@/lib/stream';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';

const friendSchema = z.object({
  ownerId: z.string(),
});

export const chatRouter = createTRPCRouter({
  refreshChatToken: protectedProcedure.mutation(async ({ ctx }) => {
    const { user } = ctx.auth;

    const now = Math.floor(Date.now() / 1000);
    const expireTime = user?.chatTokenExpireAt
      ? Math.floor(new Date(user.chatTokenExpireAt).getTime() / 1000)
      : null;

    if (
      user.chatToken &&
      user.chatToken !== 'n/a' &&
      expireTime &&
      expireTime > now + 10
    ) {
      return user.chatToken;
    } else {
      const freshToken = await generateTokenForUser(user.id);

      // update the user record with the new token and expiration
      await db
        .update(userTable)
        .set({
          chatToken: freshToken.token,
          chatTokenExpireAt: new Date(freshToken.expireTime * 1000),
          chatTokenIssuedAt: new Date(freshToken.issuedAt * 1000),
        })
        .where(eq(userTable.id, user.id));

      return freshToken.token;
    }
  }),

  getMatchedUsers: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx.auth;
    const matchedUsers = await db.query.match.findMany({
      where: (matchTable, { eq, and, or }) =>
        and(
          eq(matchTable.isActive, true),
          or(eq(matchTable.user1Id, user.id), eq(matchTable.user2Id, user.id)),
        ),
    });

    return matchedUsers.map((match) => {
      const matchedUserId =
        match.user1Id === user.id ? match.user2Id : match.user1Id;
      return {
        id: matchedUserId,
        channelId: match.channelId,
        channelType: match.channelType,
      };
    });
  }),

  getMatchedUser: protectedProcedure
    .input(friendSchema)
    .query(async ({ ctx, input }) => {
      const { user } = ctx.auth;
      const { ownerId } = input;
      const matchedRecord = await db.query.match.findFirst({
        where: (matches, { eq, or }) =>
          or(
            and(eq(matches.user1Id, user.id), eq(matches.user2Id, ownerId)),
            and(eq(matches.user1Id, ownerId), eq(matches.user2Id, user.id)),
            // eq(matches.user1Id, user.id),
            // eq(matches.user2Id, user.id),
          ),
        columns: {
          id: true,
          channelId: true,
          channelType: true,
          isActive: true,
        },
      });

      if (!matchedRecord) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No match record found for this user',
        });
      }
      return matchedRecord;
    }),

  getUserByMatchId: protectedProcedure
    .input(z.object({ matchId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { user } = ctx.auth;
      const { matchId } = input;
      const matchedRecord = await db.query.match.findFirst({
        where: (match, { eq, or }) =>
          and(
            eq(match.channelId, matchId),
            eq(match.isActive, true),
            or(eq(match.user1Id, user.id), eq(match.user2Id, user.id)),
          ),
      });

      if (!matchedRecord) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No match record found for this ID',
        });
      }

      const matchedUserId =
        matchedRecord.user1Id === user.id
          ? matchedRecord.user2Id
          : matchedRecord.user1Id;

      const matchedUser = await db.query.user.findFirst({
        where: (userTable, { eq }) => eq(userTable.id, matchedUserId),
        columns: {
          id: true,
          name: true,
          email: true,
          firstName: true,
          lastName: true,
          image: true,
          country: true,
        },
      });

      if (!matchedUser) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'No user found for the matched user ID',
        });
      }

      return matchedUser;
    }),

  checkMyChatLimit: protectedProcedure.mutation(async ({ ctx }) => {
    const myId = ctx.auth.user.id;

    const serverClient = StreamChat.getInstance(
      env.NEXT_PUBLIC_STREAM_API_KEY,
      env.STREAM_API_SECRET,
      { timeout: 6000, enableWSFallback: true },
    );

    // TODO: will come products ids will come polar API
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
      // TODO: remove after testing
      console.log({ customer });
      Sentry.addBreadcrumb({
        category: 'subscription',
        message: 'Fetched customer subscription state',
        level: 'info',
        data: {
          userId: ctx.auth.user.id,
          hasCustomer: Boolean(customer),
        },
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

    const voiceCallsBenefitId = 'b1404eae-afb4-4159-8971-74b8d1acbfdd';
    const videoCallsBenefitId = '33c6880a-2b06-4ac2-912b-55a6594f031e';
    const messageSendingBenefitId = 'b27278f8-ba2e-46a6-be9b-2440c1c61e1d';

    const messageBenefit = customer.grantedBenefits.find(
      (benefit) => benefit.benefitId === messageSendingBenefitId,
    );
    const voiceCallBenefit = customer.grantedBenefits.find(
      (benefit) => benefit.benefitId === voiceCallsBenefitId,
    );
    const videoCallBenefit = customer.grantedBenefits.find(
      (benefit) => benefit.benefitId === videoCallsBenefitId,
    );

    if (!messageBenefit || !voiceCallBenefit || !videoCallBenefit) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Your plan does not include chat access.',
      });
    }

    const messageRawLimit = messageBenefit.benefitMetadata?.[tier];
    const messageLimit =
      messageRawLimit === 'unlimited'
        ? Infinity
        : parseInt(String(messageRawLimit), 10);

    const voiceCallRawLimit = voiceCallBenefit.benefitMetadata?.[tier];
    const voiceCallLimit =
      voiceCallRawLimit === 'unlimited'
        ? Infinity
        : parseInt(String(voiceCallRawLimit), 10);

    const videoCallRawLimit = videoCallBenefit.benefitMetadata?.[tier];
    const videoCallLimit =
      videoCallRawLimit === 'unlimited'
        ? Infinity
        : parseInt(String(videoCallRawLimit), 10);

    if (isNaN(messageLimit) || isNaN(voiceCallLimit) || isNaN(videoCallLimit)) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Could not determine your chat limit.',
      });
    }

    // const FREE_TIER_MESSAGES_LIMIT = 10;
    // const PAGE_SIZE = 100;

    // let sentMessagesCount = 0;
    // let offset = 0;

    // Tip: Always include members: { $in: [userID] } in your filter to ensure consistent
    const channelFilters: ChannelFilters = {
      members: { $in: [myId] },
      // message_count: { $exists: true },
    };
    const messageFilters: string | MessageFilters = {
      // text: { $exists: true },
      user_id: { $eq: myId },
      // attachments: { $exists: true },
    };
    const searchOptions: SearchOptions = { limit: 10 };

    // Search with message filters
    const filtered = await serverClient.search(
      channelFilters,
      messageFilters,
      searchOptions,
    );

    console.log('sent messages', filtered.results.length);

    // how much properties the user has listed
    const currentMessagesCount = filtered.results.length;

    if (currentMessagesCount >= messageLimit) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `You've reached your plan's limit of ${messageLimit} messages. Please upgrade to send more.`,
      });
    }

    // TODO: in the future, we can also check voice and video call usage against those limits as well

    return {
      isMessageLimitReached: currentMessagesCount >= messageLimit,
      sentMessagesCount: currentMessagesCount,
      messageLimit,
      voiceCallLimit,
      videoCallLimit,
    };

    // while (true) {
    //   // Channel filter: only channels where current user is a member
    //   const channelFilter: ChannelFilters = {
    //     type: 'messaging' as const,
    //     members: { $in: [myId] },
    //   };

    //   const response = await serverClient.search(
    //     channelFilter,
    //     '',
    //     {
    //       limit: PAGE_SIZE,
    //       offset,
    //       sort: [{ created_at: -1 }],
    //       // Message filter: only messages sent by current user

    //       // TODO: NEED TO CHECK DOCS, SDK typings may not include message_filter_conditions
    //       // message_filter_conditions: {
    //       //   'user.id': { $eq: myId },
    //       // },
    //     }, // SDK typings may not include message_filter_conditions
    //   );

    //   const pageCount = response.results.length;
    //   sentMessagesCount += pageCount;

    //   if (pageCount < PAGE_SIZE) break;
    //   offset += PAGE_SIZE;
    // }

    // const isFreeTierLimitReached =
    //   sentMessagesCount >= FREE_TIER_MESSAGES_LIMIT;

    // return {
    //   sentMessagesCount,
    //   freeTierLimit: FREE_TIER_MESSAGES_LIMIT,
    //   isFreeTierLimitReached,
    // };
  }),
});
