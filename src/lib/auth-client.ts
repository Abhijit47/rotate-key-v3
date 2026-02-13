import { inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

import { env } from '@/env';
import type { auth } from './auth';

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL,

  plugins: [inferAdditionalFields<typeof auth>()],
});

// Tip: You can also export specific methods if you prefer:
export const { signIn, signUp, useSession, signOut } = authClient;

export type ClientSession = (typeof authClient.$Infer)['Session'];
