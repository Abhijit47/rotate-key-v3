import { relations } from 'drizzle-orm';
import { jsonb, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { user } from './auth';

export const property = pgTable('property', {
  id: uuid('id').defaultRandom().primaryKey().unique().notNull(),
  type: varchar('type').notNull(),
  streetAddress: varchar('street_address').notNull(),
  city: varchar('city'),
  state: varchar('state'),
  zipCode: varchar('zip_code'),
  images: jsonb('images').$type<string[]>().notNull(),
  amenities: jsonb('amenities').$type<string[]>().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),

  authorId: uuid('author_id')
    .references(() => user.id)
    .notNull(),
});

export const propertyRelations = relations(property, ({ one }) => ({
  author: one(user, {
    fields: [property.authorId],
    references: [user.id],
  }),
}));

export type InsertProperty = typeof property.$inferSelect;
export type SelectProperty = typeof property.$inferSelect;
