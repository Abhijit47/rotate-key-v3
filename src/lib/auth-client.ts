import { env } from '@/env';
import { polarClient } from '@polar-sh/better-auth';
import { devtoolsClientPluginFor } from 'better-auth-devtools/plugin';
import { adminClient, inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

import type { auth } from './auth';
import { DevtoolsConfig } from './auth/devtools';
import { ac, admin, moderator, user } from './permissions';

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL,

  plugins: [
    inferAdditionalFields<typeof auth>(),
    polarClient(),
    adminClient({
      ac,
      roles: {
        admin,
        moderator,
        user,
      },
    }),
    devtoolsClientPluginFor<DevtoolsConfig>(),
  ],
});

// Tip: You can also export specific methods if you prefer:
export const { signIn, signUp, useSession, signOut } = authClient;

export type ClientSession = (typeof authClient.$Infer)['Session'];
