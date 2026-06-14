import { useTRPC } from '@/trpc/client';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';

/**
 * Hook for create review
 */
export function useCreateReview() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.review.createReview.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.review.getReviews.queryOptions(),
        );
      },
      onError: (err) => {
        console.error('hook useCreateReview error', err);
      },
    }),
  );
}

/**
 * Hook for get reviews
 */
export function useGetReviews() {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.review.getReviews.queryOptions());
}
