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
 * Prefetch one property by ID
 * @param propertyId
 */
export function prefetchUserProperty(propertyId: string) {
  return prefetch(
    trpc.property.getUserProperty.queryOptions({ id: propertyId }),
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
