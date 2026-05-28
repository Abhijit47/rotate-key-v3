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

export const bookingFormSchema = z
  .object({
    propertyId: z.uuid(),
    startDate: z.date(),
    endDate: z.date(),
    guestCount: z
      .string()
      .regex(/^[1-9]\d*$/, 'Please select at least 1 guest'),
  })
  .superRefine((value, ctx) => {
    const now = new Date();
    if (value.startDate < now) {
      ctx.addIssue({
        code: 'custom',
        path: ['startDate'],
        message: 'Start date must be in the future',
      });
    }
    if (value.endDate <= value.startDate) {
      ctx.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'End date must be after start date',
      });
    }
  });

export const updatedBookingStatusSchema = z.object({
  bookingId: z.uuid(),
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
