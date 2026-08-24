import * as Sentry from '@sentry/nextjs';
import { TRPCError } from '@trpc/server';
import { SQL, and, count, eq, gte, not, sql } from 'drizzle-orm';
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
  basicFilterAddonSchema,
  basicFilterSchema,
} from '@/lib/validators/property-filter-sort-query-schema';
import {
  addLikeToPropertySchema,
  deletePropertySchema,
  propertyIdSchema,
} from '@/lib/validators/property-schema';
import {
  combinedPropertySchema,
  updatePropertySchema,
} from '@/lib/validators/property-schemas';
import {
  // baseProcedure,
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from '@/trpc/init';

export const propertyRouter = createTRPCRouter({
  createProperty: premiumProcedure
    .input(combinedPropertySchema)
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
            region: input.region,
            country: input.country,
            state: input.state,
            city: input.city,
            zipcode: input.zipcode,
            streetAddress: input.streetAddress,

            area: input.propertyArea,
            areaUnit: input.propertyAreaUnit,
            description: input.propertyDescription,

            roomType: input.propertyType,
            ownership: input.propertyOwnership,
            swaping: input.propertySwaping,
            rentPeriod: input.propertyRentalTypes,
            surrounding: input.propertySurrounding,
            environment: input.propertyEnvironment,
            accommodation: input.propertyAccomodationType,

            beds: input.numberOfBeds,
            bedRooms: input.propertyBedRooms,
            bathRooms: input.propertyBathRooms,
            guests: input.numberOfGuests,

            ownerName: input.propertyOwnerName
              ? input.propertyOwnerName
              : 'n/a',
            ownerEmail: input.propertyOwnerEmail
              ? input.propertyOwnerEmail
              : 'n/a',
            ownerPhone: input.propertyOwnerPhone
              ? input.propertyOwnerPhone
              : 'n/a',
            knownLanguages: input.hostKnownLanguages,

            amenities: input.propertyAmenities,
            accessibilities: input.propertyAccessibilities,
            rules: input.propertyRules,

            staysDateRange: input.staysDateRange,
            staysDuration: input.staysDurationInDays,

            images: input.propertyImages,

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
        const { propertyId, ...updateData } = input;

        const existingProperty = await db.query.property.findFirst({
          where: and(
            eq(PropertyTable.id, propertyId),
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
            region: updateData.region
              ? updateData.region
              : existingProperty.region,
            country: updateData.country
              ? updateData.country
              : existingProperty.country,
            state: updateData.state ? updateData.state : existingProperty.state,
            city: updateData.city ? updateData.city : existingProperty.city,
            zipcode: updateData.zipcode
              ? updateData.zipcode
              : existingProperty.zipcode,
            streetAddress: updateData.streetAddress
              ? updateData.streetAddress
              : existingProperty.streetAddress,

            area: updateData.propertyArea
              ? updateData.propertyArea
              : existingProperty.area,
            areaUnit: updateData.propertyAreaUnit
              ? updateData.propertyAreaUnit
              : existingProperty.areaUnit,
            description: updateData.propertyDescription
              ? updateData.propertyDescription
              : existingProperty.description,

            roomType: updateData.propertyType
              ? updateData.propertyType
              : existingProperty.roomType,
            ownership: updateData.propertyOwnership
              ? updateData.propertyOwnership
              : existingProperty.ownership,
            swaping: updateData.propertySwaping
              ? updateData.propertySwaping
              : existingProperty.swaping,
            rentPeriod: updateData.propertyRentalTypes
              ? updateData.propertyRentalTypes
              : existingProperty.rentPeriod,
            surrounding: updateData.propertySurrounding
              ? updateData.propertySurrounding
              : existingProperty.surrounding,
            environment: updateData.propertyEnvironment
              ? updateData.propertyEnvironment
              : existingProperty.environment,
            accommodation: updateData.propertyAccomodationType
              ? updateData.propertyAccomodationType
              : existingProperty.accommodation,

            beds: updateData.numberOfBeds
              ? updateData.numberOfBeds
              : existingProperty.beds,
            bedRooms: updateData.propertyBedRooms
              ? updateData.propertyBedRooms
              : existingProperty.bedRooms,
            bathRooms: updateData.propertyBathRooms
              ? updateData.propertyBathRooms
              : existingProperty.bathRooms,
            guests: updateData.numberOfGuests
              ? updateData.numberOfGuests
              : existingProperty.guests,

            ownerName: updateData.propertyOwnerName
              ? updateData.propertyOwnerName
              : existingProperty.ownerName,
            ownerEmail: updateData.propertyOwnerEmail
              ? updateData.propertyOwnerEmail
              : existingProperty.ownerEmail,
            ownerPhone: updateData.propertyOwnerPhone
              ? updateData.propertyOwnerPhone
              : existingProperty.ownerPhone,
            knownLanguages: updateData.hostKnownLanguages
              ? updateData.hostKnownLanguages
              : existingProperty.knownLanguages,

            amenities: updateData.propertyAmenities
              ? updateData.propertyAmenities
              : existingProperty.amenities,
            accessibilities: updateData.propertyAccessibilities
              ? updateData.propertyAccessibilities
              : existingProperty.accessibilities,
            rules: updateData.propertyRules
              ? updateData.propertyRules
              : existingProperty.rules,

            staysDateRange: updateData.staysDateRange
              ? updateData.staysDateRange
              : existingProperty.staysDateRange,
            staysDuration: updateData.staysDurationInDays
              ? updateData.staysDurationInDays
              : existingProperty.staysDuration,

            images: updateData.propertyImages
              ? updateData.propertyImages
              : existingProperty.images,

            updatedAt: new Date(),
          })
          .where(
            and(
              eq(PropertyTable.id, propertyId),
              eq(PropertyTable.authorId, user.id),
            ),
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

      const existingProperty = await db.query.property.findFirst({
        where: eq(PropertyTable.id, id),
      });

      if (!existingProperty) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Property not found',
        });
      }

      // if this current user booked this property with status "pending" send a property along with the property details {isBookedByMe:true/false}
      const isBookedByMe = await db.query.bookings.findFirst({
        where(fields, operators) {
          const { eq, and } = operators;
          return and(
            eq(fields.propertyId, existingProperty.id),
            eq(fields.userId, user.id),
            eq(fields.status, 'pending'),
          );
        },
        columns: {
          createdAt: false,
          updatedAt: false,
        },
      });

      return {
        ...existingProperty,
        // Do not expose owner contact data through property details.
        ownerName: undefined,
        ownerEmail: undefined,
        ownerPhone: undefined,
        isBookedByMe: !!isBookedByMe,
        bookDetailsWithCurrentUser: isBookedByMe,
      };
    }),

  getUserProperty: protectedProcedure
    .input(propertyIdSchema)
    .query(async ({ input, ctx }) => {
      const { user } = ctx.auth;

      const { id } = input;

      // get properties that associated with the user or not within the user
      const result = await db.query.property.findFirst({
        where: and(
          eq(PropertyTable.id, id),
          eq(PropertyTable.authorId, user.id),
        ),
      });

      if (!result) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Property not found',
        });
      }

      return result;
    }),

  // get property details for update only for the owner of the property
  getPropertyDetailsForUpdate: protectedProcedure
    .input(propertyIdSchema)
    .query(async ({ input, ctx }) => {
      const { user } = ctx.auth;
      const { id: propertyId } = input;

      const existingProperty = await db.query.property.findFirst({
        where: and(
          eq(PropertyTable.id, propertyId),
          eq(PropertyTable.authorId, user.id),
        ),
      });

      if (!existingProperty) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Property not found',
        });
      }

      const { id, isAvailable, authorId, createdAt, updatedAt, ...rest } =
        existingProperty;

      return rest;
    }),

  getUserProperties: protectedProcedure
    .input(basicFilterSchema)
    .query(async ({ input, ctx }) => {
      const { user } = ctx.auth;

      const { offset, limit, sort } = input;

      // console.log("server:", { offset, limit, sort });

      // const pageNumber = Math.max(1, parseInt(offset || "1", 10) || 1);
      // const pageSize = Math.max(1, parseInt(limit || "20", 10) || 20);
      // const dbOffset = (pageNumber - 1) * pageSize;

      try {
        // TODO: make a pagination with count
        const totalProperties = await db
          .select({ count: count() })
          .from(PropertyTable)
          .where(eq(PropertyTable.authorId, user.id));

        // get all user properties
        const properties = await db.query.property.findMany({
          with: {
            author: {
              columns: {
                id: true,
                name: true,
              },
            },
            // // property not created/owned by me and i held those records
            // // property.authorId !== user.id &&
            // propertyHolds: {
            //   where(fields, { eq, not }) {
            //     return and(
            //       not(eq(PropertyTable.authorId, user.id)),
            //       eq(fields.holdBy, user.id),
            //     );
            //   },
            // },
          },
          where: (property, { eq, and }) => {
            return and(
              eq(property.isAvailable, true),
              eq(property.authorId, user.id),
            );
          },
          orderBy: (property, { asc, desc }) =>
            sort === 'desc'
              ? desc(property.createdAt)
              : asc(property.createdAt),
          // limit: pageSize,
          // offset: dbOffset,
          limit: Number(limit),
          offset: Number(offset),

          // extras(fields, operators) {
          //   const { sql } = operators;
          //   // return the count of each property id associated with this user
          //   return {
          //     likesReceivedCount: sql`(
          //       SELECT COUNT(*)
          //       FROM "Like" l
          //       WHERE l."propertyId" = "Property"."id"
          //         AND l."isDeleted" = false
          //     )` as any,
          //     likesGivenCount: sql`(
          //       SELECT COUNT(*)
          //       FROM "Like" l
          //       WHERE l."fromUserId" = ${user.id}
          //         AND l."isDeleted" = false
          //     )` as any,
          //   };
          // },
        });

        // if (!properties) {
        //   throw new TRPCError({
        //     code: "NOT_FOUND",
        //     message: "Properties not found",
        //   });
        // }

        return { properties, totalProperties: totalProperties[0]?.count };
      } catch (err) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong loading your properties.',
        });
      }
    }),

  // get all properties that was not created by the current user and is available
  getPublicProperties: protectedProcedure
    .input(basicFilterAddonSchema)
    .query(async ({ input, ctx }) => {
      const { user } = ctx.auth;
      const { goto, roomType, offset, limit, sort, from, to } = input;

      // console.log({ goto, roomType, offset, limit, sort, from, to });

      const filters: SQL[] = [];

      // await db.query.users.findFirst({
      //  where: sql`myData->'a'->>'b' = ${value}`
      // });

      /*
      SELECT doc->'site_name' FROM websites
        WHERE doc @> '{"tags":[{"term":"paris"}, {"term":"food"}]}';
      */

      /*
        example:
        CREATE TABLE user_profiles (
          id SERIAL PRIMARY KEY,
          profile JSONB NOT NULL
        );

      INSERT INTO user_profiles (profile)
        VALUES
        ('{"name": "Alice", "age": 30, "interests": ["music", "travel"], "settings": {"privacy": "public", "notifications": true, "theme": "light"}}'),
        ('{"name": "Bob", "age": 25, "interests": ["photography", "cooking"], "settings": {"privacy": "private", "notifications": false}, "city": "NYC"}'),
        ('{"name": "Charlie", "interests": ["music", "cooking"], "settings": {"privacy": "private", "notifications": true, "language": "English"}}');

    /* 
    With JSONB, we can directly query and manipulate elements within the JSON structure. For example, to find all the users interested in music, we can run the query:
    */

      /*
    SELECT
    id,
    profile -> 'name' as name,
    profile -> 'interests' as interests
    FROM user_profiles
    WHERE profile @> '{"interests":["music"]}'::JSONB;
      */

      if (goto) {
        // Extracts "name" from the country JSONB column and compares it lowercased
        // filters.push(
        //   sql`lower(${PropertyTable.country}->>'name') = lower(${goto})`,
        // );

        // Uses the PostgreSQL ILIKE operator to match the country name partially and case-insensitively
        filters.push(
          sql`${PropertyTable.country}->>'name' ilike ${`%${goto}%`}`,
        );
      }

      // if (goto)
      //   filters.push(sql`lower("country"->>'name') = lower(${goto})` as SQL);

      if (roomType) filters.push(eq(PropertyTable.roomType, roomType));

      if (from && to)
        filters.push(gte(PropertyTable.staysDateRange, { from, to }));

      // 1. Safe parsing of pagination parameters
      const pageNumber = Math.max(1, parseInt(offset || '1', 10) || 1);
      const pageSize = Math.max(1, parseInt(limit || '20', 10) || 20);
      const dbOffset = (pageNumber - 1) * pageSize;

      try {
        const p1 = db
          .select({ count: count() })
          .from(PropertyTable)
          .where(
            and(
              eq(PropertyTable.isAvailable, true),
              not(eq(PropertyTable.authorId, user.id)),
              ...filters,
            ),
          )
          .prepare('total_properties_count_by_filters');

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
            propertyHolds: {
              // if i hold alreary dont show the add hold button
              where(fields, operators) {
                return operators.eq(fields.holdBy, user.id);
              },
            },

            propertyFavorites: {
              where(fields, operators) {
                return operators.eq(fields.favoriteBy, user.id);
              },
            },
          },
          where: (property, { eq, and, not }) => {
            return and(
              eq(property.isAvailable, true),
              not(eq(property.authorId, user.id)),
              ...filters,
            );
          },
          orderBy: (property, { asc, desc }) =>
            sort === 'desc'
              ? desc(property.createdAt)
              : asc(property.createdAt),
          // 2. Use the parsed pageSize and calculated dbOffset here
          limit: pageSize,
          offset: dbOffset,
        });

        // const [totalProperties] = await Promise.all([
        //   p1.execute(),
        // ]);

        const totalProperties = await p1.execute();

        return {
          properties,
          totalProperties: totalProperties[0]?.count ?? 0,
        };
      } catch (err) {
        console.log({ err });
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Something went wrong loading public properties.',
        });
      }
    }),

  // TODO: this is just for testing, will remove later, we can use this to gate any premium features in the future
  testPremium: premiumProcedure.mutation(async () => {
    return {
      message: 'You have access to premium features!',
    };
  }),

  // TODO: Will remove later.
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
