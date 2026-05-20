import {
  index,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import { user } from './auth';
import { match } from './match';
import { property } from './property';

export const bookingStatus = pgEnum('booking_status', [
  'pending',
  'confirmed',
  'cancelled',
]);

// ===============================
// Booking Table
// ===============================
export const bookings = pgTable(
  'bookings',
  {
    id: uuid('id').primaryKey().unique().defaultRandom().notNull(),
    // which property want to book
    propertyId: uuid('property_id')
      .notNull()
      .references(() => property.id, { onDelete: 'cascade' }),
    // who made this booking that userId
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    startDate: timestamp('start_date', {
      mode: 'string',
      withTimezone: true,
    }).notNull(),
    endDate: timestamp('end_date', {
      mode: 'string',
      withTimezone: true,
    }).notNull(),
    guestCount: varchar('guest_count').notNull(),

    matchId: uuid('match_id')
      .notNull()
      .references(() => match.id, { onDelete: 'cascade' }),

    status: bookingStatus('status').default('pending').notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (t) => [
    index('idx_bookings_user').on(t.userId),
    index('idx_bookings_property').on(t.propertyId),
    index('idx_bookings_match').on(t.matchId),
  ],
);

export type InsertBooking = typeof bookings.$inferInsert;
export type SelectBooking = typeof bookings.$inferSelect;
