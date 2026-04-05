import { useTRPC } from '@/trpc/client';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

//=== Public Hooks for properties ===//
/**
 * Hooks for getting public properties.
 */
export function usePublicProperties() {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.property.getPublicProperties.queryOptions());
}

/**
 * Hook for create a property
 */
export function useCreateProperty() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(
    trpc.property.createProperty.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.property.getPublicProperties.queryOptions(),
        );
        router.push('/swapings');
      },
      onError: (err) => {
        console.error({ err });
      },
    }),
  );
}

/**
 * Hook for update a property
 */
export function useUpdateProperty() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(
    trpc.property.updateProperty.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.property.getPublicProperties.queryOptions(),
        );
        router.push('/swapings');
      },
      onError: (err) => {
        console.error({ err });
      },
    }),
  );
}

/**
 * Hook for delete a property
 *
 */
export function useDeleteProperty() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  // const router = useRouter();

  return useMutation(
    trpc.property.deleteProperty.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.property.getPublicProperties.queryOptions(),
        );
        // router.push('/swapings');
      },
      onError: (err) => {
        console.error({ err });
      },
    }),
  );
}

/**
 * Hook for getting a user property by ID
 * @param propertyId
 */
export function useUserProperty(propertyId: string) {
  const trpc = useTRPC();

  return useSuspenseQuery(
    trpc.property.getUserProperty.queryOptions({ id: propertyId }),
  );
}
