import {
  index,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

import { user } from './auth';
import { property } from './property';

// ===============================
// Likes Table
// ===============================
export const like = pgTable(
  'likes',
  {
    id: uuid('id').primaryKey().unique().defaultRandom().notNull(),
    fromUserId: uuid('from_user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    // toUserId: text('to_user_id')
    //   .notNull()
    //   .references(() => users.id, { onDelete: 'cascade' }),
    propertyId: uuid('property_id')
      .notNull()
      .references(() => property.id, { onDelete: 'cascade' }),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (t) => [
    uniqueIndex('likes_unique').on(t.fromUserId, t.propertyId),
    index('idx_likes_from_user').on(t.fromUserId),
    // index('idx_likes_to_user').on(t.toUserId),
    index('idx_likes_property').on(t.propertyId),
    index('idx_likes_created_at').on(t.createdAt),
  ],
);

export type InsertLike = typeof like.$inferInsert;
export type SelectLike = typeof like.$inferSelect;
