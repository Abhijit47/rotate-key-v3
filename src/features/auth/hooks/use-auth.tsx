import { useTRPC } from '@/trpc/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Hook to sign up a user
 */
export function useSignUpUser() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.users.signUpUser.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.users.getCurrentUser.queryOptions());
      },
      onError: (err) => {
        console.error({ err });
      },
    }),
  );
}

/**
 * Hook to sign in a user
 */
export function useSignInUser() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.users.signInUser.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.users.getCurrentUser.queryOptions());
      },
      onError: (err) => {
        console.error({ err });
      },
    }),
  );
}

/**
 * Hook to onboard a user
 */
export function useOnboardUser() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.users.onboardingUser.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.users.getCurrentUser.queryOptions());
      },
      onError: (err) => {
        console.error({ err });
      },
    }),
  );
}
