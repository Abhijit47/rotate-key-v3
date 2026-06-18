import * as Sentry from '@sentry/nextjs';
import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import { StepError } from 'inngest';
import { inngest as inngestFn } from '@/inngest/client';
import { revalidatePath } from 'next/cache';

import { db } from '@/drizzle/db';
import { property as PropertyTable } from '@/drizzle/schema';
import { like as LikeTable } from '@/drizzle/schema/like';
import { match as MatchTable } from '@/drizzle/schema/match';
import { paymentPolicyCheckProcedure } from '@/lib/property-actions';
import { addLikeToPropertySchema } from '@/lib/validators/property-schema';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { sendInAppNotification } from '@/novu/functions';

export const engagementRouter = createTRPCRouter({
  addLikeToProperty: protectedProcedure
    .input(addLikeToPropertySchema)
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx.auth;

      const { propertyId, path } = input;

      const fromUserId = user.id;

      const checkEngagementLimit = await paymentPolicyCheckProcedure({
        type: 'propertyEngagement',
      });
      // console.log('Engagement limit check result:', checkEngagementLimit);
      if (checkEngagementLimit.success) {
        try {
          const commited = await db.transaction(async (trx) => {
            // 1. Insert like if not already present
            const existing = await trx.query.like.findFirst({
              where: and(
                eq(LikeTable.fromUserId, fromUserId),
                eq(LikeTable.propertyId, propertyId),
              ),
            });
            if (existing) {
              return {
                success: false,
                isMatch: false,
                message: 'You already liked this property.',
                user1Id: undefined,
                user2Id: undefined,
                newMatchId: undefined,
              };
            }

            // 2. Get property and owner
            const ownerProperty = await trx.query.property.findFirst({
              where: and(
                eq(PropertyTable.id, propertyId),
                eq(PropertyTable.isAvailable, true),
              ),
            });
            if (!ownerProperty) {
              return {
                success: false,
                isMatch: false,
                message: 'Property not available.',
                user1Id: undefined,
                user2Id: undefined,
                newMatchId: undefined,
              };
            }
            const ownerId = ownerProperty.authorId;

            // 3. Self-like, never matched
            if (ownerId === fromUserId) {
              await trx.insert(LikeTable).values({ fromUserId, propertyId });
              return {
                success: true,
                isMatch: false,
                message: 'Like recorded (self-like, no match possible).',
                user1Id: undefined,
                user2Id: undefined,
                newMatchId: undefined,
              };
            }

            // 4. Insert the like
            const [newLike] = await trx
              .insert(LikeTable)
              .values({ fromUserId, propertyId })
              .returning();
            if (newLike) {
              // Only sent notification to the owner, currentUser hit the like button, no heavy calculation required.
              const address = `${ownerProperty.streetAddress}, ${ownerProperty.city}, ${ownerProperty.state}, ${ownerProperty.zipCode}`;
              const novuPayload = {
                workflowType: 'liked-property' as WorkflowTypes,
                user: user,
                propertyOwnerId: ownerId,
                propertyType: ownerProperty.type,
                propertyAddress: address,
              };
              await sendInAppNotification({ payload: novuPayload });
            }

            // 5. Prevent duplicate match for the same user-pair (regardless of property)
            let user1Id = fromUserId,
              user2Id = ownerId;
            if (user2Id < user1Id) {
              [user1Id, user2Id] = [user2Id, user1Id];
            }
            // Check if a match exists between these users on ANY property pair
            const matchExists = await trx.query.match.findFirst({
              where: and(
                eq(MatchTable.user1Id, user1Id),
                eq(MatchTable.user2Id, user2Id),
              ),
            });
            if (matchExists) {
              return {
                success: true,
                isMatch: false,
                message:
                  'Like recorded, already matched with this user before.',
                user1Id: undefined,
                user2Id: undefined,
                newMatchId: undefined,
              };
            }

            // 6. Check if this like makes a mutual match (does owner like any of my properties?)
            const myProperties = await trx.query.property.findMany({
              where: eq(PropertyTable.authorId, fromUserId),
            });
            for (const myProp of myProperties) {
              const reverseLike = await trx.query.like.findFirst({
                where: and(
                  eq(LikeTable.fromUserId, ownerId),
                  eq(LikeTable.propertyId, myProp.id),
                ),
              });
              if (reverseLike) {
                // Normalize property1Id / property2Id with the sorted user IDs.
                const [property1Id, property2Id] =
                  user1Id === fromUserId
                    ? [myProp.id, propertyId]
                    : [propertyId, myProp.id];

                const [newMatch] = await trx
                  .insert(MatchTable)
                  .values({
                    user1Id,
                    user2Id,
                    property1Id,
                    property2Id,
                    isActive: true,
                    channelType: 'messaging',
                  })
                  .returning({ id: MatchTable.id });

                return {
                  success: true,
                  isMatch: true,
                  message: `🎊 It's a Match! Now only one match exists between you and this user.`,
                  user1Id: fromUserId,
                  user2Id: ownerId,
                  newMatchId: newMatch.id,
                };
              }
            }

            // 7. No mutual like found, just a like
            return {
              success: true,
              isMatch: false,
              message: 'Like recorded, no match yet.',
              user1Id: undefined,
              user2Id: undefined,
              newMatchId: undefined,
            };
          });
          // transaction end here

          // do other stuff if needed on match, e.g. send notifications, etc.
          if (
            commited.isMatch &&
            commited.user1Id &&
            commited.user2Id &&
            commited.newMatchId
          ) {
            try {
              // heavy lifting take over by inngest
              await inngestFn.send({
                name: 'matched/create-channel',
                data: {
                  user1Id: commited.user1Id,
                  user2Id: commited.user2Id,
                  newMatchId: commited.newMatchId,
                },
              });
            } catch (error) {
              console.error(error);
              if (error instanceof StepError) {
                Sentry.logger.error(error.message, {
                  //
                });
              }
            }

            // return commited;
          }

          return {
            success: commited.success,
            isMatch: commited.isMatch,
            message: commited.message,
          };
        } catch (error) {
          console.error('Error in likePropertyAndMaybeMatch:', error);
          return {
            success: false,
            isMatch: false,
            message: 'Internal server error',
            user1Id: undefined,
            user2Id: undefined,
            newMatchId: undefined,
          };
        } finally {
          if (path) {
            const finalPath = `/(root)/${path}`;
            revalidatePath(finalPath, 'page');
          } else {
            revalidatePath('/(root)/swapings', 'page');
          }
        }
      } else {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: checkEngagementLimit.message,
        });
      }
    }),
});
