import { db } from '@/drizzle/db';
import { user as userTable } from '@/drizzle/schema';
import { MatchTestEnv } from '@/drizzle/schema/match-test-env';
import { env } from '@/env';
import { generateChannelId } from '@/lib/helpers';
import { generateTokenForUser } from '@/lib/stream';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import { and, eq, or } from 'drizzle-orm';
import { StreamChat } from 'stream-chat';
import { z } from 'zod';

const friendSchema = z.object({
  ownerId: z.string(),
});

export const testPurposeRouter = createTRPCRouter({
  // TODO: This was for testing only, will remove later
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
      try {
        const result = await db.transaction(async (tx) => {
          // 1. if any match between this two user with the isActive=true return that
          const exisitingMatch = await tx.query.match.findFirst({
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
            const channelInstance = serverClient.channel(
              'messaging',
              channelId,
              {
                members: [myId, ownerId],
                created_by_id: myId, // or ownerId, doesn't matter
              },
            );
            const newChannel = await channelInstance.create();
            const newMatch = await tx
              .insert(MatchTestEnv)
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
                code: 'BAD_REQUEST',
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
      } catch (error) {
        console.error('Error in addFriend mutation:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while adding friend',
        });
      }
    }),

  // TODO: This was for testing only, will remove later
  removeFriend: protectedProcedure
    .input(friendSchema)
    .mutation(async ({ ctx, input }) => {
      const myId = ctx.auth.user.id;
      const ownerId = input.ownerId;
      const deletedMatch = await db.transaction(async (tx) => {
        const [res] = await tx
          .delete(MatchTestEnv)
          .where(
            and(
              eq(MatchTestEnv.isActive, true),
              or(
                and(
                  eq(MatchTestEnv.user1Id, myId),
                  eq(MatchTestEnv.user2Id, ownerId),
                ),
                and(
                  eq(MatchTestEnv.user1Id, ownerId),
                  eq(MatchTestEnv.user2Id, myId),
                ),
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

  // TODO: WILL REMOVE LATER TEST PURPOSE ONLY
  getUsers: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx.auth;
    const users = await db.query.user.findMany({
      // exclude current user
      // where: (userTable, { ne }) => ne(userTable.id, user.id),
      where: (userTable, { and, ne }) => {
        return and(ne(userTable.id, user.id), ne(userTable.role, 'admin'));
      },
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

    // return isMatched:true/false, along with the users data, so the client can decide to show "Start Chat" or "Continue Chat" button
    const matchedUsers = await db.query.MatchTestEnv.findMany({
      where: (matchTable, { eq, and, or }) =>
        and(
          eq(matchTable.isActive, true),
          or(eq(matchTable.user1Id, user.id), eq(matchTable.user2Id, user.id)),
        ),
    });

    const matchedUserIds = new Set(
      matchedUsers.map((match) =>
        match.user1Id === user.id ? match.user2Id : match.user1Id,
      ),
    );

    return users.map((u) => ({
      ...u,
      isMatched: matchedUserIds.has(u.id),
    }));
  }),

  // TODO: WILL REMOVE LATER TEST PURPOSE ONLY
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

  // TODO: WILL REMOVE LATER TEST PURPOSE ONLY
  getMatchedUsers: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx.auth;
    const matchedUsers = await db.query.MatchTestEnv.findMany({
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
});
