import '../../envConfig';

import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';

import { db } from '@/drizzle/db';
import * as schema from '@/drizzle/schema';
import { env } from '@/env';

const facebookClientId = env.FACEBOOK_CLIENT_ID;
const facebookClientSecret = env.FACEBOOK_CLIENT_SECRET;
const googleClientId = env.GOOGLE_CLIENT_ID;
const googleClientSecret = env.GOOGLE_CLIENT_SECRET;

const isDev = process.env.NODE_ENV === 'development';

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  advanced: {
    database: {
      generateId: 'uuid',
    },
    useSecureCookies: isDev ? false : true,
  },
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
    transaction: true,
  }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: false, //defaults to true
  },

  experimental: {
    joins: true,
  },

  socialProviders: {
    facebook: {
      clientId: facebookClientId,
      clientSecret: facebookClientSecret,
    },
    google: {
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    },
  },

  session: {
    storeSessionInDatabase: true,
    preserveSessionInDatabase: true,
    cookieCache: {
      maxAge: 60 * 60 * 24, // 1 day
      enabled: true,
      // refreshCache: {
      //   updateAge: 60, // Refresh when 60 seconds remain before expiry
      // },
    },
  },

  plugins: [nextCookies()],
});

export type ServerSession = (typeof auth.$Infer)['Session'];
