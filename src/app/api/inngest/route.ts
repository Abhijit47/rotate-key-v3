import { serve } from 'inngest/next';

import {
  deleteNovuUsers,
  deletePolarUsers,
  deleteStreamUsers,
} from '@/inngest/admin-fn';
import { inngest } from '@/inngest/client';
import {
  createChannelBetweenMatchedUsers,
  helloWorld,
  oauthSignUpComplete,
  userCreated,
  userDeleted,
  userOnboardingComplete,
  userSignUpComplete,
} from '@/inngest/functions';

// const isDev = process.env.NODE_ENV === 'development';

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    helloWorld, // <-- This is where you'll always add all your functions
    userSignUpComplete,
    oauthSignUpComplete,
    userOnboardingComplete,
    userCreated,
    userDeleted,
    createChannelBetweenMatchedUsers,

    // for development/testing purposes only
    deletePolarUsers,
    deleteStreamUsers,
    deleteNovuUsers,
  ],
  logLevel: 'error',
});
