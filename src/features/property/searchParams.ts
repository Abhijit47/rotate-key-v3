import {
  createLoader,
  parseAsIsoDate,
  parseAsString,
  UrlKeys,
} from 'nuqs/server';

// Describe your search params, and reuse this in useQueryStates / createSerializer:
export const swappingSearchParams = {
  offset: parseAsString.withDefault('1'),
  limit: parseAsString.withDefault('10'),
  type: parseAsString.withDefault('apartment'),
  query: parseAsString.withDefault(''),
  start: parseAsIsoDate.withDefault(new Date()),
  end: parseAsIsoDate.withDefault(new Date()), // Default to one week later
};

export const loadSearchParams = createLoader(swappingSearchParams);

export type SwappingSearchParams = UrlKeys<typeof swappingSearchParams>;
