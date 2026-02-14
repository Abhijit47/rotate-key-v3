// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import { env } from './env';

const isDev = process.env.NODE_ENV === 'development';

Sentry.init({
  dsn: env.NEXT_PUBLIC_SENTRY_DSN,

  // Add optional integrations for additional features
  integrations: [
    Sentry.replayIntegration(),
    Sentry.browserTracingIntegration(),
    Sentry.browserProfilingIntegration(),
    Sentry.feedbackIntegration({
      useSentryUser: {
        name: 'fullName',
        email: 'email',
      },
      colorScheme: 'system',
    }),
  ],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: isDev ? 1.0 : 0.1,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,

  // Set `tracePropagationTargets` to control for which URLs trace propagation should be enabled
  tracePropagationTargets: [
    'localhost',
    /^https:\/\/rotate-key-v3\.vercel.app\/api/,
  ],

  // Set profileSessionSampleRate to 1.0 to profile during every session.
  // The decision, whether to profile or not, is made once per session (when the SDK is initialized).
  profileSessionSampleRate: isDev ? 1.0 : 0.1,
  profileLifecycle: 'trace',
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
