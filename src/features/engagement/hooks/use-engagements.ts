import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
          trpc.property.getPublicProperties.queryOptions(),
        );
      },
      onError: (err) => {
        console.error({ err });
      },
    }),
  );
}