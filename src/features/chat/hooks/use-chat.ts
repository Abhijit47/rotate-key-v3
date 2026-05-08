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
    trpc.chat.addFriend.mutationOptions({
      onSuccess: async () => {
        queryClient.invalidateQueries(trpc.chat.getUsers.queryOptions());
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
    trpc.chat.removeFriend.mutationOptions({
      onSuccess: async () => {
        queryClient.invalidateQueries(trpc.chat.getUsers.queryOptions());
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
  return useSuspenseQuery(trpc.chat.getUsers.queryOptions());
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
        queryClient.invalidateQueries(trpc.chat.getUsers.queryOptions());
      },
      onError: (err) => {
        console.error({ err });
        toast.error('Failed to refresh chat token. Please try again.');
      },
    }),
  );
}

/**
 * Hook to get all matched users for the current user
 */
export function useMatchedUsers() {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.chat.getMatchedUsers.queryOptions());
}

/**
 * Hook to check per user check
 */
export function useMyCheck() {
  const trpc = useTRPC();

  return useMutation(
    trpc.chat.checkMyChatLimit.mutationOptions({
      onSuccess: async () => {
        // TESTING PURPOSEs
        // toast.success('Checked chat limit successfully');
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
