// This many(property) relation requires importing property into auth.ts, which creates a circular module dependency with property.ts (which imports user). This can break schema initialization at runtime. Prefer defining relations in a separate relations.ts (or similar) module that imports both tables, or otherwise avoid the mutual import.

// property.ts imports user from ./auth, while auth.ts now imports property for userRelations, creating a circular dependency. Because pgTable(...) is evaluated at module load time, this can cause one side to be uninitialized (undefined) and crash during schema setup. Break the cycle by moving relations into a separate module that imports both tables after they’re defined.

import { relations } from 'drizzle-orm';
import { account, session, user } from './auth';
import { property } from './property';

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  properties: many(property),
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

export const propertyRelations = relations(property, ({ one }) => ({
  author: one(user, {
    fields: [property.authorId],
    references: [user.id],
  }),
}));
