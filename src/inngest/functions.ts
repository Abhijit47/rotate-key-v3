import { format } from 'date-fns';
import { NonRetriableError } from 'inngest';
import { StreamChat, UserResponse } from 'stream-chat';

import { db } from '@/drizzle/db';
import { user } from '@/drizzle/schema';
import { env } from '@/env';
import { auth } from '@/lib/auth';
import { polarClient } from '@/lib/polar';
import {
  createSubscriber,
  deleteSubscriber,
  sendWelcomeNotification,
} from '@/novu/functions';
import { eq } from 'drizzle-orm';
import { inngest } from './client';

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
  { event: 'user/new.signup' },
  async ({ event, step }) => {
    const serverClient = StreamChat.getInstance(
      env.NEXT_PUBLIC_STREAM_API_KEY,
      env.STREAM_API_SECRET,
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

    // update the token,expiredAt,issuedAt for the user in the database
    await step.run('update-user-with-token', async () => {
      return db
        .update(user)
        .set({
          chatToken: streamResult.token,
          chatTokenExpireAt: new Date(streamResult.expireTime * 1000),
          chatTokenIssuedAt: new Date(streamResult.issuedAt * 1000),
        })
        .where(eq(user.id, foundUser.id));
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
        console.log('welcome notification sending for:', event.data.email);
        // send a welcome notification to the user
        const welcomeNotification = await sendWelcomeNotification(user);
        console.log(
          'welcome notification sent for:',
          event.data.email,
          welcomeNotification?.result?.status,
        );
      });
    } else {
      console.log('User is not onboarded yet, skipping welcome notification');
      // notify to the team that a user has signed up but not onboarded yet, so they can reach out to them and help them onboard
    }
  },
);

export const userCreated = inngest.createFunction(
  { id: 'admin-user-created' },
  { event: 'admin-user/created' },
  async ({ event, step }) => {
    const serverClient = StreamChat.getInstance(
      env.NEXT_PUBLIC_STREAM_API_KEY,
      env.STREAM_API_SECRET,
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
          chatTokenExpireAt: new Date(streamResult.expireTime * 1000),
          chatTokenIssuedAt: new Date(streamResult.issuedAt * 1000),
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
