import {
  index,
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { user } from "./auth";
import { match } from "./match";
import { property } from "./property";
import { bookings } from "./booking";

export const swapStatusEnum = pgEnum("status", [
  "pending", // user2 when sent a swap req to user2 and user2 will accept
  "completed", // user 2 when sent a swap req. to user1 and user1 will accpet
  "rejected", // user 1 or user 2 can reject the swap

  // only by admin role
  "approved", // Both users have accepted, waiting for admin
  "declined", // Either user or admin has declined, contract was not happened some complicated reason
]);

export const SwapsTable = pgTable(
  "swaps",
  {
    id: uuid("id").primaryKey().unique().defaultRandom().notNull(),
    // who was the first user to request the swap
    user1Id: uuid("user1_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade",
      }),
    // who was the second user to request the swap
    user2Id: uuid("user2_id")
      .notNull()
      .references(() => user.id, {
        onDelete: "cascade",
      }),
    // matchId related two this two users
    matchId: uuid("match_id")
      .notNull()
      .references(() => match.id, {
        onDelete: "cascade",
      }),
    property1Id: uuid("property1_id")
      .notNull()
      .references(() => property.id, {
        onDelete: "cascade",
      }), // offered by user1
    property2Id: uuid("property2_id")
      .notNull()
      .references(() => property.id, {
        onDelete: "cascade",
      }), // offered by user2

    // can be null, until fills the details
    // Store the original booking details that user1 wants to swap
    user1BookingId: uuid("user1_booking_id").references(() => bookings.id, {
      onDelete: "cascade",
    }),
    user1StartDate: timestamp("user1_start_date", {
      mode: "string",
      withTimezone: true,
    }),
    user1EndDate: timestamp("user1_end_date", {
      mode: "string",
      withTimezone: true,
    }),
    user1GuestCount: varchar("user1_guest_count"),

    // can be null, until fills the details
    // Store the original booking details that user2 wants to swap
    user2BookingId: uuid("user2_booking_id").references(() => bookings.id, {
      onDelete: "cascade",
    }),
    user2StartDate: timestamp("user2_start_date", {
      mode: "string",
      withTimezone: true,
    }),
    user2EndDate: timestamp("user2_end_date", {
      mode: "string",
      withTimezone: true,
    }),
    user2GuestCount: varchar("user2_guest_count"),

    user1Accepted: boolean("user1_accepted").notNull().default(false),
    user2Accepted: boolean("user2_accepted").notNull().default(false),

    status: swapStatusEnum().notNull().default("pending"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (t) => [
    index("idx_swaps_property1").on(t.property1Id),
    index("idx_swaps_property2").on(t.property2Id),
    index("idx_swaps_user1").on(t.user1Id),
    index("idx_swaps_user2").on(t.user2Id),
    index("idx_swaps_match").on(t.matchId),
    index("idx_swaps_status").on(t.status),

    uniqueIndex("uniq_swap").on(t.matchId),

    // Enforce unique pending/active swap per match and property pair
    uniqueIndex("uniq_swap_per_match_properties").on(
      sql`LEAST(${t.property1Id}, ${t.property2Id})`,
      sql`GREATEST(${t.property1Id}, ${t.property2Id})`,
      t.matchId,
    ),
    // Also enforce unique user pair per match with sorted order (like matches)
    uniqueIndex("uniq_swap_per_match_users").on(
      sql`LEAST(${t.user1Id}, ${t.user2Id})`,
      sql`GREATEST(${t.user1Id}, ${t.user2Id})`,
      t.matchId,
    ),
  ],
);

export type InsertSwap = typeof SwapsTable.$inferInsert;
export type SelectSwap = typeof SwapsTable.$inferSelect;
