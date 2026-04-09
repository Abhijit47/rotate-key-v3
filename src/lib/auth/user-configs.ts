import { APIError, BetterAuthDBOptions, BetterAuthOptions } from 'better-auth';
// import { polarClient } from '../polar';

const additionalFields = {
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
    defaultValue: false,
    input: false,
  },
  socialProvider: {
    type: 'string',
    required: false,
    defaultValue: null,
    input: false,
  },
  isOnboarded: {
    type: 'boolean',
    required: true,
    defaultValue: false,
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
  planSlug: {
    type: 'string',
    required: false,
    defaultValue: null,
    input: false,
  },
  notificationHash: {
    type: 'string',
    required: false,
    defaultValue: null,
    input: false,
  },
  firstName: {
    type: 'string',
    required: false,
    defaultValue: null,
    input: false,
  },
  lastName: {
    type: 'string',
    required: false,
    defaultValue: null,
    input: false,
  },
  spokenLanguages: {
    type: 'string[]',
    required: false,
    defaultValue: null,
    input: false,
  },
  country: {
    type: 'string',
    required: false,
    defaultValue: null,
    input: false,
  },
  aboutMe: {
    type: 'string',
    required: false,
    defaultValue: null,
    input: false,
  },
  yearOfBirth: {
    type: 'string',
    required: false,
    defaultValue: null,
    input: false,
  },
  contactNumber: {
    type: 'string',
    required: false,
    defaultValue: null,
    input: false,
  },
  isContactNumberVerified: {
    type: 'boolean',
    required: false,
    defaultValue: false,
    input: false,
  },
  profileVerificationDocument: {
    type: 'string',
    required: false,
    defaultValue: null,
    input: false,
  },
} as const satisfies BetterAuthDBOptions<'user'>['additionalFields'];

const userConfig = {
  modelName: 'user',
  additionalFields: additionalFields,
  deleteUser: {
    enabled: true,
    afterDelete: async (user) => {
      try {
        // await polarClient.customers.deleteExternal({
        //   externalId: user.id,
        // });
      } catch (error) {
        // Log but don't throw - user deletion should complete even if Polar cleanup fails
        console.error(
          `Failed to delete Polar customer for user ${user.id}:`,
          error,
        );
        throw new APIError(500, {
          message: 'Failed to delete associated customer in billing system',
          code: 'INTERNAL_SERVER_ERROR',
        });
      }

      // TODO:
      // stream user delete
      // novu user delete
    },
  },
} satisfies BetterAuthOptions['user'];

export default userConfig;
