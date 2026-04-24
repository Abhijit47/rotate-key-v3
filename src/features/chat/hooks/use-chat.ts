import { useTRPC } from '@/trpc/client';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { toast } from 'sonner';

/**
 * Hook for add a new friend
 */
export function useAddFriend() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.chat.addFriend.mutationOptions({
      onSuccess: async () => {
        queryClient.invalidateQueries(trpc.auth.getCurrentUser.queryOptions());
      },
      onError: (err) => {
        console.error({ err });
        toast.error('Failed to add friend. Please try again.');
      },
    }),
  );
}

/**
 * Hook for remove a friend
 */
export function useRemoveFriend() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.chat.removeFriend.mutationOptions({
      onSuccess: async () => {
        queryClient.invalidateQueries(trpc.auth.getCurrentUser.queryOptions());
      },
      onError: (err) => {
        console.error({ err });
        toast.error('Failed to remove friend. Please try again.');
      },
    }),
  );
}

/**
 * Hook to get a refresh token for stream chat
 */
export function useRefreshChatToken() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.chat.refreshChatToken.mutationOptions({
      onSuccess: async () => {
        queryClient.invalidateQueries(trpc.auth.getCurrentUser.queryOptions());
      },
      onError: (err) => {
        console.error({ err });
        toast.error('Failed to refresh chat token. Please try again.');
      },
    }),
  );
}

/**
 * Hook to get all users
 */
export function useAllUsers() {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.chat.getUsers.queryOptions());
}

/**
 * Hook to get matched user for a given friendId
 */
export function useMatchedUser(friendId: string) {
  const trpc = useTRPC();
  return useSuspenseQuery(
    trpc.chat.getMatchedUser.queryOptions({ ownerId: friendId }),
  );
}
