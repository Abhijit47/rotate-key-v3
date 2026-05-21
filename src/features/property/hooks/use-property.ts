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
 * Hook for getting my properties.
 */
export function useUserProperties() {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.property.getUserProperties.queryOptions());
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
        // if (err.data?.code === 'FORBIDDEN') {
        //   toast.error(err.message);
        // }
        return err.message;
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
 * Hook for getting a property details by ID
 * @param propertyId
 */
export function useProperty(propertyId: string) {
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.property.getPropertyDetails.queryOptions({ id: propertyId }),
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

// TODO: this is just for testing, will remove later, we can use this to gate any premium features in the future
export function useTestPremium() {
  const trpc = useTRPC();
  return useMutation(
    trpc.property.testPremium.mutationOptions({
      onSuccess: async () => {
        console.log('Premium feature test successful');
      },
      onError: (err) => {
        console.error({ err });
      },
    }),
  );
}

/**
 * Hook for Adding a like to a property
 * @param propertyId
 */
export function useLikeProperty() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.property.addLikeToProperty.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.property.getPublicProperties.queryOptions(),
        );
      },
      onError: (err) => {
        console.error({ err });
      },
    }),
  );
}
