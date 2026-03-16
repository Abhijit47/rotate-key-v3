import { useTRPC } from '@/trpc/client';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';

/**
 * Hook to create a new user
 */
export function useCreateUser() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.admin.createUser.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.admin.getUsers.queryOptions({}));
      },
      onError: (err) => {
        console.error({ err });
      },
    }),
  );
}

/**
 * Hook to get list of users
 */
export function useGetUsers() {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.admin.getUsers.queryOptions({}));
}

/**
 * Hook to delete a user by ID
 */
export function useDeleteUser() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.admin.deleteUser.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.admin.getUsers.queryOptions({}));
      },
      onError: (err) => {
        console.error({ err });
      },
    }),
  );
}
