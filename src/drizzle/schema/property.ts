// import { relations } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { user } from './auth';

import {
  AccessibilitiesLateral,
  AmenitiesLateral,
  HostLanguageLateral,
  RulesLateral,
} from '@/constants/property-assets-types';

type LocationObj = {
  id: number;
  name: string;
  flag?: string | undefined;
  iso2?: string | undefined;
};

type DateRangeObj = {
  from: Date;
  to: Date;
};

export const areaUnitEnum = pgEnum('area_unit', [
  'sqft',
  'sqm',
  'acre',
  'hectare',
]);
export const roomTypeEnum = pgEnum('room_type', [
  'apartment',
  'house',
  'villa',
  'penthouse',
  'studio',
  'cottage',
  'townhouse',
  'duplex/triplex',
  'shared apartment',
  'co-living space',
  'guest house',
  'office space',
  'retail space',
  'warehouse/industrial space',
  'hotel/resort',
  'raw land',
  'construction-ready land',
  'multi-family home',
  'gated community property',
]);
export const ownershipEnum = pgEnum('ownership', [
  'freehold',
  'leasehold',
  'co-ownership',
  'timeshare ownership',
  'inherited property',
  'joint ownership',
  'corporate-owned',
  'rented property',
]);
export const swapingEnum = pgEnum('swaping', [
  'permanent swap',
  'temporary swap',
]);
export const rentPeriodEnum = pgEnum('rent_period', [
  'daily rental',
  'weekly rental',
  'monthly rental',
  '3-month lease',
  '6-month lease',
  '1-year lease (long-term)',
  '2-year lease',
  '5-year lease',
  '10+ year lease',
  '1-year lease (contractual)',
  'month-to-month lease',
]);
export const surroundingEnum = pgEnum('surrounding', [
  'mountain',
  'island',
  'hill station',
  'sea facing / coastal',
  'lakeside',
  'forest',
  'desert',
  'tropical',
  'snowy region',
  'temperate zone',
  'arid / dry region',
  'windy coastal area',
  'evergreen forest zone',
]);
export const environmentEnum = pgEnum('environment', [
  'village',
  'countryside',
  'isolated',
  'farmland',
  'urban area',
  'metro city',
  'town',
  'suburban',
  'gated community',
]);
export const accommodationEnum = pgEnum('accommodation', [
  'entire apartment',
  'entire house',
  'private room',
  'shared place',
]);

export const property = pgTable(
  'property',
  {
    id: uuid('id').defaultRandom().primaryKey().unique().notNull(),

    region: jsonb('region').$type<LocationObj>().notNull(),
    country: jsonb('country').$type<LocationObj>().notNull(),
    state: jsonb('state').$type<LocationObj>().notNull(),
    city: jsonb('city').$type<LocationObj>().notNull(),
    zipcode: varchar('zipcode', { length: 10 }).notNull(),
    streetAddress: varchar('street_address', { length: 100 }).notNull(),

    area: varchar('area', { length: 20 }).notNull(),
    areaUnit: areaUnitEnum().notNull(),
    description: varchar('description', { length: 3000 }).notNull(),

    roomType: roomTypeEnum().notNull(),
    ownership: ownershipEnum().notNull(),
    swaping: swapingEnum().notNull(),
    rentPeriod: rentPeriodEnum().notNull(),
    surrounding: surroundingEnum().notNull(),
    environment: environmentEnum().notNull(),
    accommodation: accommodationEnum().notNull(),

    beds: integer('beds').notNull(),
    bedRooms: integer('bed_rooms').notNull(),
    bathRooms: integer('bath_rooms').notNull(),
    guests: integer('guests').notNull(),

    ownerName: varchar('owner_name', { length: 100 }).default('n/a'),
    ownerEmail: varchar('owner_email', { length: 100 }).default('n/a'),
    ownerPhone: varchar('owner_phone', { length: 20 }).default('n/a'),
    knownLanguages: jsonb('known_languages')
      .$type<HostLanguageLateral[]>()
      .notNull(),

    amenities: jsonb('amenities').$type<AmenitiesLateral[]>().notNull(),
    accessibilities: jsonb('accessibilities')
      .$type<AccessibilitiesLateral[]>()
      .notNull(),
    rules: jsonb('rules').$type<RulesLateral[]>().notNull(),

    staysDateRange: jsonb('stays_date_range').$type<DateRangeObj>().notNull(),
    staysDuration: varchar('stays_duration', { length: 20 }).notNull(),

    images: jsonb('images').$type<string[]>().notNull(),

    isAvailable: boolean('is_available').default(true).notNull(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),

    authorId: uuid('author_id')
      .references(() => user.id)
      .notNull(),
  },
  (t) => [
    check('check_beds', sql`${t.beds} >= 0 AND ${t.beds} <= 10`),
    check('check_bedRooms', sql`${t.bedRooms} >= 0 AND ${t.bedRooms} <= 10`),
    check('check_bathRooms', sql`${t.bathRooms} >= 0 AND ${t.bathRooms} <= 10`),
    check('check_guests', sql`${t.guests} >= 0 AND ${t.guests} <= 10`),
  ],
);

// export const propertyRelations = relations(property, ({ one }) => ({
//   author: one(user, {
//     fields: [property.authorId],
//     references: [user.id],
//   }),
// }));

export const HoldStatus = pgEnum('hold_status', ['active', 'inactive']);

export const propertyHold = pgTable('propertyHold', {
  id: uuid('id').defaultRandom().primaryKey().unique().notNull(),

  propertyId: uuid('property_id')
    .references(() => property.id, { onDelete: 'cascade' })
    .notNull(),

  holdBy: uuid('hold_by')
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),

  holdStatus: HoldStatus(),
  isActiveHold: boolean('is_active_hold').default(true).notNull(),

  holdDate: timestamp('hold_date'),
  expiredAt: timestamp('expired_at').$onUpdate(() => new Date()),
});

export const propertyFavorite = pgTable('propertyFavorite', {
  id: uuid('id').defaultRandom().primaryKey().unique().notNull(),

  propertyId: uuid('property_id')
    .references(() => property.id, { onDelete: 'cascade' })
    .notNull(),

  favoriteBy: uuid('favorite_by')
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),

  favoriteAt: timestamp('favorite_at')
    .$onUpdate(() => new Date())
    .notNull(),
});

export const propertyStats = pgTable('propertyStats', {
  id: uuid('id').defaultRandom().primaryKey().unique().notNull(),

  propertyId: uuid('property_id')
    .unique()
    .references(() => property.id, { onDelete: 'cascade' })
    .notNull(),

  views: integer('views').default(0).notNull(),
  favorites: integer('favorites').default(0).notNull(),
  holds: integer('holds').default(0).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export type InsertProperty = typeof property.$inferInsert;
export type SelectProperty = typeof property.$inferSelect;

export type InsertPropertyHold = typeof propertyHold.$inferInsert;
export type SelectPropertyHold = typeof propertyHold.$inferSelect;
export type HoldStatus = typeof HoldStatus.enumValues;

export type InsertPropertyFavorite = typeof propertyFavorite.$inferInsert;
export type SelectPropertyFavorite = typeof propertyFavorite.$inferSelect;

export type InsertPropertyStats = typeof propertyStats.$inferInsert;
export type SelectPropertyStats = typeof propertyStats.$inferSelect;
