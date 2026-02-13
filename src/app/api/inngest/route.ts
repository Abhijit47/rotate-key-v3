import { serve } from 'inngest/next';

import { inngest } from '@/inngest/client';
import { helloWorld } from '@/inngest/functions';

// const isDev = process.env.NODE_ENV === 'development';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    helloWorld, // <-- This is where you'll always add all your functions
  ],
});
