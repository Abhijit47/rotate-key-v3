import { format } from 'date-fns';
import { NonRetriableError } from 'inngest';
import { StreamChat, UserResponse } from 'stream-chat';
import { eq } from 'drizzle-orm';

import { db } from '@/drizzle/db';
import { user } from '@/drizzle/schema';
import { match as MatchTable } from '@/drizzle/schema/match';
import { env } from '@/env';
import { auth } from '@/lib/auth';
import { generateChannelId } from '@/lib/helpers';
import { polarClient } from '@/lib/polar';
import {
  createSubscriber,
  deleteSubscriber,
  sendInAppNotification,
} from '@/novu/functions';
import { inngest } from './client';
import { generateSubscriberHash } from '@/lib/generate-hash';

export const helloWorld = inngest.createFunction(
  { id: 'hello-world' },
  { event: 'test/hello.world' },
  async ({ event, step }) => {
    await step.sleep('wait-a-moment', '1s');

    await step.sleep('wait-another-moment', '5s');

    await step.sleep('wait-one-more-moment', '10s');

    return { message: `Hello ${event.data.email}!` };
  },
);

export const userSignUpComplete = inngest.createFunction(
  { id: 'user-new-signup', retries: 5, optimizeParallelism: true },
  { event: 'user/new.signup.complete' },
  async ({ event, step }) => {
    const serverClient = StreamChat.getInstance(
      env.NEXT_PUBLIC_STREAM_API_KEY,
      env.STREAM_API_SECRET,
      { timeout: 6000, enableWSFallback: true },
    );

    const foundUser = await step.run('find-the-user', async () => {
      return db.query.user.findFirst({
        where: (user, { eq }) => eq(user.email, event.data.email),
      });
    });

    if (!foundUser) {
      throw new NonRetriableError('User no longer exists; stopping');
    }

    await step.run('chat-user-update', async () => {
      const streamUser = {
        id: foundUser.id,
        anon: false,
        banned: false,
        name: foundUser.name,
        image: foundUser.image,
        language: 'en',
        last_active: format(foundUser.createdAt, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        notifications_muted: false,
        role: 'user',
        username: event.data.name,
      } as UserResponse;

      await serverClient.upsertUser(streamUser);
    });

    await step.run('subscriber-creating', async () => {
      const subscriber = await createSubscriber({
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
      });
      return subscriber.result;
    });

    const streamResult = await step.run('chat-token-creating', async () => {
      const expireTime = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24 hours from now
      const issuedAt = Math.floor(new Date().getTime() / 1000);
      const token = serverClient.createToken(
        foundUser.id,
        expireTime,
        issuedAt,
      );
      await Promise.resolve();
      return { token, expireTime, issuedAt };
    });

    // Generate Subscriber hash
    const subcriberHash = await step.run(
      'generate-subscriber-hash',
      async () => {
        return await generateSubscriberHash(foundUser.id);
      },
    );

    // update the token,expiredAt,issuedAt for the user in the database
    await step.run('update-user-with-token', async () => {
      return db
        .update(user)
        .set({
          notificationHash: subcriberHash,
          chatToken: streamResult.token,
          chatTokenExpireAt: new Date(streamResult.expireTime! * 1000),
          chatTokenIssuedAt: new Date(streamResult.issuedAt! * 1000),
        })
        .where(eq(user.id, foundUser.id))
        .returning();
    });
  },
);

export const oauthSignUpComplete = inngest.createFunction(
  { id: 'user-oauth-signup' },
  { event: 'user/oauth.signup.complete' },
  async ({ event, step }) => {
    const serverClient = StreamChat.getInstance(
      env.NEXT_PUBLIC_STREAM_API_KEY,
      env.STREAM_API_SECRET,
      { timeout: 6000, enableWSFallback: true },
    );

    const foundUser = await step.run('find-the-user', async () => {
      return db.query.user.findFirst({
        where: (user, { eq }) => eq(user.email, event.data.email),
      });
    });

    if (!foundUser) {
      throw new NonRetriableError('User no longer exists; stopping');
    }

    await step.run('chat-user-update', async () => {
      const streamUser = {
        id: foundUser.id,
        anon: false,
        banned: false,
        name: foundUser.name,
        image: foundUser.image,
        language: 'en',
        last_active: format(foundUser.createdAt, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        notifications_muted: false,
        role: 'user',
        username: event.data.name,
      } as UserResponse;

      await serverClient.upsertUsers([streamUser]);
    });

    await step.run('subscriber-creating', async () => {
      const subscriber = await createSubscriber({
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
      });
      return subscriber.result;
    });

    const streamResult = await step.run('chat-token-creating', async () => {
      const expireTime = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24 hours from now
      const issuedAt = Math.floor(new Date().getTime() / 1000);
      const token = serverClient.createToken(
        foundUser.id,
        expireTime,
        issuedAt,
      );
      await Promise.resolve();
      return { token, expireTime, issuedAt };
    });

    // update the user in the database to set isSocialSignInComplete to true
    await step.run('update-user-with-token', async () => {
      return db
        .update(user)
        .set({
          chatToken: streamResult.token,
          chatTokenExpireAt: new Date(streamResult.expireTime! * 1000),
          chatTokenIssuedAt: new Date(streamResult.issuedAt! * 1000),
          isSocialSignInComplete: true,
        })
        .where(eq(user.id, foundUser.id))
        .returning();
    });
  },
);

export const userOnboardingComplete = inngest.createFunction(
  { id: 'user-onboarding' },
  { event: 'user/onboarding.complete' },
  async ({ event, step }) => {
    const user = event.data;
    // if user is onboarded, send them a welcome notification
    if (user?.isOnboarded) {
      await step.run('welcome-email-sending', async () => {
        console.log('welcome email sending for:', event.data.email);
      });
      await step.run('welcome-notification-sending', async () => {
        const novuPayload = {
          workflowType: 'welcome-user' as WorkflowTypes,
          user: user,
        };
        // send a welcome notification to the user
        await sendInAppNotification({ payload: novuPayload });
      });
    } else {
      console.log('User is not onboarded yet, skipping welcome notification');
      // notify to the team that a user has signed up but not onboarded yet, so they can reach out to them and help them onboard
      const novuPayload = {
        workflowType: 'skipped-onboarding' as WorkflowTypes,
        user: user,
      };
      await sendInAppNotification({ payload: novuPayload });
    }
  },
);

export const createChannelBetweenMatchedUsers = inngest.createFunction(
  { id: 'create-channel-for-matched-users' },
  {
    event: 'matched/create-channel',
  },
  async ({ event, step }) => {
    const { user1Id, user2Id, newMatchId } = event.data;
    // This function is triggered when a user likes a property. It checks if there's a match and creates a chat channel if there is.
    // 1️⃣: Stream Chat setup
    const serverClient = StreamChat.getInstance(
      env.NEXT_PUBLIC_STREAM_API_KEY,
      env.STREAM_API_SECRET,
      { timeout: 6000, enableWSFallback: true },
    );

    // 2️⃣: Deterministic channel ID
    const channelId = await step.run('generate-channel-id', async () => {
      // const channelId = generateChannelId(user1Id, user2Id, 32, 'match');
      await Promise.resolve(); // simulate async work if needed
      return generateChannelId(user1Id, user2Id, 32, 'match');
    });

    // 3️⃣: Create or get the channel
    const channelInstance = serverClient.channel('messaging', channelId, {
      members: [user1Id, user2Id],
      created_by_id: user1Id, // or ownerId, doesn't matter
    });

    // 4️⃣: Create the channel if it doesn't exist
    await step.run('create-channel-if-not-exists', async () => {
      await channelInstance.create();
    });

    await step.sleep('wait-for-channel-creation', '2s'); // wait for a moment to ensure the channel is fully created before updating the match with channel info

    // 5️⃣: Update the match with channel info
    const updatedMatches = await step.run(
      'update-match-with-channel-info',
      async () => {
        return await db
          .update(MatchTable)
          .set({
            channelId: channelInstance.id,
            channelType: 'messaging',
          })
          .where(eq(MatchTable.id, newMatchId))
          .returning();
      },
    );

    if (updatedMatches.length === 0) {
      throw new NonRetriableError(
        `Match ${newMatchId} was not found; channel metadata was not persisted`,
      );
    }

    await step.sleep('wait-for-find-the-match', '2s');
    const matchedRow = await db.query.match.findFirst({
      where(fields, { and, eq }) {
        return and(
          eq(fields.id, updatedMatches[0].id),
          eq(fields.isActive, updatedMatches[0].isActive),
        );
      },
      columns: { id: true, isActive: true },
      with: {
        user1: {
          columns: {
            id: true,
            name: true,
            firstName: true,
            lastName: true,
            email: true,
            contactNumber: true,
          },
        },
        user2: {
          columns: {
            id: true,
            name: true,
            firstName: true,
            lastName: true,
            email: true,
            contactNumber: true,
          },
        },
      },
    });

    if (!matchedRow) {
      throw new NonRetriableError('No matched found for sending notification!');
    }

    await step.sleep('wait-for-sending-user-1', '2s');
    // Send notification to user1
    await step.run('send-match-notification-to-user1', async () => {
      const novuPayload = {
        workflowType: 'matched' as WorkflowTypes,
        matched: {
          userId: matchedRow.user1.id,
          userName: matchedRow.user1.name,
          userFirstName: matchedRow.user1.firstName,
          userLastName: matchedRow.user1.lastName,
          userEmail: matchedRow.user1.email,
          userContactNumber: matchedRow.user1.contactNumber,
          oppositeUserName: matchedRow.user2.name,
        },
      };

      await sendInAppNotification({ payload: novuPayload });
    });

    await step.sleep('wait-for-sending-user-2', '2s');
    // Send notification to user2
    await step.run('send-match-notification-to-user2', async () => {
      const novuPayload = {
        workflowType: 'matched' as WorkflowTypes,
        matched: {
          userId: matchedRow.user2.id,
          userName: matchedRow.user2.name,
          userFirstName: matchedRow.user2.firstName,
          userLastName: matchedRow.user2.lastName,
          userEmail: matchedRow.user2.email,
          userContactNumber: matchedRow.user2.contactNumber,
          oppositeUserName: matchedRow.user1.name,
        },
      };

      await sendInAppNotification({ payload: novuPayload });
    });

    return {
      success: true,
      message: `Channel ${channelInstance.id} created for matched users ${user1Id} and ${user2Id}`,
    };
  },
);

// ADMIN - functions
export const userCreated = inngest.createFunction(
  { id: 'admin-user-created' },
  { event: 'admin-user/created' },
  async ({ event, step }) => {
    const serverClient = StreamChat.getInstance(
      env.NEXT_PUBLIC_STREAM_API_KEY,
      env.STREAM_API_SECRET,
      { timeout: 6000, enableWSFallback: true },
    );

    const newUser = await step.run('create-user-in-db', async () => {
      const { email, password, name, role } = event.data;
      return await auth.api.createUser({
        body: {
          email, // required
          password, // required
          name, // required
          role: role ?? 'user',
          // data: { customField: 'customValue' },
        },
      });
    });

    await step.run('chat-user-update', async () => {
      const streamUser = {
        id: newUser.user.id,
        anon: false,
        banned: false,
        name: newUser.user.name,
        image: newUser.user.image,
        language: 'en',
        last_active: format(newUser.user.createdAt, "yyyy-MM-dd'T'HH:mm:ss'Z'"),
        notifications_muted: false,
        role: 'user',
        username: event.data.name,
      } as UserResponse;

      await serverClient.upsertUsers([streamUser]);
    });

    await step.run('subscriber-creating', async () => {
      const subscriber = await createSubscriber({
        id: newUser.user.id,
        name: newUser.user.name,
        email: newUser.user.email,
      });
      return subscriber.result;
    });

    const streamResult = await step.run('chat-token-creating', async () => {
      const expireTime = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24 hours from now
      const issuedAt = Math.floor(new Date().getTime() / 1000);
      const token = serverClient.createToken(
        newUser.user.id,
        expireTime,
        issuedAt,
      );
      await Promise.resolve();
      return { token, expireTime, issuedAt };
    });

    await step.run('update-user-with-token', async () => {
      return db
        .update(user)
        .set({
          chatToken: streamResult.token,
          chatTokenExpireAt: new Date(streamResult.expireTime! * 1000),
          chatTokenIssuedAt: new Date(streamResult.issuedAt! * 1000),
        })
        .where(eq(user.id, newUser.user.id));
    });
  },
);

export const userDeleted = inngest.createFunction(
  { id: 'admin-user-deleted' },
  { event: 'admin-user/deleted' },
  async ({ event, step }) => {
    const serverClient = StreamChat.getInstance(
      env.NEXT_PUBLIC_STREAM_API_KEY,
      env.STREAM_API_SECRET,
      { timeout: 6000, enableWSFallback: true },
    );

    const removedUser = await step.run('delete-user-from-db', async () => {
      const foundUser = await db.query.user.findFirst({
        where: eq(user.id, event.data.id),
      });

      if (!foundUser) {
        throw new NonRetriableError('User no longer exists; stopping');
      }
      const removeUser = await db
        .delete(user)
        .where(eq(user.id, foundUser.id))
        .returning();
      if (removeUser.length === 0) {
        throw new NonRetriableError('User no longer exists; stopping');
      }
      return removeUser[0];
    });

    await step.run('delete-user-from-chat-provider', async () => {
      return await serverClient.deleteUser(removedUser.id, {
        delete_conversation_channels: true,
        hard_delete: true,
        mark_messages_deleted: true,
      });
    });

    await step.run('delete-user-from-notification-provider', async () => {
      return await deleteSubscriber(removedUser.id);
    });

    await step.run('delete-user-from-payment-provider', async () => {
      return await polarClient.customers
        .deleteExternal({ externalId: removedUser.id })
        .then(async () => {
          console.log('User deleted from payment provider:', removedUser.id);
          // const res1 = await polarClient.subscriptions.revoke({
          //   id: event.data.id,
          // });
          // console.log('User deleted from payment provider:', res1);
        })
        .catch((err) => {
          console.error('Error deleting user from payment provider:', err);
        });
    });
  },
);
