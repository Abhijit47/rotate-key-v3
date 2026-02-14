import { useTRPC } from '@/trpc/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

/**
 * Hook to onboard a user
 */
export function useOnboardUser() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.users.onboardingUser.mutationOptions({
      onSuccess: ({}) => {
        toast.success('Onboarding successful!');
        queryClient.invalidateQueries(trpc.users.getCurrentUser.queryOptions());
      },
      onError: (err) => {
        console.error({ err });
        toast.error('Onboarding failed. Please try again.');
      },
    }),
  );
}
