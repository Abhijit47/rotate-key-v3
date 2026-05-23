import { prefetch, trpc } from '@/trpc/server';
import { inferInput } from '@trpc/tanstack-react-query';

export type ListingsInput = inferInput<typeof trpc.chat.getMatchedUsers>;

export type MatchedUserInput = inferInput<typeof trpc.chat.getMatchedUsers>;

/**
 * Prefetch all matched users for the current user.
 */
export function prefetchMatchedUsers(params: MatchedUserInput) {
  return prefetch(trpc.chat.getMatchedUsers.queryOptions(params));
}
