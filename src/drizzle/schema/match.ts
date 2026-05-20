import { sql } from 'drizzle-orm';
import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

import { user } from './auth';
import { property } from './property';

export const match = pgTable(
  'matches',
  {
    id: uuid('id').primaryKey().unique().defaultRandom().notNull(),
    user1Id: uuid('user1_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    user2Id: uuid('user2_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),

    property1Id: uuid('property1_id')
      .notNull()
      .references(() => property.id, { onDelete: 'cascade' }),
    property2Id: uuid('property2_id')
      .notNull()
      .references(() => property.id, { onDelete: 'cascade' }),

    isActive: boolean('is_active').notNull().default(false),

    channelId: varchar('channel_id'),
    channelType: text('channel_type').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (t) => [
    uniqueIndex('matches_unique').on(
      sql`LEAST(${t.user1Id}, ${t.user2Id})`,
      sql`GREATEST(${t.user1Id}, ${t.user2Id})`,
    ),
    index('idx_matches_user1').on(t.user1Id),
    index('idx_matches_user2').on(t.user2Id),
    index('idx_matches_created_at').on(t.createdAt),
  ],
);

export type InsertMatch = typeof match.$inferInsert;
export type SelectMatch = typeof match.$inferSelect;
