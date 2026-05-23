import { useTRPC } from '@/trpc/client';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { toast } from 'sonner';

/**
 * TEST HOOK, LATER WILL REMOVE THIS
 * Hook for add a new friend
 */
export function useAddFriend() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.testPurpose.addFriend.mutationOptions({
      onSuccess: async () => {
        queryClient.invalidateQueries(trpc.testPurpose.getUsers.queryOptions());
      },
      onError: (err) => {
        console.error({ err });
        toast.error('Failed to add friend. Please try again.');
      },
    }),
  );
}

/**
 * TEST HOOK, LATER WILL REMOVE THIS
 * Hook for remove a friend
 */
export function useRemoveFriend() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.testPurpose.removeFriend.mutationOptions({
      onSuccess: async () => {
        queryClient.invalidateQueries(trpc.testPurpose.getUsers.queryOptions());
      },
      onError: (err) => {
        console.error({ err });
        toast.error('Failed to remove friend. Please try again.');
      },
    }),
  );
}

/**
 * TEST HOOK, LATER WILL REMOVE THIS
 * Hook to get all users
 */
export function useAllUsers() {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.testPurpose.getUsers.queryOptions());
}

/**
 * TEST HOOK, LATER WILL REMOVE THIS
 * Hook to get a refresh token for stream chat
 */
export function useTestRefreshChatToken() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.testPurpose.refreshChatToken.mutationOptions({
      onSuccess: async () => {
        // queryClient.invalidateQueries(trpc.chat.getUsers.queryOptions());
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
 * TEST HOOK, LATER WILL REMOVE THIS
 * Hook to get all matched users for the current user
 */
export function useTestMatchedUsers() {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.testPurpose.getMatchedUsers.queryOptions());
}
