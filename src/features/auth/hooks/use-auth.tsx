import { useTRPC } from '@/trpc/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

/**
 * Hook to sign up a user
 */
export function useSignUpUser() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(
    trpc.auth.signUpUser.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.auth.getCurrentUser.queryOptions(),
        );
        router.push('/onboarding');
      },
      onError: (err) => {
        console.error({ err: err.message });
        if (err.data?.code === 'CONFLICT') {
          router.push('/login');
          return;
        }
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
    trpc.auth.signInUser.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.auth.getCurrentUser.queryOptions());
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
    trpc.auth.onboardingUser.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.auth.getCurrentUser.queryOptions());
      },
      onError: (err) => {
        console.error({ err });
      },
    }),
  );
}

/**
 * Hook to sign in a user with Google
 */
export function useSignInWithGoogle() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.auth.signInWithGoogle.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.auth.getCurrentUser.queryOptions());
      },
      onError: (err) => {
        console.error({ err });
      },
    }),
  );
}

/**
 * Hook to sign in a user with Facebook
 */
export function useSignInWithFacebook() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.auth.signInWithFacebook.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.auth.getCurrentUser.queryOptions());
      },
      onError: (err) => {
        console.error({ err });
      },
    }),
  );
}
