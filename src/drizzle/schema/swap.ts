import {
  index,
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { user } from './auth';
import { match } from './match';
import { property } from './property';

export const swapStatusEnum = pgEnum('status', [
  'pending',
  'approved', // this will perform by admin only
  'declined',
  'completed',
]);

export const SwapsTable = pgTable(
  'swaps',
  {
    id: uuid('id').primaryKey().unique().defaultRandom().notNull(),
    // who was the first user to request the swap
    user1Id: uuid('user1_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    // who was the second user to request the swap
    user2Id: uuid('user2_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    // matchId related two this two users
    matchId: uuid('match_id')
      .notNull()
      .references(() => match.id, { onDelete: 'cascade' }),
    property1Id: uuid('property1_id')
      .notNull()
      .references(() => property.id, { onDelete: 'cascade' }), // offered by user1
    property2Id: uuid('property2_id')
      .notNull()
      .references(() => property.id, { onDelete: 'cascade' }), // offered by user2
    status: swapStatusEnum().notNull().default('pending'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (t) => [
    index('idx_swaps_property1').on(t.property1Id),
    index('idx_swaps_property2').on(t.property2Id),
    index('idx_swaps_user1').on(t.user1Id),
    index('idx_swaps_user2').on(t.user2Id),
    index('idx_swaps_match').on(t.matchId),
    index('idx_swaps_status').on(t.status),
    // 💡 This enforces there’s only one *active* (pending/completed/approved etc.) swap per pair
    uniqueIndex('uniq_swap_pure').on(
      t.user1Id,
      t.user2Id,
      t.property1Id,
      t.property2Id,
      t.matchId,
    ),
  ],
);
