import { inngest as inngestFn } from '@/inngest/client';
import * as Sentry from '@sentry/nextjs';
import { TRPCError } from '@trpc/server';
import { addDays, addMinutes } from 'date-fns';
import { and, desc, eq, gte, or, sql } from 'drizzle-orm';
import { StepError } from 'inngest';
import { revalidatePath } from 'next/cache';

import { db } from '@/drizzle/db';
import {
  property as PropertyTable,
  propertyFavorite,
  propertyHold,
  propertyStats,
} from '@/drizzle/schema';
import { like as LikeTable } from '@/drizzle/schema/like';
import { match as MatchTable } from '@/drizzle/schema/match';
import { paymentPolicyCheckProcedure } from '@/lib/property-actions';
import { basicFilterSchema } from '@/lib/validators/property-filter-sort-query-schema';
import {
  addHoldToAProperty,
  addLikeToPropertySchema,
  addPropertyToFavoriteList,
  addViewsToAProperty,
} from '@/lib/validators/property-schema';
import { sendInAppNotification } from '@/novu/functions';
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from '@/trpc/init';

const isDev = process.env.NODE_ENV === 'development';

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
              const completeAddress = `${ownerProperty.region.name}, ${ownerProperty.country.name}, ${ownerProperty.state.name}, ${ownerProperty.city.name}, ${ownerProperty.streetAddress}, ${ownerProperty.zipcode}`;
              const novuPayload = {
                workflowType: 'liked-property' as WorkflowTypes,
                user: user,
                propertyOwnerId: ownerId,
                propertyType: ownerProperty.roomType,
                propertyAddress: completeAddress,
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

  // holding a property for 7 days
  addHoldToAProperty: protectedProcedure
    .input(addHoldToAProperty)
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx.auth;

      const { propertyId, path } = input;

      const commited = await db.transaction(async (trx) => {
        const existingProperty = await trx.query.property.findFirst({
          where: and(
            eq(PropertyTable.id, propertyId),
            eq(PropertyTable.isAvailable, true),
          ),
        });
        if (!existingProperty) {
          return {
            success: false,
            message: 'Property not available',
          };
        }

        const expiryTime = isDev
          ? addMinutes(new Date(), 2) // for 2 minutes for testing purpose
          : addDays(new Date(), 7); // 7 days for production

        const hold = await trx
          .insert(propertyHold)
          .values({
            propertyId,
            holdBy: user.id,
            holdStatus: 'active',
            isActiveHold: true,
            holdDate: new Date(),
            expiredAt: expiryTime,
          })
          .returning();

        const excludedHolds = sql.raw(`excluded.${propertyStats.holds.name}`);

        // add a stat record
        const [updatedStats] = await trx
          .insert(propertyStats)
          .values({
            propertyId: existingProperty.id,
            holds: 1,
          })
          .onConflictDoUpdate({
            target: propertyStats.propertyId,
            set: {
              holds: sql`${propertyStats.holds} + 1`,
            },
            setWhere: or(sql`${propertyStats.holds} != ${excludedHolds}`),
          })
          .returning({
            id: propertyStats.propertyId,
            holds: propertyStats.holds,
          });

        return {
          success: true,
          message: 'Property on hold for 7 days',
          hold,
          updatedStats,
        };
      });

      if (commited.success) {
        try {
          await inngestFn.send({
            name: 'property/hold-expiry-check',
            data: { propertyId },
          });
        } catch (error) {
          console.error('Error in holding property:', error);
        } finally {
          if (path) {
            const finalPath = `/(root)/${path}`;
            revalidatePath(finalPath, 'page');
          } else {
            revalidatePath('/(root)/swapings', 'page');
          }
        }
      }

      return commited;
    }),

  // mark favorite / unfavorite a property
  addPropertyToFavorite: protectedProcedure
    .input(addPropertyToFavoriteList)
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx.auth;

      const { propertyId, path } = input;

      try {
        const commited = await db.transaction(async (trx) => {
          const existingProperty = await trx.query.property.findFirst({
            where: eq(PropertyTable.id, propertyId),
          });
          if (!existingProperty) {
            return {
              success: false,
              message: 'Property not available',
            };
          }

          const [favorite] = await trx
            .insert(propertyFavorite)
            .values({
              propertyId,
              favoriteBy: user.id,
              favoriteAt: new Date(),
            })
            .onConflictDoNothing()
            .returning();

          let updatedStats: {
            id: string;
            favorites: number;
          }[] = [];
          if (favorite) {
            updatedStats = await trx
              .insert(propertyStats)
              .values({
                propertyId: existingProperty.id,
                favorites: 1,
              })
              .onConflictDoUpdate({
                target: propertyStats.propertyId,
                set: { favorites: sql`${propertyStats.favorites} + 1` },
              })
              .returning({
                id: propertyStats.propertyId,
                favorites: propertyStats.favorites,
              });
          }

          // const excludedFavorites = sql.raw(
          //   `excluded.${propertyStats.favorites.name}`,
          // );

          // // add a stat record
          // const [updatedStats] = await trx
          //   .insert(propertyStats)
          //   .values({
          //     propertyId: existingProperty.id,
          //     favorites: 1,
          //   })
          //   .onConflictDoUpdate({
          //     target: propertyStats.propertyId,
          //     set: {
          //       favorites: sql`${propertyStats.favorites} + 1`,
          //     },
          //     setWhere: or(
          //       sql`${propertyStats.favorites} != ${excludedFavorites}`,
          //     ),
          //   })
          //   .returning({
          //     id: propertyStats.propertyId,
          //     favorites: propertyStats.favorites,
          //   });

          return {
            success: true,
            message: 'Property on favorite',
            favorite,
            updatedStats: updatedStats[0],
          };
        });
        return commited;
      } catch (err) {
        console.log('error in adding to favorite', err);
        Sentry.captureException(err);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to favorite property',
        });
      } finally {
        if (path) {
          const finalPath = `/(root)/${path}`;
          revalidatePath(finalPath, 'page');
        } else {
          revalidatePath('/(root)/swapings', 'page');
        }
      }
    }),

  // add views to propertyStats table on every visit
  addViewsToProperty: protectedProcedure
    .input(addViewsToAProperty)
    .mutation(async ({ input, ctx }) => {
      const { propertyId, path } = input;
      const { user } = ctx.auth;

      try {
        const commited = await db.transaction(async (trx) => {
          const existingProperty = await trx.query.property.findFirst({
            where: eq(PropertyTable.id, propertyId),
          });

          if (!existingProperty) {
            return {
              success: false,
              message: 'Property not available',
            };
          }

          // check if a stats record exists for this property
          // const existingStats = await trx.query.propertyStats.findFirst({
          //   where: (stats, { eq }) => eq(stats.propertyId, existingProperty.id),
          // });

          // let updatedStats: {
          //   id: string;
          //   views: number;
          // }[] = [];
          // if (existingStats) {
          //   updatedStats = await trx
          //     .update(propertyStats)
          //     .set({
          //       views: sql`${propertyStats.views} + 1`,
          //     })
          //     .where(eq(propertyStats.propertyId, existingProperty.id))
          //     .returning({
          //       id: propertyStats.propertyId,
          //       views: propertyStats.views,
          //     });
          // } else {
          //   updatedStats = await trx
          //     .insert(propertyStats)
          //     .values({
          //       propertyId: existingProperty.id,
          //       views: 1,
          //     })
          //     .returning({
          //       id: propertyStats.propertyId,
          //       views: propertyStats.views,
          //     });
          // }

          // Atomic upsert avoids race on first concurrent views.
          const [updatedStats] = await trx
            .insert(propertyStats)
            .values({
              propertyId: existingProperty.id,
              views: 1,
            })
            .onConflictDoUpdate({
              target: propertyStats.propertyId,
              set: {
                views: sql`${propertyStats.views} + 1`,
              },
            })
            .returning({
              id: propertyStats.propertyId,
              views: propertyStats.views,
            });

          return {
            success: true,
            message: 'Property views updated',
            updatedStats,
          };

          // const excludedViews = sql.raw(`excluded.${propertyStats.views.name}`);

          // add a stat record
          // const [updatedStats] = await trx
          //   .insert(propertyStats)
          //   .values({
          //     propertyId: existingProperty.id,
          //     views: 1,
          //   })
          //   .onConflictDoUpdate({
          //     target: propertyStats.propertyId,
          //     set: {
          //       views: sql`${propertyStats.views} + 1`,
          //     },
          //     setWhere: or(sql`${propertyStats.views} != ${excludedViews}`),
          //   })
          //   .returning({
          //     id: propertyStats.propertyId,
          //     views: propertyStats.views,
          //   });

          // return {
          //   success: true,
          //   message: "Property views updated",
          //   updatedStats,
          // };
        });
        return commited;
      } catch (err) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to add views to property',
        });
      }
    }),

  getHoldedProperties: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx.auth;

    const holdedProperties = await db.query.propertyHold.findMany({
      with: {
        property: {
          columns: {
            id: true,
            region: true,
            country: true,
            state: true,
            city: true,
            images: true,
            roomType: true,
            streetAddress: true,
            zipcode: true,
          },
        },
        holdBy: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      where(propertyHoldTable, { eq, not, and }) {
        return eq(propertyHoldTable.holdBy, user.id);
      },
    });

    return holdedProperties;
  }),

  getLikedProperties: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx.auth;

    const likedProperties = await db.query.like.findMany({
      where(likeTable, { eq, not, and }) {
        return eq(likeTable.fromUserId, user.id);
      },
      with: {
        property: {
          columns: {
            id: true,
            region: true,
            country: true,
            state: true,
            city: true,
            images: true,
            roomType: true,
            streetAddress: true,
            zipcode: true,
          },
        },
      },
    });
    return likedProperties;
  }),

  getUserFavouriteProperties: protectedProcedure
    .input(basicFilterSchema)
    .query(async ({ ctx, input }) => {
      const { user } = ctx.auth;

      const { offset, limit, sort } = input;

      const pageNumber = Math.max(1, parseInt(offset || '1', 10) || 1);
      const pageSize = Math.max(1, parseInt(limit || '20', 10) || 20);
      const dbOffset = (pageNumber - 1) * pageSize;

      const totalCount = await db.$count(
        propertyFavorite,
        eq(propertyFavorite.favoriteBy, user.id),
      );

      const favoriteProperties = await db.query.propertyFavorite.findMany({
        where(propertyFavoriteTable, { eq }) {
          return eq(propertyFavoriteTable.favoriteBy, user.id);
        },
        with: {
          property: {
            columns: {
              id: true,
              roomType: true,
              amenities: true,
              images: true,
              country: true,
              state: true,
              city: true,
              region: true,
              streetAddress: true,
              zipcode: true,
            },
            with: {
              author: {
                columns: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
          favoriteBy: {
            columns: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        limit: pageSize,
        offset: dbOffset,
        orderBy: (propertyFavoriteTable, { asc, desc }) => {
          if (sort === 'asc') {
            return asc(propertyFavoriteTable.favoriteAt);
          }
          return desc(propertyFavoriteTable.favoriteAt);
        },
      });

      // console.log("favoriteProperties", favoriteProperties.length); // 2
      // console.log("totalCount", totalCount); // 3

      return { properties: favoriteProperties, totalCount };
    }),

  getTrendingProperties: baseProcedure.query(async () => {
    // const mostViewed = await db.query.propertyStats.findMany({
    //   columns: {
    //     id: true,
    //     propertyId: true,
    //     views: true,
    //   },
    //   with: {
    //     property: {
    //       columns: {
    //         id: true,
    //         roomType: true,
    //         images: true,
    //         country: true,
    //         state: true,
    //         city: true,
    //         region: true,
    //         streetAddress: true,
    //         zipcode: true,
    //       },
    //     },
    //   },
    //   where(fields, { and, gte, eq }) {
    //     const isAvailable = eq(PropertyTable.isAvailable, true);
    //     // return gte(fields.views, 1);
    //     return and(isAvailable, gte(fields.views, 1));
    //   },

    //   orderBy: (propertys, { desc }) => [desc(propertys.views)],
    //   limit: 12,
    // });

    /* Option 1: Standard Join (Recommended)*/
    const mostViewed = await db
      .select({
        id: propertyStats.id,
        propertyId: propertyStats.propertyId,
        views: propertyStats.views,
        property: {
          id: PropertyTable.id,
          roomType: PropertyTable.roomType,
          images: PropertyTable.images,
          country: PropertyTable.country,
          state: PropertyTable.state,
          city: PropertyTable.city,
          region: PropertyTable.region,
          streetAddress: PropertyTable.streetAddress,
          zipcode: PropertyTable.zipcode,
        },
      })
      .from(propertyStats)
      .innerJoin(PropertyTable, eq(propertyStats.propertyId, PropertyTable.id))
      .where(
        and(eq(PropertyTable.isAvailable, true), gte(propertyStats.views, 1)),
      )
      .orderBy(desc(propertyStats.views))
      .limit(12);

    return mostViewed;

    /* Option 2: Standard Join with raw SQL order (Zero Import Changes) */

    // const mostViewed = await db
    //   .select({
    //     id: propertyStats.id,
    //     propertyId: propertyStats.propertyId,
    //     views: propertyStats.views,
    //     property: {
    //       id: PropertyTable.id,
    //       roomType: PropertyTable.roomType,
    //       images: PropertyTable.images,
    //       country: PropertyTable.country,
    //       state: PropertyTable.state,
    //       city: PropertyTable.city,
    //       region: PropertyTable.region,
    //       streetAddress: PropertyTable.streetAddress,
    //       zipcode: PropertyTable.zipcode,
    //     },
    //   })
    //   .from(propertyStats)
    //   .innerJoin(PropertyTable, eq(propertyStats.propertyId, PropertyTable.id))
    //   .where(
    //     and(
    //       eq(PropertyTable.isAvailable, true),
    //       gte(propertyStats.views, 1)
    //     )
    //   )
    //   .orderBy(sql`${propertyStats.views} DESC`)
    //   .limit(12);
    // return mostViewed;
  }),
});
