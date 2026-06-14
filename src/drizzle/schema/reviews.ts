import {
  index,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
  boolean,
  smallint,
} from 'drizzle-orm/pg-core';

import { user } from './auth';

export const ReviewTable = pgTable(
  'reviews',
  {
    id: uuid('id').primaryKey().unique().defaultRandom().notNull(),
    fullName: varchar('full_name').notNull(),
    email: varchar('email').notNull(),
    propertyCondition: smallint('property_condition').notNull(),
    communicationWithOwner: smallint('communication_with_owner').notNull(),
    locationAccessibility: smallint('location_accessibility').notNull(),
    amenitiesFacilities: smallint('amenities_facilities').notNull(),
    overallExperience: smallint('overall_experience').notNull(),
    reason: varchar('reason', { length: 2048 }).notNull(),
    userId: uuid('user_id')
      .references(() => user.id)
      .notNull(),
    isPublic: boolean('is_public').notNull().default(false), // admin can set this to true after review
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (t) => [
    index('idx_reviews_user_id').on(t.userId),
    index('idx_reviews_full_name').on(t.fullName),
    index('idx_reviews_email').on(t.email),
  ],
);

export type InsertReview = typeof ReviewTable.$inferInsert;
export type SelectReview = typeof ReviewTable.$inferSelect;
