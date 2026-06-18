import { TRPCError } from '@trpc/server';
import { and, eq, sql } from 'drizzle-orm';
import { DBQueryConfig } from 'drizzle-orm/relations';
import z from 'zod';

import { db } from '@/drizzle/db';
import { property as PropertyTable } from '@/drizzle/schema';
import { bookings as BookingTable } from '@/drizzle/schema/booking';
import { like as LikeTable } from '@/drizzle/schema/like';
import { match as MatchTable } from '@/drizzle/schema/match';
import { type InsertSwap, SwapsTable } from '@/drizzle/schema/swap';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { sendInAppNotification } from '@/novu/functions';

const createSwapSchema = z
  .object({
    bookingId: z.string().nonempty('Booking ID is required'),
    startDate: z.date(),
    endDate: z.date(),
    guestCount: z.string(),
    partnerId: z.string().nonempty('Partner ID is required'),
    partnerPropertyId: z.string().nonempty('Property ID is required'),
  })
  .refine(({ startDate, endDate }) => endDate > startDate, {
    path: ['endDate'],
    message: 'End date must be after start date',
  });

const swapablePropertiesSchema = z.object({ id: z.string() });

const acceptSwapSchema = z.object({
  swapId: z.string(),
  bookingId: z.string().nonempty('Booking ID is required'),
});

const rejectSwapSchema = z.object({ swapId: z.string() });

type UpdateSwapValues = Pick<
  InsertSwap,
  | 'user1BookingId'
  | 'user1StartDate'
  | 'user1EndDate'
  | 'user1GuestCount'
  | 'user2BookingId'
  | 'user2StartDate'
  | 'user2EndDate'
  | 'user2GuestCount'
  | 'status'
>;

type UpdateAcceptValues = Pick<
  InsertSwap,
  | 'user1BookingId'
  | 'user2BookingId'
  | 'user1Accepted'
  | 'user2Accepted'
  | 'status'
>;

