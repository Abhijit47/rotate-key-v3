import { prefetch, trpc } from '@/trpc/server';
import { inferInput } from '@trpc/tanstack-react-query';

export type ListingsInput = inferInput<typeof trpc.chat.getUsers>;

export type MatchedUserInput = inferInput<typeof trpc.chat.getMatchedUsers>;

/**
 * Prefetch all users
 * @param params
 */
export function prefetchChatUsers(params: ListingsInput) {
  return prefetch(trpc.chat.getUsers.queryOptions(params));
}

/**
 * Prefetch all matched users for the current user.
 */
export function prefetchMatchedUsers(params: MatchedUserInput) {
  return prefetch(trpc.chat.getMatchedUsers.queryOptions(params));
}
