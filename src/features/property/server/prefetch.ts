import { prefetch, trpc } from '@/trpc/server';
import { inferInput } from '@trpc/tanstack-react-query';

type PropertiesInput = inferInput<typeof trpc.property.getPublicProperties>;
/**
 * Prefetch public properties with params
 * @param params
 */
export function prefetchPublicProperties(params: PropertiesInput) {
  return prefetch(trpc.property.getPublicProperties.queryOptions(params));
}

/**
 * Prefetch user properties with params
 * @param params
 */
type MyPropertiesBasicFilterInput = inferInput<
  typeof trpc.property.getUserProperties
>;
export function prefetchUserProperties(params: MyPropertiesBasicFilterInput) {
  return prefetch(trpc.property.getUserProperties.queryOptions(params));
}

/**
 * Prefetch user's favourite properties with params
 * @param params
 */
type MyFavouritePropertiesBasicFilterInput = inferInput<
  typeof trpc.engagement.getUserFavouriteProperties
>;
export function prefetchUserFavouriteProperties(
  params: MyFavouritePropertiesBasicFilterInput,
) {
  return prefetch(
    trpc.engagement.getUserFavouriteProperties.queryOptions(params),
  );
}

/**
 * Prefetch one property by ID
 * @param propertyId
 */
export function prefetchUserProperty(propertyId: string) {
  return prefetch(
    trpc.property.getUserProperty.queryOptions({ id: propertyId }),
  );
}

/**
 * Prefetch one property details by ID
 * @param propertyId
 */
export function prefetchPropertyDetails(propertyId: string) {
  return prefetch(
    trpc.property.getPropertyDetails.queryOptions({ id: propertyId }),
  );
}

/**
 * Prefetch one property details by ID for update
 * @param propertyId
 */
export function prefetchPropertyDetailsForUpdate(propertyId: string) {
  return prefetch(
    trpc.property.getPropertyDetailsForUpdate.queryOptions({ id: propertyId }),
  );
}

/**
 * Prefetch my properties with params
 * @param params
 */
// export function prefetchMyProperties(params: PropertiesInput) {
//   return prefetch(trpc.property.getMyListings.queryOptions());
// }

/**
 * Prefetch my property by ID
 * @param propertyId
 */
// export function prefetchMyProperty(propertyId: string) {
//   return prefetch(trpc.property.getMyProperty.queryOptions({ id: propertyId }));
// }
