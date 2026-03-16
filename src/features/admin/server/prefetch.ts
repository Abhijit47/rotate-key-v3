import { prefetch, trpc } from '@/trpc/server';
import { inferInput } from '@trpc/tanstack-react-query';

type ListingsInput = inferInput<typeof trpc.admin.getUsers>;

/**
 * Prefetch all users
 * @param params
 */
export function prefetchUsers(params: ListingsInput) {
  return prefetch(trpc.admin.getUsers.queryOptions(params));
}

/**
 * Prefetch one user by ID
 * @param userId
 */
export function prefetchUser(userId: string) {
  return prefetch(
    // trpc.listings.getPublicListing.queryOptions({ id: listingId }),
    trpc.admin.getUser.queryOptions({ id: userId }),
  );
}
