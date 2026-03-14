'use server';

import { env } from '@/env';
import { StreamChat } from 'stream-chat';

export async function generateTokenForUser(userId: string) {
  const expireTime = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24 hours from now
  const issuedAt = Math.floor(new Date().getTime() / 1000);

  // instantiate your stream client using the API key and secret
  // the secret is only used server side and gives you full access to the API
  const serverClient = StreamChat.getInstance(
    env.NEXT_PUBLIC_STREAM_API_KEY,
    env.STREAM_API_SECRET,
  );

  // generate a token for the user
  const token = serverClient.createToken(userId, expireTime, issuedAt);

  return { token, expireTime, issuedAt };
}
