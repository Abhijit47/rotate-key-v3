'use server';

import { createHmac } from 'crypto';

import { env } from '@/env';

/**
 * Generate 256 Hash for notification subscriber
 * @param subscriberId
 */
export async function generateSubscriberHash(subscriberId: string) {
  // Generate the HMAC hash
  const hmacHash = createHmac('sha256', env.NOVU_SECRET_KEY)
    .update(subscriberId)
    .digest('hex');
  return hmacHash;
}
