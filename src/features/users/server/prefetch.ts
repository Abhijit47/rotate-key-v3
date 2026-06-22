import { prefetch, trpc } from '@/trpc/server';
import { inferInput } from '@trpc/tanstack-react-query';

type UserInput = inferInput<typeof trpc.user.getProfileRatio>;
/**
 * Prefetch Profile Completion Percentage
 * @param params
 */
export function prefetchProfileCompletionPercentage(params?: UserInput) {
  return prefetch(trpc.user.getProfileRatio.queryOptions(params));
}
