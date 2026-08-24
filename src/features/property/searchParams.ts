import { addDays } from 'date-fns';

import {
  createLoader,
  createParser,
  parseAsArrayOf,
  parseAsIsoDate,
  parseAsString,
  parseAsStringLiteral,
  UrlKeys,
} from 'nuqs/server';

import {
  propertyAccessibilitiesEnum,
  propertyAccomodationsEnum,
  propertyAmenitiesEnum,
  propertyEnvironmentsEnum,
  propertyOwnershipsEnum,
  propertyRentPeriodEnum,
  propertyRulesEnum,
  propertySurroundingsEnum,
  propertySwapingsEnum,
  propertyTypesEnum,
} from '@/constants/property-assets-enums';

const sortParser = createParser({
  parse: (value) => {
    if (value === 'asc' || value === 'desc') {
      return value;
    }
    return 'asc';
  },
  serialize: (value) => value,
});

const dateParams = {
  from: parseAsIsoDate.withDefault(addDays(new Date(), -30)),
  to: parseAsIsoDate.withDefault(addDays(new Date(), 7)),
};

// Describe your search params, and reuse this in useQueryStates / createSerializer:
// export const swappingSearchParams = {
//   offset: parseAsString.withDefault("1"),
//   limit: parseAsString.withDefault("20"),
//   sort: sortParser.withDefault("asc"),

//   roomType: parseAsStringLiteral(propertyTypesEnum),
//   goto: parseAsString.withDefault(""),

//   from: parseAsIsoDate.withDefault(addDays(new Date(), -30)),
//   to: parseAsIsoDate.withDefault(addDays(new Date(), 7)),

//   // advanced filters
//   ownership: parseAsStringLiteral(propertyOwnershipsEnum),
//   swaping: parseAsStringLiteral(propertySwapingsEnum),
//   rentPeriod: parseAsStringLiteral(propertyRentPeriodEnum),
//   surrounding: parseAsStringLiteral(propertySurroundingsEnum),
//   environment: parseAsStringLiteral(propertyEnvironmentsEnum),
//   accomodation: parseAsStringLiteral(propertyAccomodationsEnum),

//   amenities: parseAsArrayOf(parseAsStringLiteral(propertyAmenitiesEnum)),
//   rules: parseAsArrayOf(parseAsStringLiteral(propertyRulesEnum)),
//   accessibilities: parseAsArrayOf(
//     parseAsStringLiteral(propertyAccessibilitiesEnum),
//   ),
// };

export const basicFilterAndPaginateParams = {
  offset: parseAsString.withDefault('1'),
  limit: parseAsString.withDefault('20'),
  sort: sortParser.withDefault('asc'),
};

export const basicFilterAddonParams = {
  roomType: parseAsStringLiteral(propertyTypesEnum),
  goto: parseAsString
    .withDefault('')
    .withOptions({ limitUrlUpdates: { method: 'throttle', timeMs: 200 } }),

  ...basicFilterAndPaginateParams,
  ...dateParams,
  // offset: parseAsString.withDefault("1"),
  // limit: parseAsString.withDefault("20"),
  // sort: sortParser.withDefault("asc"),
  // from: parseAsIsoDate.withDefault(addDays(new Date(), -30)),
  // to: parseAsIsoDate.withDefault(addDays(new Date(), 7)),
};

export const advancedFilterParams = {
  // advanced filters
  ...dateParams,

  ownership: parseAsStringLiteral(propertyOwnershipsEnum),
  swaping: parseAsStringLiteral(propertySwapingsEnum),
  rentPeriod: parseAsStringLiteral(propertyRentPeriodEnum),
  surrounding: parseAsStringLiteral(propertySurroundingsEnum),
  environment: parseAsStringLiteral(propertyEnvironmentsEnum),
  accomodation: parseAsStringLiteral(propertyAccomodationsEnum),

  amenities: parseAsArrayOf(parseAsStringLiteral(propertyAmenitiesEnum)),
  rules: parseAsArrayOf(parseAsStringLiteral(propertyRulesEnum)),
  accessibilities: parseAsArrayOf(
    parseAsStringLiteral(propertyAccessibilitiesEnum),
  ),
};

// export const loadSearchParams = createLoader(swappingSearchParams);

export const loadBasicFilterAndPaginateParams = createLoader(
  basicFilterAndPaginateParams,
);
export const loadBasicFilterAddonParams = createLoader(basicFilterAddonParams);
export const loadAdvancedFilterParams = createLoader(advancedFilterParams);

// export type SwappingSearchParams = UrlKeys<typeof swappingSearchParams>;
export type BasicFilterAndPaginateParams = UrlKeys<
  typeof basicFilterAndPaginateParams
>;
export type BasicFilterAddonParams = UrlKeys<typeof basicFilterAddonParams>;
export type AdvancedFilterParams = UrlKeys<typeof advancedFilterParams>;
