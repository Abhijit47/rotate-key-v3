import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';

import { BasicFilterValues } from '@/lib/validators/property-filter-sort-query-schema';
import { useTRPC } from '@/trpc/client';

/**
 * Hook for Adding a like to a property
 * @param propertyId
 */
export function useLikeProperty() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.engagement.addLikeToProperty.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.property.getPublicProperties.queryOptions({}),
        );
      },
      onError: (err) => {
        console.error({ err });
      },
    }),
  );
}

/**
 * Hook For Hold a property
 * @param propertyId
 */
export function useAddHoldToProperty() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.engagement.addHoldToAProperty.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.property.getPublicProperties.queryOptions({}),
        );
      },
      onError: (err) => {
        console.error({ err });
      },
    }),
  );
}

/**
 * Hook for add property to favorite list
 */
export function useAddToFavorite() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.engagement.addPropertyToFavorite.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.property.getPublicProperties.queryOptions({}),
        );
      },
      onError: (err) => {
        console.error({ err });
      },
    }),
  );
}

/**
 * Hook for get holded property
 */
export function useGetHoldedProperties() {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.engagement.getHoldedProperties.queryOptions());
}

/**
 * Hook for get Liked properties
 */

export function useGetLikedProperties() {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.engagement.getLikedProperties.queryOptions());
}

/**
 * Hook for get user's favourite properties
 */
export function useGetUserFavouriteProperties(params: BasicFilterValues) {
  const trpc = useTRPC();

  return useSuspenseQuery(
    trpc.engagement.getUserFavouriteProperties.queryOptions(params),
  );
}
