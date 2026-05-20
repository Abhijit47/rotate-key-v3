// This many(property) relation requires importing property into auth.ts, which creates a circular module dependency with property.ts (which imports user). This can break schema initialization at runtime. Prefer defining relations in a separate relations.ts (or similar) module that imports both tables, or otherwise avoid the mutual import.

// property.ts imports user from ./auth, while auth.ts now imports property for userRelations, creating a circular dependency. Because pgTable(...) is evaluated at module load time, this can cause one side to be uninitialized (undefined) and crash during schema setup. Break the cycle by moving relations into a separate module that imports both tables after they’re defined.

import { relations } from 'drizzle-orm';
import { account, session, user } from './auth';
import { bookings } from './booking';
import { like } from './like';
import { match } from './match';
import { property } from './property';

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  properties: many(property),
  user1Matches: many(match, { relationName: 'user1Match' }),
  user2Matches: many(match, { relationName: 'user2Match' }),
  bookings: many(bookings, { relationName: 'userBookings' }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const propertyRelations = relations(property, ({ one, many }) => ({
  author: one(user, {
    fields: [property.authorId],
    references: [user.id],
  }),
  bookings: one(bookings, {
    fields: [property.id],
    references: [bookings.propertyId],
  }),
  // All likes received by this property
  receivedLikes: many(like, { relationName: 'property' }),
}));

export const matchRelations = relations(match, ({ one }) => ({
  user1: one(user, {
    fields: [match.user1Id],
    references: [user.id],
    relationName: 'user1Match', // optional, but can be helpful for clarity
  }),
  user2: one(user, {
    fields: [match.user2Id],
    references: [user.id],
    relationName: 'user2Match', // optional, but can be helpful for clarity
  }),
  property1: one(property, {
    fields: [match.property1Id],
    references: [property.id],
    relationName: 'property1match',
  }),
  property2: one(property, {
    fields: [match.property2Id],
    references: [property.id],
    relationName: 'property2match',
  }),
  bookings: one(bookings, {
    fields: [match.id],
    references: [bookings.matchId],
  }),
}));

export const bookingRelations = relations(bookings, ({ one }) => ({
  user: one(user, {
    fields: [bookings.userId],
    references: [user.id],
    relationName: 'userBookings', // optional, but can be helpful for clarity
  }),
  property: one(property, {
    fields: [bookings.propertyId],
    references: [property.id],
  }),
  match: one(match, {
    fields: [bookings.matchId],
    references: [match.id],
  }),
}));

// Likes relations: many-to-one for users
export const likesRelations = relations(like, ({ one }) => ({
  fromUser: one(user, {
    fields: [like.fromUserId],
    references: [user.id],
    relationName: 'fromUser',
  }),
  // toUser: one(users, {
  //   fields: [likes.toUserId],
  //   references: [users.id],
  //   relationName: 'toUser',
  // }),
  property: one(property, {
    fields: [like.propertyId],
    references: [property.id],
    relationName: 'property',
  }),
}));
