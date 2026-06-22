import { useSession } from '@/lib/auth-client';
import { useTRPC } from '@/trpc/client';
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';

/**
 * Hook for getting a user profile completion ratio
 * @param void
 */
export function useUserProfileCompletionRatio() {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.user.getProfileRatio.queryOptions());
}

/**
 * Hook for update user personal information update
 */
export function useUpdatePersonalInformation() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { refetch } = useSession();

  return useMutation(
    trpc.user.updateUserPersonalInfo.mutationOptions({
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries(
            trpc.user.getProfileRatio.queryOptions(),
          ),
          refetch({
            query: {
              disableCookieCache: true,
            },
          }),
        ]);
      },
      onError: (err) => {
        console.error({ err });
      },
    }),
  );
}

/**
 * Hook for update user confidential information update
 */
export function useUpdateConfidentialInformation() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { refetch } = useSession();

  return useMutation(
    trpc.user.updateUserConfidentialInfo.mutationOptions({
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries(
            trpc.user.getProfileRatio.queryOptions(),
          ),
          refetch({
            query: {
              disableCookieCache: true,
            },
          }),
        ]);
      },
      onError: (err) => {
        console.error({ err });
      },
    }),
  );
}

/**
 * Hook for upload user avatar
 * @param File
 */
export function useAvatarUpload() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { refetch } = useSession();

  return useMutation(
    trpc.user.updateUserAvatar.mutationOptions({
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries(
            trpc.user.getProfileRatio.queryOptions(),
          ),
          refetch({
            query: {
              disableCookieCache: true,
            },
          }),
        ]);
      },
      onError: (err) => {
        console.error({ err });
      },
    }),
  );
}

/**
 * Hook for upload profile document
 * @param File
 */
export function useProfileDocumentUpload() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { refetch } = useSession();

  return useMutation(
    trpc.user.updateProfileDocument.mutationOptions({
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries(
            trpc.user.getProfileRatio.queryOptions(),
          ),
          refetch({
            query: {
              disableCookieCache: true,
            },
          }),
        ]);
      },
      onError: (err) => {
        console.error({ err });
      },
    }),
  );
}
