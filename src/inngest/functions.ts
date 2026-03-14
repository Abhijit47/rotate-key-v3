import { format } from 'date-fns';
import { NonRetriableError } from 'inngest';
import { StreamChat, UserResponse } from 'stream-chat';

import { db } from '@/drizzle/db';
import { user } from '@/drizzle/schema';
import { env } from '@/env';
import { createSubscriber, sendWelcomeNotification } from '@/novu/functions';
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
