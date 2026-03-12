import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.url(),
    FACEBOOK_CLIENT_ID: z.string().min(1),
    FACEBOOK_CLIENT_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    SENTRY_DSN: z.url(),
    POLAR_ACCESS_TOKEN: z.string().min(1),
    POLAR_SUCCESS_URL: z.url(),
    POLAR_WEBHOOK_SECRET: z.string().min(1),
    POLAR_PRODUCT_FREE_ID: z.string().min(1),
    POLAR_PRODUCT_BASIC_ID: z.string().min(1),
    POLAR_PRODUCT_PRO_ID: z.string().min(1),
    NOVU_SECRET_KEY: z.string().min(1),
    NOVU_US_API_URL: z.url(),
    NOVU_EU_API_URL: z.url(),
  },
  client: {
    NEXT_PUBLIC_BETTER_AUTH_URL: z.url(),
    NEXT_PUBLIC_SENTRY_DSN: z.url(),
    NEXT_PUBLIC_C15T_URL: z.url(),
    NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER: z.string().min(1),
    NEXT_PUBLIC_NOVU_SUBSCRIBER_ID: z.string().min(1),
  },
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: {
    NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_C15T_URL: process.env.NEXT_PUBLIC_C15T_URL,
    NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER:
      process.env.NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER,
    NEXT_PUBLIC_NOVU_SUBSCRIBER_ID: process.env.NEXT_PUBLIC_NOVU_SUBSCRIBER_ID,
  },
});
