import { env } from '@/env';
import * as Sentry from '@sentry/nextjs';
import { TRPCError } from '@trpc/server';
import {
  ChannelFilters,
  MessageFilters,
  SearchOptions,
  StreamChat,
} from 'stream-chat';
import z from 'zod';

import { db } from '@/drizzle/db';
import { matches, user as userTable } from '@/drizzle/schema';
import { generateChannelId } from '@/lib/helpers';
import { polarClient } from '@/lib/polar';
import { generateTokenForUser } from '@/lib/stream';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { and, eq, or } from 'drizzle-orm';

const friendSchema = z.object({
  ownerId: z.string(),
});

export const chatRouter = createTRPCRouter({
  addFriend: protectedProcedure
    .input(friendSchema)
    .mutation(async ({ ctx, input }) => {
      const myId = ctx.auth.user.id;
      const ownerId = input.ownerId;

      if (myId === ownerId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Cannot friend yourself',
        });
      }

      const result = await db.transaction(async (tx) => {
        // 1. if any match between this two user with the isActive=true return that
        const exisitingMatch = await tx.query.matches.findFirst({
          where: (table, { eq, and, or }) => {
            return and(
              or(eq(table.user1Id, myId), eq(table.user1Id, ownerId)),
              or(eq(table.user2Id, myId), eq(table.user2Id, ownerId)),
              eq(table.isActive, true),
            );
          },
        });

        if (!exisitingMatch) {
          const [user1Id, user2Id] = [myId, ownerId].sort();

          const serverClient = StreamChat.getInstance(
            env.NEXT_PUBLIC_STREAM_API_KEY,
            env.STREAM_API_SECRET,
          );

          // Deterministic channel ID
          const channelId = generateChannelId(myId, ownerId, 32, 'match');

          //  Create or get the channel
          const channelInstance = serverClient.channel('messaging', channelId, {
            members: [myId, ownerId],
            created_by_id: myId, // or ownerId, doesn't matter
          });

          const newChannel = await channelInstance.create();

          const newMatch = await tx
            .insert(matches)
            .values({
              user1Id,
              user2Id,
              isActive: true,
              channelId: newChannel.channel.cid,
              channelType: 'messaging',
            })
            .onConflictDoNothing()
            .returning();

          if (newMatch.length === 0) {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'Failed to create match record',
            });
          }

          return newMatch[0];
        }

        // 2. return the existing match record
        // console.log('existing match found', { exisitingMatch });
        return exisitingMatch;
      });
      return result;
    }),

  removeFriend: protectedProcedure
    .input(friendSchema)
    .mutation(async ({ ctx, input }) => {
      const myId = ctx.auth.user.id;
      const ownerId = input.ownerId;

      const deletedMatch = await db.transaction(async (tx) => {
        const [res] = await tx
          .delete(matches)
          .where(
            and(
              eq(matches.isActive, true),
              or(
                and(eq(matches.user1Id, myId), eq(matches.user2Id, ownerId)),
                and(eq(matches.user1Id, ownerId), eq(matches.user2Id, myId)),
              ),
            ),
          )
          .returning();

        if (!res) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'No active match found between these users',
          });
        }

        return res;
      });

      const serverClient = StreamChat.getInstance(
        env.NEXT_PUBLIC_STREAM_API_KEY,
        env.STREAM_API_SECRET,
      );

      let channelCid = deletedMatch.channelId;

      // If row doesn't have channel id, fall back to exact members matching.
      if (!channelCid) {
        const filter = {
          type: 'messaging' as const,
          members: { $eq: [myId, ownerId] },
        };
        const sort = [{ last_message_at: -1 }];
        const options = { limit: 1 };
        const channels = await serverClient.queryChannels(
          filter,
          sort,
          options,
        );
        channelCid = channels[0]?.cid;
      }

      // Best-effort external cleanup should not undo a committed DB delete.
      if (!channelCid) {
        return deletedMatch;
      }

      const response = await serverClient.deleteChannels([channelCid], {
        hard_delete: true,
      });

      if (!response.task_id) {
        return deletedMatch;
      }

      const maxAttempts = 30;
      let attempts = 0;
      while (attempts < maxAttempts) {
        const taskStatus = await serverClient.getTask(response.task_id);
        if (taskStatus['status'] === 'completed') {
          return taskStatus;
        }
        attempts++;
        await new Promise((r) => setTimeout(r, 500));
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Channel deletion task did not complete',
      });
    }),

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
    const matchedUsers = await db.query.matches.findMany({
      where: (matchesTable, { eq, and, or }) =>
        and(
          eq(matchesTable.isActive, true),
          or(
            eq(matchesTable.user1Id, user.id),
            eq(matchesTable.user2Id, user.id),
          ),
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
      const matchedRecord = await db.query.matches.findFirst({
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
      const matchedRecord = await db.query.matches.findFirst({
        where: (matches, { eq, or }) =>
          and(
            eq(matches.channelId, matchId),
            eq(matches.isActive, true),
            or(eq(matches.user1Id, user.id), eq(matches.user2Id, user.id)),
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

  // TODO: WILL REMOVE LATER TEST PURPOSE ONLY
  getUsers: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx.auth;
    const users = await db.query.user.findMany({
      // exclude current user
      // where: (userTable, { ne }) => ne(userTable.id, user.id),
      where: (userTable, { ne }) => ne(userTable.id, user.id),
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
    return users;
  }),

  checkMyChatLimit: protectedProcedure.mutation(async ({ ctx }) => {
    const myId = ctx.auth.user.id;

    const serverClient = StreamChat.getInstance(
      env.NEXT_PUBLIC_STREAM_API_KEY,
      env.STREAM_API_SECRET,
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
