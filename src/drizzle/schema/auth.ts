import { plans, roles } from '@/constants/db-constants';
import { sql } from 'drizzle-orm';
import {
  boolean,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
// import { property } from './property';

export const rolesEnum = pgEnum('role', roles);
export const plansEnum = pgEnum('plan_slug', plans);
export const socialProvidersEnum = pgEnum('social_provider', [
  'facebook',
  'google',
]);

export const user = pgTable('user', {
  id: uuid('id')
    .default(sql`pg_catalog.gen_random_uuid()`)
    .primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image').default('/api/avatar?name=user').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: rolesEnum().default('user').notNull(),
  banned: boolean('banned').default(false),
  banReason: text('ban_reason'),
  banExpires: timestamp('ban_expires'),
  whereAreYouFrom: varchar('where_are_you_from'),
  whereDoYouWantToGo: varchar('where_do_you_want_to_go'),
  isSocialSignInComplete: boolean('is_social_sign_in_complete')
    .default(false)
    .notNull(),
  socialProvider: socialProvidersEnum('social_provider'),
  isOnboarded: boolean('is_onboarded').default(false).notNull(),
  chatToken: varchar('chat_token').default('n/a'),
  chatTokenExpireAt: timestamp('chat_token_expire_at'),
  chatTokenIssuedAt: timestamp('chat_token_issued_at'),
  isSubscribed: boolean('is_subscribed').default(false).notNull(),
  planSlug: plansEnum('plan_slug'),
  notificationHash: varchar('notification_hash'),
  firstName: varchar('first_name'),
  lastName: varchar('last_name'),
  spokenLanguages: varchar('spoken_languages').array().default([]),
  country: varchar('country'),
  aboutMe: varchar('about_me', { length: 500 }),
  yearOfBirth: varchar('year_of_birth'),
  contactNumber: varchar('contact_number'),
  isContactNumberVerified: boolean('is_contact_number_verified').default(false),
  profileVerificationDocument: varchar('profile_verification_document'),
});

export const session = pgTable(
  'session',
  {
    id: uuid('id')
      .default(sql`pg_catalog.gen_random_uuid()`)
      .primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    impersonatedBy: text('impersonated_by'),
  },
  (table) => [index('session_userId_idx').on(table.userId)],
);

export const account = pgTable(
  'account',
  {
    id: uuid('id')
      .default(sql`pg_catalog.gen_random_uuid()`)
      .primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index('account_userId_idx').on(table.userId)],
);

export const verification = pgTable(
  'verification',
  {
    id: uuid('id')
      .default(sql`pg_catalog.gen_random_uuid()`)
      .primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)],
);

// export const userRelations = relations(user, ({ many }) => ({
//   sessions: many(session),
//   accounts: many(account),
//   properties: many(property),
// }));

// export const sessionRelations = relations(session, ({ one }) => ({
//   user: one(user, {
//     fields: [session.userId],
//     references: [user.id],
//   }),
// }));

// export const accountRelations = relations(account, ({ one }) => ({
//   user: one(user, {
//     fields: [account.userId],
//     references: [user.id],
//   }),
// }));

export type InsertUser = typeof user.$inferInsert;
export type SelectUser = typeof user.$inferSelect;

export type InsertSession = typeof session.$inferInsert;
export type SelectSession = typeof session.$inferSelect;

export type InsertAccount = typeof account.$inferInsert;
export type SelectAccount = typeof account.$inferSelect;

export type InsertVerification = typeof verification.$inferInsert;
export type SelectVerification = typeof verification.$inferSelect;
