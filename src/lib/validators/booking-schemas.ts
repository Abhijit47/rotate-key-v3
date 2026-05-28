/*
DATABASE REQUIRED this format // 2026-05-28 03:31:05.13077
startDate: timestamp('start_date', {
      mode: 'string',
      withTimezone: true,
    }).notNull(),
    endDate: timestamp('end_date', {
      mode: 'string',
      withTimezone: true,
    }).notNull(),
*/

import z from 'zod';

export const stringToDate = z.codec(
  z.iso.datetime(), // input schema: ISO date string
  z.date(), // output schema: Date object
  {
    decode: (isoString) => new Date(isoString), // ISO string → Date
    encode: (date) => date.toISOString(), // Date → ISO string
  },
);

export const bookingFormSchema = z.object({
  propertyId: z.string(),
  startDate: z.date().min(new Date(), { error: 'Too old!' }),
  endDate: z.date().min(new Date(), { error: 'Too young!' }),
  guestCount: z.string().min(1, 'Guests is required'),
  // startDate: stringToDate,
  // endDate: stringToDate,
  // guestCount: z.string().min(1, 'Guests is required'),
});

export const updatedBookingStatusSchema = z.object({
  bookingId: z.string(),
  status: z.enum(['pending', 'confirmed', 'cancelled']),
});

const bookingId = z.string();

export const bookingIdSchema = z.object({
  bookingId,
});

export const deleteBookingSchema = z.object({
  bookingId: bookingId,
});

export type BookingValues = z.infer<typeof bookingFormSchema>;
export type UpdatedBookingStatusValues = z.infer<
  typeof updatedBookingStatusSchema
>;
export type DeleteBookingValue = z.infer<typeof deleteBookingSchema>;
