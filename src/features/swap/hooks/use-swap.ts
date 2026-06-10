import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

/**
 * Hook for find swapable properties for a given opposite user Id
 * @param oppositeUserId - The opposite user Id to find swapable properties for
 */
export function useFindSwapableProperties(oppositeUserId: string) {
  const trpc = useTRPC();

  return useQuery({
    ...trpc.swap.getSwapableProperties.queryOptions({
      id: oppositeUserId,
    }),
    enabled: oppositeUserId.length > 0,
    // select: (properties) =>
    //   properties.map((p) => ({
    //     value: p.property.id,
    //     label: p.property.type,
    //   })),
  });
}

/**
 * Hook for create a swap between two users
 * @param input - The input to create a swap
 */
export function useCreateSwap() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.swap.createSwap.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.swap.getSwap.queryOptions());
      },
      onError: (err) => {
        console.error("hook useCreateSwap error", err);
      },
    }),
  );
}

/**
 * Hook for accept a swap
 */
export function useAcceptSwap() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.swap.acceptSwap.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.swap.getSwap.queryOptions());
      },
      onError: (err) => {
        console.error(err);
      },
    }),
  );
}

/**
 * Hook for reject a swap
 */
export function useRejectSwap() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.swap.rejectSwap.mutationOptions({
      onSuccess: async () => {
        // find the query key for getSwapableProperties when it was invoked
        await queryClient.invalidateQueries({
          queryKey: [""],
        });
      },
      onError: (err) => {
        console.error(err);
      },
    }),
  );
}

/**
 * Hook for get swap request
 */
export function useGetSwap() {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.swap.getSwap.queryOptions());
}
