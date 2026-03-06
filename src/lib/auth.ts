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
      prompt: 'select_account',
      redirectURI: `${env.BETTER_AUTH_URL}/api/auth/callback/facebook`,
      disableImplicitSignUp: true,
      mapProfileToUser: (profile) => {
        return {
          name: profile.name,
          email: profile.email,
          image: profile.picture.data.url,
          emailVerified: profile.email_verified, // Facebook doesn't provide this by default, but if it did, you could map it here
        };
      },
    },
    google: {
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      prompt: 'select_account',
      redirectURI: `${env.BETTER_AUTH_URL}/api/auth/callback/google`,
      disableImplicitSignUp: true,
      mapProfileToUser: (profile) => {
        return {
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          emailVerified: profile.email_verified, // Google provides this field, so we can map it directly
        };
      },
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['facebook', 'google', 'email-password'], // Only allow linking accounts from these providers
    },
    storeStateStrategy: 'cookie',
    storeAccountCookie: true, // Store account data after OAuth flow in a cookie (useful for database-less flows)
  },

  user: {
    additionalFields: {
      whereAreYouFrom: {
        type: 'string',
        required: false,
      },
      whereDoYouWantToGo: {
        type: 'string',
        required: false,
      },
      isOnboarded: {
        type: 'boolean',
        required: false,
        default: false,
      },
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

  trustedOrigins: [env.BETTER_AUTH_URL],

  plugins: [nextCookies()],
});

export type ServerSession = (typeof auth.$Infer)['Session'];