export const swapRouter = createTRPCRouter({
  getSwapableProperties: protectedProcedure
    .input(swapablePropertiesSchema)
    .query(async ({ input, ctx }) => {
      const { user } = ctx.auth;

      const initiatorId = user.id; // who want to swap
      const oppositeUserId = input.id; // whose user i want to swap with,

      // Step 0 — Guard
      if (initiatorId === oppositeUserId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You cannot swap with yourself',
        });
      }

      const findTransaction = await db.transaction(async (trx) => {
        // Step 1 — Find active match
        let user1Id = initiatorId;
        let user2Id = oppositeUserId;
        if (user2Id < user1Id) [user1Id, user2Id] = [user2Id, user1Id];

        const preparedFindExistingMatch = trx.query.match
          // .findFirst({
          //   where: (matchTable, { eq, and, or }) =>
          //     and(
          //       eq(matchTable.isActive, sql.placeholder('isActive')),
          //       or(
          //         eq(matchTable.user1Id, sql.placeholder('user1Id')),
          //         eq(matchTable.user2Id, sql.placeholder('user2Id')),
          //       ),
          //     ),
          // })
          .findFirst({
            where: (matchTable, { eq, and }) =>
              and(
                eq(matchTable.isActive, sql.placeholder('isActive')),
                eq(matchTable.user1Id, sql.placeholder('user1Id')),
                eq(matchTable.user2Id, sql.placeholder('user2Id')),
              ),
          })
          .prepare('findExistingMatch');

        const existingMatch = await preparedFindExistingMatch.execute({
          isActive: true,
          user1Id,
          user2Id,
        });

        if (!existingMatch) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'No active match with this user',
          });
        }

        // Validate mutual likes

        // Step-2 — Initiator liked at least one property owned by opposite
        const preparedFindMyLikesStatement = trx
          .select({ id: LikeTable.id })
          .from(LikeTable)
          .innerJoin(PropertyTable, eq(LikeTable.propertyId, PropertyTable.id))
          .where(
            and(
              eq(LikeTable.fromUserId, sql.placeholder('initiatorId')),
              eq(PropertyTable.authorId, sql.placeholder('oppositeUserId')),
            ),
          )
          .limit(1)
          .prepare('findMyLikesOnTheirProperty');
        const myLikeOnOppositeProperty =
          await preparedFindMyLikesStatement.execute({
            initiatorId,
            oppositeUserId,
          });

        if (!myLikeOnOppositeProperty.length) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `You have not liked any property of this user ${oppositeUserId}`,
          });
        }

        // Step-3 — Opposite User liked at least one property owned by initiator
        const preparedFindTheirLikesStatement = trx
          .select({ id: LikeTable.id })
          .from(LikeTable)
          .innerJoin(PropertyTable, eq(LikeTable.propertyId, PropertyTable.id))
          .where(
            and(
              eq(LikeTable.fromUserId, sql.placeholder('oppositeUserId')),
              eq(PropertyTable.authorId, sql.placeholder('initiatorId')),
            ),
          )
          .limit(1)
          .prepare('findTheirLikesOnMyProperty');
        const theirLikeOnInitiatorProperty =
          await preparedFindTheirLikesStatement.execute({
            oppositeUserId,
            initiatorId,
          });

        if (!theirLikeOnInitiatorProperty.length) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `This user ${oppositeUserId} has not liked any property of you`,
          });
        }

        // Step-4 — find the bookings done by me on oppo. user property/ies
        const preparedFindMyBookingsStatement = trx.query.bookings
          .findMany({
            where(bookingTable, { and, or, eq, ne }) {
              return and(
                eq(bookingTable.userId, sql.placeholder('initiatorId')),
                eq(bookingTable.status, sql.placeholder('status')),
              );
            },
            columns: {
              id: true,
              propertyId: true,
              userId: true,
              startDate: true,
              endDate: true,
              guestCount: true,
              status: true,
            },
            with: {
              property: {
                columns: {
                  id: true,
                  type: true,
                  isAvailable: true,
                  authorId: true,
                  streetAddress: true,
                  city: true,
                  state: true,
                  zipCode: true,
                },
              },
            },
            // extras: {
            //   totalBookingsCount: (table) =>
            //     trx.$count(table, eq(table.userId, initiatorId)),
            // },
          })
          .prepare('findMyBookingsOnPropertyByMe');
        const myBookingsOnOppositeProperty =
          await preparedFindMyBookingsStatement.execute({
            initiatorId,
            status: 'pending',
          });

        if (!myBookingsOnOppositeProperty.length) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `You have not booked any property of this user ${oppositeUserId}`,
          });
        }

        // Step-5 —  and return those data
        return myBookingsOnOppositeProperty;
      });

      return findTransaction;
    }),

  createSwap: protectedProcedure
    .input(createSwapSchema)
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx.auth;
      const {
        bookingId,
        startDate,
        endDate,
        guestCount,
        partnerId: oppositeUserId, // guaranteed to get here partner id
        partnerPropertyId, // guaranteed to get here partner property id
      } = input;
      const initiatorId = user.id;

      if (initiatorId === oppositeUserId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You cannot swap with yourself',
        });
      }

      // statement for faster execution
      const findOppositeUser = db.query.user
        .findFirst({
          where: (userTable, { eq }) => eq(userTable.id, oppositeUserId),
          columns: { name: true, firstName: true, lastName: true },
        })
        .prepare('findOppositeUser');
      const oppositeUser = await findOppositeUser.execute();

      if (!oppositeUser) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Opposite user not found',
        });
      }
      // console.log(input);

      // start transaction
      const committed = await db.transaction(async (trx) => {
        // Step 1 — Get the initiator's booking and validate
        const initiatorBooking = await trx.query.bookings.findFirst({
          where: (table, { eq, and }) =>
            and(
              eq(table.id, bookingId),
              eq(table.userId, initiatorId),
              eq(table.status, 'pending'),
            ),
          with: {
            property: true,
            match: true,
          },
        });
        // console.log({ initiatorBooking });

        if (!initiatorBooking) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid or not found booking',
          });
        }

        if (!initiatorBooking.match || !initiatorBooking.match.isActive) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'No active match for this booking',
          });
        }

        const activeMatch = initiatorBooking.match;

        // Verify that the opposite user is indeed part of this match
        const isOppositeInMatch =
          activeMatch.user1Id === oppositeUserId ||
          activeMatch.user2Id === oppositeUserId;

        if (!isOppositeInMatch) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'This user is not part of your active match',
          });
        }

        // Step 2 — Get the opposite user's property and validate
        const oppositeProperty = await trx.query.property.findFirst({
          where: (table, { eq, and }) =>
            and(
              eq(table.id, partnerPropertyId),
              eq(table.authorId, oppositeUserId),
              eq(table.isAvailable, true),
            ),
        });

        // console.log({ oppositeProperty });

        if (!oppositeProperty) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: "Opposite user's property not available",
          });
        }

        // Step 3 — Validate mutual likes
        const myLikeOnOppositeProperty = await trx
          .select({ id: LikeTable.id })
          .from(LikeTable)
          .innerJoin(PropertyTable, eq(LikeTable.propertyId, PropertyTable.id))
          .where(
            and(
              eq(LikeTable.fromUserId, initiatorId),
              eq(PropertyTable.authorId, oppositeUserId),
            ),
          )
          .limit(1);
        if (!myLikeOnOppositeProperty.length) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'You have not liked any property of this user',
          });
        }
        // console.log({ myLikeOnOppositeProperty });

        const theirLikeOnMyProperty = await trx
          .select({ id: LikeTable.id })
          .from(LikeTable)
          .innerJoin(PropertyTable, eq(LikeTable.propertyId, PropertyTable.id))
          .where(
            and(
              eq(LikeTable.fromUserId, oppositeUserId),
              eq(PropertyTable.authorId, initiatorId),
            ),
          )
          .limit(1);
        if (!theirLikeOnMyProperty.length) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'This user has not liked any of your properties',
          });
        }
        // console.log({ theirLikeOnMyProperty });

        // Step 4 — Check if opposite user has a pending booking on this match
        const oppositeBooking = await trx.query.bookings.findFirst({
          where: and(
            eq(BookingTable.userId, oppositeUserId),
            eq(BookingTable.matchId, activeMatch.id),
            eq(BookingTable.status, 'pending'),
          ),
        });
        // console.log({ oppositeBooking });

        if (!oppositeBooking) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Opposite user must have a pending booking on this match',
          });
        }

        // Step 5 — Get the two properties from the active match (since match already has user1 and user2 properties)
        const initiatorIsUser1 = activeMatch.user1Id === initiatorId;
        const initiatorPropertyId = initiatorIsUser1
          ? activeMatch.property1Id
          : activeMatch.property2Id;
        const partnerPropertyIdFromMatch = initiatorIsUser1
          ? activeMatch.property2Id
          : activeMatch.property1Id;

        // Validate that the provided partnerPropertyId matches the partner's property from the match
        if (partnerPropertyId !== partnerPropertyIdFromMatch) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid partner property ID for this match',
          });
        }

        // Normalize user and property IDs like in matches table
        let normalizedUser1Id = initiatorId;
        let normalizedUser2Id = oppositeUserId;
        let normalizedProperty1Id = initiatorPropertyId;
        let normalizedProperty2Id = partnerPropertyId;

        if (normalizedUser2Id < normalizedUser1Id) {
          [normalizedUser1Id, normalizedUser2Id] = [
            normalizedUser2Id,
            normalizedUser1Id,
          ];
          [normalizedProperty1Id, normalizedProperty2Id] = [
            normalizedProperty2Id,
            normalizedProperty1Id,
          ];
        }
        // console.log({
        //   normalizedUser1Id,
        //   normalizedUser2Id,
        //   normalizedProperty1Id,
        //   normalizedProperty2Id,
        // });

        // Step 6 — Check for existing swap for this match
        const existingSwap = await trx.query.SwapsTable.findFirst({
          where: (table, { eq }) => eq(table.matchId, activeMatch.id),
        });
        // console.log({ existingSwap });

        console.log('2nd user trap');
        if (existingSwap) {
          // If swap exists and is pending, check if current user is the other user to complete it
          if (existingSwap.status !== 'pending') {
            throw new TRPCError({
              code: 'CONFLICT',
              message: 'A swap already exists and is not pending',
            });
          }

          const isUser1 = existingSwap.user1Id === initiatorId;
          const isUser2 = existingSwap.user2Id === initiatorId;

          if (
            (isUser1 && existingSwap.user1Accepted) ||
            (isUser2 && existingSwap.user2Accepted)
          ) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'You have already initiated this swap',
            });
          }

          // Update the swap with current user's details and mark as completed
          const updateData: UpdateSwapValues = {};
          if (isUser1) {
            updateData.user1BookingId = bookingId;
            updateData.user1StartDate = startDate.toISOString();
            updateData.user1EndDate = endDate.toISOString();
            updateData.user1GuestCount = guestCount;
            // updateData.user1Accepted = true;
          } else if (isUser2) {
            updateData.user2BookingId = bookingId;
            updateData.user2StartDate = startDate.toISOString();
            updateData.user2EndDate = endDate.toISOString();
            updateData.user2GuestCount = guestCount;
            // updateData.user2Accepted = true;
          }

          // Both users have now initiated → status completed in both acceptance
          // updateData.status = "completed";

          const [updatedSwap] = await trx
            .update(SwapsTable)
            .set(updateData)
            .where(eq(SwapsTable.id, existingSwap.id))
            .returning();

          return {
            swap: updatedSwap,
            isNew: false,
            oppositeUser: oppositeUser,
            message: 'Swap completed successfully!',
          };
        }

        console.log('No Trap');
        // Step 7 — Insert the swap with initial status pending since it's the first user
        const [newSwap] = await trx
          .insert(SwapsTable)
          .values({
            user1Id: normalizedUser1Id,
            user2Id: normalizedUser2Id,
            matchId: activeMatch.id,
            property1Id: normalizedProperty1Id,
            property2Id: normalizedProperty2Id,
            ...(initiatorId === normalizedUser1Id
              ? {
                  user1BookingId: bookingId,
                  user1StartDate: startDate.toISOString(),
                  user1EndDate: endDate.toISOString(),
                  user1GuestCount: guestCount,
                  // user1Accepted: true,
                  // user2Accepted: false,
                }
              : {
                  user2BookingId: bookingId,
                  user2StartDate: startDate.toISOString(),
                  user2EndDate: endDate.toISOString(),
                  user2GuestCount: guestCount,
                  // user2Accepted: true,
                  // user1Accepted: false,
                }),
            status: 'pending',
          })
          .returning();

        return {
          swap: newSwap,
          isNew: true,
          oppositeUser: oppositeUser,
          message: 'Swap initiated successfully! Waiting for the other user.',
        };
      }); // end transaction

      // execute the notification
      const WORKFLOW_ID: WorkflowTypes = 'incoming-swap-request';
      if (committed.isNew === true) {
        // send the notification to the first user, who is first trigger this fn
        // who is initiate first that data is available here
        const firstName = user.firstName || user.name.split(' ')[0];
        const lastName = user.lastName || user.name.split(' ')[1] || '';
        const novuPayload = {
          workflowType: WORKFLOW_ID,
          swapRequest: {
            initiatorId: initiatorId,
            userFirstName: firstName,
            userLastName: lastName,
            userEmail: user.email,
            userContactNumber: user.contactNumber,
            oppositeUserName: committed.oppositeUser.name,
            swapId: committed.swap.id,
            initiatorBookingId: bookingId,
          },
        };
        await sendInAppNotification({ payload: novuPayload });
      } else {
        // when isNew is "FALSE" then we can assume opposite side user also trigger this fn,
        // so we can send the notification to him/her
        const firstName = user.firstName || user.name.split(' ')[0];
        const lastName = user.lastName || user.name.split(' ')[1] || '';
        const novuPayload = {
          workflowType: WORKFLOW_ID,
          swapRequest: {
            initiatorId: initiatorId,
            userFirstName: firstName,
            userLastName: lastName,
            userEmail: user.email,
            userContactNumber: user.contactNumber,
            oppositeUserName: committed.oppositeUser.name,
            swapId: committed.swap.id,
            initiatorBookingId: bookingId,
          },
        };
        await sendInAppNotification({ payload: novuPayload });
      }

      return committed;
    }),

  getSwap: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx.auth;

    const currentUserId = user.id;

    const whereStatement: DBQueryConfig<'many'>['where'] = (
      table,
      { eq, and, or },
    ) =>
      and(
        or(
          eq(table.user1Id, sql.placeholder('currentUserId')),
          eq(table.user2Id, sql.placeholder('currentUserId')),
        ),
        // eq(table.status, sql.placeholder('status')),
        // eq(table.status, "completed"), // need to check return data
      );

    const preparedExistingSwapDetailsStatement = db.query.SwapsTable.findFirst({
      where: whereStatement,
      orderBy: (table, { desc }) => [desc(table.updatedAt)],
      with: {
        user1: true,
        user2: true,
      },
    }).prepare('FindExistingSwapDetails');

    const existingSwapDetails =
      await preparedExistingSwapDetailsStatement.execute({
        currentUserId,
        // status: 'pending',
      });
    if (!existingSwapDetails) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Swap not found' });
    }

    // find the booking ID of current user
    const foundBookingId =
      currentUserId === existingSwapDetails?.user1Id
        ? existingSwapDetails?.user1BookingId
        : existingSwapDetails?.user2BookingId;

    if (!foundBookingId) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Booking ID not found',
      });
    }

    if (!existingSwapDetails?.user1 || !existingSwapDetails?.user2) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User Record not found',
      });
    }

    return {
      swapId: existingSwapDetails.id,
      bookingId: foundBookingId,
      user1Id: existingSwapDetails.user1.id,
      user2Id: existingSwapDetails.user2.id,
      status: existingSwapDetails.status,
    };
  }),

  acceptSwap: protectedProcedure
    .input(acceptSwapSchema)
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx.auth;

      const updatedSwap = await db.transaction(async (trx) => {
        const existingSwap = await trx.query.SwapsTable.findFirst({
          where: (table, { eq }) => eq(table.id, input.swapId),
        });

        if (!existingSwap) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Swap not found' });
        }

        // Ensure user is part of the swap
        const isUserInSwap =
          existingSwap.user1Id === user.id || existingSwap.user2Id === user.id;
        if (!isUserInSwap) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You are not part of this swap',
          });
        }

        if (existingSwap.status !== 'pending') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Swap is not pending',
          });
        }

        // Check which user is accepting and if they already submitted their details
        const isUser1 = existingSwap.user1Id === user.id;
        const isUser2 = existingSwap.user2Id === user.id;

        // Get the user's booking and validate
        const userBooking = await trx.query.bookings.findFirst({
          where: (table, { eq, and }) =>
            and(
              eq(table.id, input.bookingId),
              eq(table.userId, user.id),
              eq(table.status, 'pending'),
              eq(table.matchId, existingSwap.matchId!),
            ),
        });

        if (!userBooking) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid or not found booking',
          });
        }

        // Update existingSwap with user's booking details and accepted flag
        const updateData: UpdateAcceptValues = {};
        if (isUser1) {
          if (existingSwap.user1Accepted) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'You have already accepted this swap',
            });
          }
          updateData.user1BookingId = input.bookingId;
          updateData.user1Accepted = true;
        } else if (isUser2) {
          if (existingSwap.user2Accepted) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'You have already accepted this swap',
            });
          }
          updateData.user2BookingId = input.bookingId;
          updateData.user2Accepted = true;
        }

        // Check if both users have accepted → change status to completed
        const willBeBothAccepted = isUser1
          ? existingSwap.user2Accepted
          : existingSwap.user1Accepted;

        if (willBeBothAccepted) {
          updateData.status = 'completed';
        }

        const [updated] = await trx
          .update(SwapsTable)
          .set(updateData)
          .where(eq(SwapsTable.id, input.swapId))
          .returning();

        if (willBeBothAccepted && updateData.status === 'completed') {
          const user1BookingId =
            updated.user1BookingId ?? existingSwap.user1BookingId;
          const user2BookingId =
            updated.user2BookingId ?? existingSwap.user2BookingId;

          const updatePropertyStatement = trx
            .update(PropertyTable)
            .set({ isAvailable: false })
            .where(eq(PropertyTable.id, sql.placeholder('id')));

          const updateUser1BookingStatement = trx
            .update(BookingTable)
            .set({ status: 'confirmed' })
            .where(eq(BookingTable.id, sql.placeholder('id')));

          const updateUser2BookingStatement = trx
            .update(BookingTable)
            .set({ status: 'confirmed' })
            .where(eq(BookingTable.id, sql.placeholder('id')));

          const updateMatchStatement = trx
            .update(MatchTable)
            .set({ isActive: false })
            .where(eq(MatchTable.id, sql.placeholder('id')));

          // parrallel updates
          await Promise.all([
            updatePropertyStatement.execute({ id: existingSwap.property1Id }),
            updatePropertyStatement.execute({ id: existingSwap.property2Id }),
            updateUser1BookingStatement.execute({ id: user1BookingId }),
            updateUser2BookingStatement.execute({ id: user2BookingId }),
            updateMatchStatement.execute({
              id: existingSwap.matchId,
            }),
          ]);
        }

        return updated;
      });

      return updatedSwap;
    }),

  rejectSwap: protectedProcedure
    .input(rejectSwapSchema)
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx.auth;

      const swapId = input.swapId; // swap id to reject

      // criteria:
      // make both property.isAvailable=true, and swap.status to "rejected"
      // this swap.user1_booking_id && swap.user2_booking_id find make the two bookings status will be "cancelled"

      const [updatedSwap] = await db.transaction(async (trx) => {
        const existingSwap = await trx.query.SwapsTable.findFirst({
          where: (table, { eq }) => eq(table.id, swapId),
        });

        if (!existingSwap) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Swap not found' });
        }

        // Ensure user is user2 (the one who can reject)
        if (existingSwap.user2Id !== user.id) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You cannot reject this swap',
          });
        }

        if (existingSwap.status !== 'pending') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Swap is not pending',
          });
        }
        if (!existingSwap.user1BookingId || !existingSwap.user2BookingId) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: "User1 or User2 Booking ID's not found in swap",
          });
        }

        if (!existingSwap.property1Id || !existingSwap.property2Id) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: "Property ID's not found in swap",
          });
        }

        if (!existingSwap.user1BookingId || !existingSwap.user2BookingId) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: "User1 or User2 Booking ID's not found in swap",
          });
        }

        /**
         * Flag updation
         * Swap Table, Bookings Table, Property Table
         */

        // 1. Swap Table row update
        const [updated] = await trx
          .update(SwapsTable)
          .set({ status: 'rejected' })
          .where(eq(SwapsTable.id, input.swapId))
          .returning();

        // make statements for faster query
        const updatePropertyStatement = trx
          .update(PropertyTable)
          .set({ isAvailable: true })
          .where(eq(PropertyTable.id, sql.placeholder('id')));

        const updateUser1BookingStatement = trx
          .update(BookingTable)
          .set({ status: 'cancelled' })
          .where(eq(BookingTable.id, sql.placeholder('id')));

        const updateUser2BookingStatement = trx
          .update(BookingTable)
          .set({ status: 'cancelled' })
          .where(eq(BookingTable.id, sql.placeholder('id')));

        // parrallel updates
        await Promise.all([
          updatePropertyStatement.execute({ id: existingSwap.property1Id }),
          updatePropertyStatement.execute({ id: existingSwap.property2Id }),
          updateUser1BookingStatement.execute({
            id: existingSwap.user1BookingId,
          }),
          updateUser2BookingStatement.execute({
            id: existingSwap.user2BookingId,
          }),
        ]);

        return [updated];
      });

      return updatedSwap;
    }),
});
