import '../../envConfig';

import {
  checkout,
  polar,
  portal,
  usage,
  webhooks,
} from '@polar-sh/better-auth';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { admin as adminPlugin } from 'better-auth/plugins';

import { db } from '@/drizzle/db';
import * as schema from '@/drizzle/schema';
import { env } from '@/env';
import { ac, admin, moderator, user } from './permissions';
import { polarClient } from './polar';

const facebookClientId = env.FACEBOOK_CLIENT_ID;
const facebookClientSecret = env.FACEBOOK_CLIENT_SECRET;
const googleClientId = env.GOOGLE_CLIENT_ID;
const googleClientSecret = env.GOOGLE_CLIENT_SECRET;

// const products = [
//   {
//     productId: env.POLAR_PRODUCT_FREE_ID,
//     slug: 'free',
//   },
//   {
//     productId: env.POLAR_PRODUCT_BASIC_ID,
//     slug: 'basic-monthly',
//   },
//   {
//     productId: 'ac96bf48-4e16-4943-9f65-5fe37afa6819',
//     slug: 'basic-yearly',
//   },
//   {
//     productId: env.POLAR_PRODUCT_PRO_ID,
//     slug: 'pro',
//   },
// ];
// TODO: Later will add through env
const products = [
  {
    productId: 'e5cb95ff-a6be-4549-81d0-5c10170a52ca',
    slug: 'pro-yearly',
  },
  {
    productId: 'ac96bf48-4e16-4943-9f65-5fe37afa6819',
    slug: 'basic-yearly',
  },
  {
    productId: '44057f38-5c6b-431d-9633-be7ef9433c0e',
    slug: 'pro-monthly',
  },
  {
    productId: 'd8839644-f591-4ae4-b4cf-5df7eebe1005',
    slug: 'basic-monthly',
  },
  {
    productId: 'a345249d-b5df-4f97-ad62-e23ee88e53fa',
    slug: 'free',
  },
];

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
    autoSignIn: true, //defaults to true
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
      isSocialSignInComplete: {
        type: 'boolean',
        required: true,
        default: false,
        input: false,
      },
      isOnboarded: {
        type: 'boolean',
        required: true,
        default: false,
        input: false,
      },
      chatToken: {
        type: 'string',
        required: false,
        defaultValue: 'n/a',
        input: false,
      },
      chatTokenExpireAt: {
        type: 'date',
        required: false,
        defaultValue: null,
        input: false,
      },
      chatTokenIssuedAt: {
        type: 'date',
        required: false,
        defaultValue: null,
        input: false,
      },
      role: {
        type: 'string',
        required: true,
        defaultValue: 'user',
        input: false,
      },
      isSubscribed: {
        type: 'boolean',
        required: false,
        defaultValue: false,
        input: false,
      },
      plan: {
        type: 'string',
        required: false,
        defaultValue: 'free',
        input: false,
      },
    },
    deleteUser: {
      enabled: true,
      afterDelete: async (user) => {
        await polarClient.customers.deleteExternal({
          externalId: user.id,
        });

        // TODO:
        // stream user delete
        // novu user delete
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

  plugins: [
    adminPlugin({
      ac,
      roles: {
        admin,
        moderator,
        user,
      },
    }),
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: products,
          successUrl: env.POLAR_SUCCESS_URL,
          authenticatedUsersOnly: true,
          returnUrl: '/pricing',
          theme: 'dark',
        }),
        portal(),
        usage(),
        webhooks({
          secret: env.POLAR_WEBHOOK_SECRET,
          onCustomerStateChanged: (payload) => {
            return new Promise((resolve) => {
              // Handle the event, e.g. update user in database based on payload.customer.id
              console.log('Customer state changed:', payload);
              resolve();
            });
          },
          // Triggered when anything regarding a customer changes
          onOrderPaid: (payload) => {
            return new Promise((resolve) => {
              // Handle the event, e.g. grant user access to product based on payload.order.id
              console.log('Order paid:', payload);
              resolve();
            });
          },
          // Triggered when an order was paid (purchase, subscription renewal, etc.)
          // Over 25 granular webhook handlers
          onPayload: (payload) => {
            return new Promise((resolve) => {
              // Handle the event, e.g. log all events for analytics
              console.log('Received Polar webhook event:', payload);
              resolve();
            });
          },
          // Catch-all for all events
        }),
      ],
    }),
    nextCookies(),
  ],
});

export type ServerSession = (typeof auth.$Infer)['Session'];
