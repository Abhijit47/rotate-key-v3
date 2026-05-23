import { prefetch, trpc } from '@/trpc/server';
import { inferInput } from '@trpc/tanstack-react-query';

export type ListingsInput = inferInput<typeof trpc.testPurpose.getUsers>;

export type MatchedUserInput = inferInput<
  typeof trpc.testPurpose.getMatchedUsers
>;

/**
 * Prefetch all users
 * @param params
 */
export function prefetchTestPurposeChatUsers(params: ListingsInput) {
  return prefetch(trpc.testPurpose.getUsers.queryOptions(params));
}

/**
 * Prefetch all matched users for the current user.
 */
export function prefetchTestMatchedUsers(params: MatchedUserInput) {
  return prefetch(trpc.testPurpose.getMatchedUsers.queryOptions(params));
}
