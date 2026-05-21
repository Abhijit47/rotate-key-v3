import * as Sentry from '@sentry/nextjs';
import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import { StepError } from 'inngest';
import { revalidatePath } from 'next/cache';

import { db } from '@/drizzle/db';
import { property as PropertyTable } from '@/drizzle/schema';
import { like as LikeTable } from '@/drizzle/schema/like';
import { match as MatchTable } from '@/drizzle/schema/match';
import { inngest } from '@/inngest/client';
import { auth } from '@/lib/auth';
import { paymentPolicyCheckProcedure } from '@/lib/property-actions';
import {
  addLikeToPropertySchema,
  deletePropertySchema,
  propertyIdSchema,
  propertySchema,
  updatePropertySchema,
} from '@/lib/validators/property-schema';
import {
  // baseProcedure,
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from '@/trpc/init';

export const propertyRouter = createTRPCRouter({
  createProperty: premiumProcedure
    .input(propertySchema)
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx.auth;
      try {
        const result = await auth.api.userHasPermission({
          body: {
            userId: user.id,
            permissions: {
              property: ['create'], // This must match the structure in your access control
            },
          },
        });

        if (!result.success) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: `You do not have permission to perform this action!`,
          });
        }

        const [newProperty] = await db
          .insert(PropertyTable)
          .values({
            ...input,
            images: JSON.parse(JSON.stringify(input.images)),
            amenities: JSON.parse(JSON.stringify(input.amenities)),
            authorId: user.id,
          })
          .returning();

        return newProperty;
      } catch (error) {
        console.error('Error creating property:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while creating the property.',
        });
      }
    }),

  updateProperty: protectedProcedure
    .input(updatePropertySchema)
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx.auth;
      try {
        const result = await auth.api.userHasPermission({
          body: {
            userId: user.id,
            permissions: {
              property: ['update'], // This must match the structure in your access control
            },
          },
        });

        if (!result.success) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: `You do not have permission to perform this action!`,
          });
        }
        // update property that associated with the user
        const { id, ...updateData } = input;

        const existingProperty = await db.query.property.findFirst({
          where: and(
            eq(PropertyTable.id, id),
            eq(PropertyTable.authorId, user.id),
          ),
        });

        if (!existingProperty) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Property not found',
          });
        }

        const [updatedProperty] = await db
          .update(PropertyTable)
          .set({
            ...updateData,
            images: updateData.images
              ? updateData.images
              : existingProperty.images,
            amenities: updateData.amenities
              ? updateData.amenities
              : existingProperty.amenities,
          })
          .where(
            and(eq(PropertyTable.id, id), eq(PropertyTable.authorId, user.id)),
          )
          .returning();
        return updatedProperty;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('Error updating property:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while updating the property.',
        });
      }
    }),

  deleteProperty: protectedProcedure
    .input(deletePropertySchema)
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx.auth;

      try {
        const result = await auth.api.userHasPermission({
          body: {
            userId: user.id,
            permissions: {
              property: ['delete'], // This must match the structure in your access control
            },
          },
        });

        if (!result.success) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: `You do not have permission to perform this action!`,
          });
        }

        // delete property that associated with the user
        const { id } = input;

        const existingProperty = await db.query.property.findFirst({
          where: and(
            eq(PropertyTable.id, id),
            eq(PropertyTable.authorId, user.id),
          ),
        });

        if (!existingProperty) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Property not found',
          });
        }

        const deleted = await db
          .delete(PropertyTable)
          .where(
            and(eq(PropertyTable.id, id), eq(PropertyTable.authorId, user.id)),
          )
          .returning();
        return deleted;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('Error deleting property:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while deleting the property.',
        });
      }
    }),

  getPrivateProperties: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx.auth;

    // get properties that associated with the user
    const properties = await db.query.property.findMany({
      where: eq(PropertyTable.authorId, user.id),
      orderBy: (property, { desc }) => desc(property.createdAt),
    });

    if (properties.length === 0) {
      return [];
    }

    return properties;
  }),

  // Every card in the public listings page links here, but this route prefetches and renders getUserProperty semantics. Even after the server starts honoring id, non-owners still will not be able to open someone else’s listing from the feed. This page needs a listing-by-id query; keep getUserProperty for owner-only edit flows.

  getPropertyDetails: protectedProcedure
    .input(propertyIdSchema)
    .query(async ({ input, ctx }) => {
      const { user } = ctx.auth;
      const { id } = input;

      const property = await db.query.property.findFirst({
        where: eq(PropertyTable.id, id),
        with: {},
      });

      if (!property) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Property not found',
        });
      }

      return property;
    }),

  getUserProperty: protectedProcedure
    .input(propertyIdSchema)
    .query(async ({ input, ctx }) => {
      const { user } = ctx.auth;

      const { id } = input;

      // get properties that associated with the user or not within the user
      const removeProperty = await db.query.property.findFirst({
        where: and(
          eq(PropertyTable.id, id),
          eq(PropertyTable.authorId, user.id),
        ),
      });

      if (!removeProperty) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Property not found',
        });
      }

      return removeProperty;
    }),

  getUserProperties: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx.auth;
    // get all user properties
    const properties = await db.query.property.findMany({
      with: {
        author: {
          columns: {
            id: true,
            name: true,
          },
        },
      },
      where: (property, { eq, and }) => {
        return and(
          eq(property.isAvailable, true),
          eq(property.authorId, user.id),
        );
      },
      orderBy: (property, { desc }) => desc(property.createdAt),
    });

    if (!properties) {
      return [];
    }

    return properties;
  }),

  getPublicProperties: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx.auth;
    // get all properties
    const properties = await db.query.property.findMany({
      with: {
        author: {
          columns: {
            id: true,
            name: true,
          },
        },
        receivedLikes: {
          columns: {
            fromUserId: true,
          },
        },
      },
      where: (property, { eq, and, not }) => {
        return and(
          eq(property.isAvailable, true),
          not(eq(property.authorId, user.id)),
        );
      },
      orderBy: (property, { desc }) => desc(property.createdAt),
    });

    if (!properties) {
      return [];
    }

    return properties;
  }),

  // TODO: this is just for testing, will remove later, we can use this to gate any premium features in the future
  testPremium: premiumProcedure.mutation(async () => {
    return {
      message: 'You have access to premium features!',
    };
  }),

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
            await trx.insert(LikeTable).values({ fromUserId, propertyId });

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
                // No previous match, so first match: pick this property-pair
                // let property1Id = myProp.id,
                //   property2Id = propertyId;
                // Ensure property1 and property2 ordering matches user1/user2 ordering
                // if (user2Id < user1Id) {
                //   [property1Id, property2Id] = [property2Id, property1Id];
                // }

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

          // do other stuff if needed on match, e.g. send notifications, etc.
          if (
            commited.isMatch &&
            commited.user1Id &&
            commited.user2Id &&
            commited.newMatchId
          ) {
            try {
              // heavy lifting take over by inngest
              await inngest.send({
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
            revalidatePath('/(root)/swappings', 'page');
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
