import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';

import { db } from '@/drizzle/db';
import {
  bookings as BookingTable,
  match as MatchTable,
  property as PropertyTable,
} from '@/drizzle/schema';
import {
  bookingFormSchema,
  bookingIdSchema,
  deleteBookingSchema,
  updatedBookingStatusSchema,
} from '@/lib/validators/booking-schemas';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';

export const bookingRouter = createTRPCRouter({
  createBooking: protectedProcedure
    .input(bookingFormSchema)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.auth;
      const { propertyId, startDate, endDate, guestCount } = input;

      /**
       * steps:
       * with propertyId, get the property with author,
       * check if the property is available, if not throw error
       * if available, then check property author with current user have any match or not, if not match, throw error
       * if have match, then create booking with pending status
       */

      try {
        const commitBooking = await db.transaction(async (trx) => {
          const propertyWithAuthor = await trx.query.property.findFirst({
            where: eq(PropertyTable.id, propertyId),
            with: {
              author: {
                columns: {
                  id: true,
                  name: true,
                },
              },
            },
          });
          if (!propertyWithAuthor) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'Property not found',
            });
          }
          if (!propertyWithAuthor.isAvailable) {
            throw new TRPCError({
              code: 'FORBIDDEN',
              message: 'Property is not available for booking',
            });
          }

          const ownerId = propertyWithAuthor.authorId;

          // check if have match or not
          let user1Id = user.id,
            user2Id = ownerId;

          if (user2Id < user1Id) {
            [user1Id, user2Id] = [user2Id, user1Id];
          }

          const match = await trx.query.match.findFirst({
            where: and(
              eq(MatchTable.user1Id, user1Id),
              eq(MatchTable.user2Id, user2Id),
              eq(MatchTable.isActive, true),
            ),
          });
          if (!match) {
            throw new TRPCError({
              code: 'FORBIDDEN',
              message:
                'You can only book properties of users you have matched with.',
            });
          }

          const [newBooking] = await trx
            .insert(BookingTable)
            .values({
              propertyId,
              userId: user.id,
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
              guestCount,
              matchId: match.id,
              status: 'pending',
            })
            .returning();
          if (!newBooking) {
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'Failed to create booking.',
            });
          }

          return newBooking;
        });

        return commitBooking;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('Error booking property:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while booking the property.',
        });
      }
    }),

  getBookings: protectedProcedure.query(async ({ ctx, input }) => {
    const { user } = ctx.auth;

    // TODO: Permission will update later
    const bookings = await db.query.bookings.findMany({
      with: {
        property: true,
      },
    });
    return bookings;
  }),

  getBooking: protectedProcedure
    .input(bookingIdSchema)
    .query(async ({ ctx, input }) => {
      const { user } = ctx.auth;
      const { bookingId } = input;

      // TODO: Permission will update later
      const booking = await db.query.bookings.findFirst({
        with: {
          property: true,
        },
      });
      if (!booking) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Booking not found',
        });
      }
      return booking;
    }),

  updateBookingStatus: protectedProcedure
    .input(updatedBookingStatusSchema)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.auth;
      const { bookingId, status } = input;

      try {
        // get the booking with property and author
        const bookingWithProperty = await db.query.bookings.findFirst({
          where: eq(BookingTable.id, bookingId),
        });
        if (!bookingWithProperty) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Booking not found',
          });
        }

        // only admin can update the booking status
        if (user.role !== 'admin') {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message:
              'You do not have permission to update this booking status.',
          });
        }
        const [updatedBooking] = await db
          .update(BookingTable)
          .set({ status })
          .where(eq(BookingTable.id, bookingId))
          .returning();
        if (!updatedBooking) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Failed to update booking status.',
          });
        }
        return updatedBooking;
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('Error updating booking status:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while updating the booking status.',
        });
      }
    }),

  deleteBooking: protectedProcedure
    .input(deleteBookingSchema)
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.auth;
      const { bookingId } = input;

      try {
        // get the booking with property and role=== admin
        const bookingWithProperty = await db.query.bookings.findFirst({
          where: eq(BookingTable.id, bookingId),
          with: {
            property: {
              columns: {
                authorId: true,
              },
            },
          },
        });
        if (!bookingWithProperty) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Booking not found',
          });
        }

        // only admin can delete the booking
        if (user.role !== 'admin') {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to delete this booking.',
          });
        }

        const deleted = await db
          .delete(BookingTable)
          .where(eq(BookingTable.id, bookingId))
          .returning();
        if (deleted.length === 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Failed to delete booking.',
          });
        }
        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        console.error('Error deleting booking:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An error occurred while deleting the booking.',
        });
      }
    }),
});
