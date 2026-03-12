import { db } from '@/drizzle/db';
import { createSubscriber, sendWelcomeNotification } from '@/novu/functions';
import { NonRetriableError } from 'inngest';
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
    await step.run('subscriber-creating', async () => {
      const subscriber = await createSubscriber(event.data);
      return subscriber.result;
    });

    await step.run('stream-user-creating', async () => {
      console.log('stream user creating for:', event.data.name);
    });

    await step.run('stream-user-token-creating', async () => {
      console.log('stream user token creating for:', event.data.name);
    });

    await step
      .run('find-the-user', async () => {
        return db.query.user.findFirst({
          where: (user, { eq }) => eq(user.email, event.data.email),
        });
      })
      .catch((err) => {
        if (err.name === 'UserNotFoundError') {
          throw new NonRetriableError('User no longer exists; stopping');
        }

        throw err;
      });
    
    // update the token,expiredAt,issuedAt for the user in the database
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
          welcomeNotification.result.status,
        );
      });
    } else {
      console.log('User is not onboarded yet, skipping welcome notification');
      // notify to the team that a user has signed up but not onboarded yet, so they can reach out to them and help them onboard
    }
  },
);
