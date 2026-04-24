import { prefetch, trpc } from '@/trpc/server';
import { inferInput } from '@trpc/tanstack-react-query';

export type ListingsInput = inferInput<typeof trpc.chat.getUsers>;

export type MatchedUserInput = inferInput<typeof trpc.chat.getMatchedUser>;

/**
 * Prefetch all users
 * @param params
 */
export function prefetchChatUsers(params: ListingsInput) {
  return prefetch(trpc.chat.getUsers.queryOptions(params));
}

/**
 * Prefetch matched user for a given ownerId
 * @param params
 */
export function prefetchMatchedUser(params: MatchedUserInput) {
  return prefetch(trpc.chat.getMatchedUser.queryOptions(params));
}
