// ⚠️⚠️⚠️ dont scan or check this file its a playground will be delete soon

import { db } from "@/drizzle/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";

import { InsertSwap, SwapsTable } from "@/drizzle/schema/swap";
import { bookings as BookingTable } from "@/drizzle/schema/booking";
import { property as PropertyTable } from "@/drizzle/schema";
import { like as LikeTable } from "@/drizzle/schema/like";
import { and, eq } from "drizzle-orm";

const createSwapSchema = z.object({
  bookingId: z.string().nonempty("Booking ID is required"),
  startDate: z.date(),
  endDate: z.date(),
  guestCount: z.string(),
  partnerId: z.string().nonempty("Partner ID is required"),
  partnerPropertyId: z.string().nonempty("Property ID is required"),
});

// const acceptSwapSchema = z.object({
//   swapId: z.string(),
//   bookingId: z.string().nonempty("Booking ID is required"),
//   startDate: z.date(),
//   endDate: z.date(),
//   guestCount: z.string(),
// });

export const swapRouter = createTRPCRouter({
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
          code: "BAD_REQUEST",
          message: "You cannot swap with yourself",
        });
      }

      console.log(input);

      const committed = await db.transaction(async (trx) => {
        // Step 1 — Get the initiator's booking and validate
        const initiatorBooking = await trx.query.bookings.findFirst({
          where: (table, { eq, and }) =>
            and(
              eq(table.id, bookingId),
              eq(table.userId, initiatorId),
              eq(table.status, "pending"),
            ),
          with: {
            property: true,
            match: true,
          },
        });
        console.log({ initiatorBooking });

        if (!initiatorBooking) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid or not found booking",
          });
        }

        if (!initiatorBooking.match || !initiatorBooking.match.isActive) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "No active match for this booking",
          });
        }

        const activeMatch = initiatorBooking.match;

        // Verify that the opposite user is indeed part of this match
        const isOppositeInMatch =
          activeMatch.user1Id === oppositeUserId ||
          activeMatch.user2Id === oppositeUserId;

        if (!isOppositeInMatch) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "This user is not part of your active match",
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

        console.log({ oppositeProperty });

        if (!oppositeProperty) {
          throw new TRPCError({
            code: "BAD_REQUEST",
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
            code: "BAD_REQUEST",
            message: "You have not liked any property of this user",
          });
        }
        console.log({ myLikeOnOppositeProperty });

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
            code: "BAD_REQUEST",
            message: "This user has not liked any of your properties",
          });
        }
        console.log({ theirLikeOnMyProperty });

        // Step 4 — Check if opposite user has a pending booking on this match
        const oppositeBooking = await trx.query.bookings.findFirst({
          where: and(
            eq(BookingTable.userId, oppositeUserId),
            eq(BookingTable.matchId, activeMatch.id),
            eq(BookingTable.status, "pending"),
          ),
        });
        console.log({ oppositeBooking });

        if (!oppositeBooking) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Opposite user must have a pending booking on this match",
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
            code: "BAD_REQUEST",
            message: "Invalid partner property ID for this match",
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
        console.log({
          normalizedUser1Id,
          normalizedUser2Id,
          normalizedProperty1Id,
          normalizedProperty2Id,
        });

        // Step 6 — Check for existing swap for this match
        const existingSwap = await trx.query.SwapsTable.findFirst({
          where: (table, { eq }) => eq(table.matchId, activeMatch.id),
        });
        console.log({ existingSwap });

        console.log("2nd user trap");
        if (existingSwap) {
          // If swap exists and is pending, check if current user is the other user to complete it
          if (existingSwap.status !== "pending") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "A swap already exists and is not pending",
            });
          }

          const isUser1 = existingSwap.user1Id === initiatorId;
          const isUser2 = existingSwap.user2Id === initiatorId;

          if (
            (isUser1 && existingSwap.user1Accepted) ||
            (isUser2 && existingSwap.user2Accepted)
          ) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "You have already initiated this swap",
            });
          }

          // Update the swap with current user's details and mark as completed
          const updateData: InsertSwap = {};
          if (isUser1) {
            updateData.user1BookingId = bookingId;
            updateData.user1StartDate = startDate.toISOString();
            updateData.user1EndDate = endDate.toISOString();
            updateData.user1GuestCount = guestCount;
            updateData.user1Accepted = true;
          } else if (isUser2) {
            updateData.user2BookingId = bookingId;
            updateData.user2StartDate = startDate.toISOString();
            updateData.user2EndDate = endDate.toISOString();
            updateData.user2GuestCount = guestCount;
            updateData.user2Accepted = true;
          }

          // Both users have now initiated → status completed
          updateData.status = "completed";

          const [updatedSwap] = await trx
            .update(SwapsTable)
            .set(updateData)
            .where(eq(SwapsTable.id, existingSwap.id))
            .returning();

          return {
            swap: updatedSwap,
            isNew: false,
            message: "Swap completed successfully!",
          };
        }

        console.log("No Trap");
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
                  user1Accepted: true,
                  user2Accepted: false,
                }
              : {
                  user2BookingId: bookingId,
                  user2StartDate: startDate.toISOString(),
                  user2EndDate: endDate.toISOString(),
                  user2GuestCount: guestCount,
                  user2Accepted: true,
                  user1Accepted: false,
                }),
            status: "pending",
          })
          .returning();

        return {
          swap: newSwap,
          isNew: true,
          message: "Swap initiated successfully! Waiting for the other user.",
        };
      });

      return committed;
    }),
});
