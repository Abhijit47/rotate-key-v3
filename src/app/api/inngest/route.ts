import { serve } from 'inngest/next';

import { env } from '@/env';
import { inngest } from '@/inngest/client';
import { helloWorld } from '@/inngest/functions';

const isDev = process.env.NODE_ENV === 'development';

export const { GET, POST, PUT } = serve({
  baseUrl: env.INNGEST_BASE_URL,
  client: inngest,
  functions: [
    helloWorld, // <-- This is where you'll always add all your functions
  ],
  signingKey: isDev ? undefined : env.INNGEST_SIGNING_KEY,
  servePath: env.INNGEST_SERVE_PATH,
});
