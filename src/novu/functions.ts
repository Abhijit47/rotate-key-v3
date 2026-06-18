'use server';

import * as Sentry from '@sentry/nextjs';

import { type SelectUser } from '@/drizzle/schema';
import { type ServerSession } from '@/lib/auth';
import { novuClient } from './client';
import { env } from '@/env';

export async function createSubscriber(
  user: Pick<SelectUser, 'id' | 'name' | 'email'>,
) {
  const firstName = user.name.split(' ')[0];
  const lastName = user.name.split(' ')[1] || '';
  const subscriber = await novuClient.subscribers.create({
    subscriberId: user.id,
    firstName: firstName,
    lastName: lastName,
    email: user.email,
    phone: 'n/a',
    data: {
      address: 'n/a',
      membershipLevel: 'free',
      preferredTopics: ['News', 'Sports', 'Property'],
    },
  });

  return subscriber;
}

export async function deleteSubscriber(subscriberId: string) {
  const removeSubscriber = await novuClient.subscribers.delete(subscriberId);

  return removeSubscriber.result;
}

export type SendInAppNotification =
  | {
      // welcome
      payload: {
        workflowType: WorkflowTypes;
        user?: ServerSession['user'];
        propertyOwnerId?: never;
        propertyType?: never;
        propertyAddress?: never;
        matched?: never;
        swapRequest?: never;
      };
    }
  | {
      // skipped onboarding
      payload: {
        workflowType: WorkflowTypes;
        user?: ServerSession['user'];
        propertyOwnerId?: never;
        propertyType?: never;
        propertyAddress?: never;
        matched?: never;
        swapRequest?: never;
      };
    }
  | {
      // liked-property
      payload: {
        workflowType: WorkflowTypes;
        user?: ServerSession['user'];
        propertyOwnerId?: string;
        propertyType?: string;
        propertyAddress?: string;
        matched?: never;
        swapRequest?: never;
      };
    }
  | {
      // matched
      payload: {
        workflowType: WorkflowTypes;
        user?: never;
        propertyOwnerId?: never;
        propertyType?: never;
        propertyAddress?: never;
        matched?: {
          userId: string;
          userName: string;
          userFirstName: string | null;
          userLastName: string | null;
          userEmail: string;
          userContactNumber: string | null;
          oppositeUserName: string;
        };
        swapRequest?: never;
      };
    }
  | {
      // Incoming swap
      payload: {
        workflowType: WorkflowTypes;
        user?: never;
        propertyOwnerId?: never;
        propertyType?: never;
        propertyAddress?: never;
        matched?: never;
        swapRequest?: {
          initiatorId: string;
          userFirstName: string | null;
          userLastName: string | null;
          userEmail: string;
          userContactNumber: string | null | undefined;
          oppositeUserName: string;
          swapId: string;
          initiatorBookingId: string;
        };
      };
    };

// Unified function
export async function sendInAppNotification(props: SendInAppNotification) {
  const { payload } = props;
  const { user } = payload;

  switch (payload.workflowType) {
    case 'welcome-user': {
      if (!user) return;
      const firstName = user.firstName || user.name?.split(' ')[0];
      const lastName = user.lastName || user.name.split(' ')[1] || '';
      try {
        const result = await novuClient.trigger({
          to: {
            subscriberId: user.id,
            firstName,
            lastName,
            email: user.email,
            phone: user.contactNumber,
          },
          workflowId: payload.workflowType,
          payload: {
            workflowType: payload.workflowType,
            actionUrl: env.BETTER_AUTH_URL,
          },
        });
        console.log('Welcome notification sent:', result.result);
        Sentry.logger.info('Welcome notification result:', {
          res: result.result,
        });
        return;
      } catch (err) {
        console.log('Welcome notification err:', err);
        Sentry.captureException(err);
        Sentry.flush();
        return;
      }
    }

    case 'skipped-onboarding': {
      if (!user) return;
      const firstName = user.firstName || user.name?.split(' ')[0];
      const lastName = user.lastName || user.name.split(' ')[1] || '';
      try {
        const result = await novuClient.trigger({
          to: {
            subscriberId: user.id,
            firstName,
            lastName,
            email: user.email,
            phone: user.contactNumber,
          },
          workflowId: payload.workflowType,
          payload: {
            workflowType: payload.workflowType,
            actionUrl: `${env.BETTER_AUTH_URL}/onboarding`,
          },
        });
        console.log('Skipped onboading notification sent:', result.result);
        Sentry.logger.info('Skipped onboading notification result:', {
          res: result.result,
        });
        return;
      } catch (err) {
        console.log('Skipped onboading notification err:', err);
        Sentry.captureException(err);
        Sentry.flush();
        return;
      }
    }

    case 'liked-property': {
      if (!user) return;
      if (!payload.propertyOwnerId) return;

      const firstName = user.firstName || user.name.split(' ')[0];
      const lastName = user.lastName || user.name.split(' ')[1] || '';

      try {
        const result = await novuClient.trigger({
          workflowId: payload.workflowType,
          to: {
            subscriberId: payload.propertyOwnerId, // sent to owner
            firstName,
            lastName,
            email: user.email,
            phone: user.contactNumber,
          },
          payload: {
            workflowType: payload.workflowType,
            propertyType: payload.propertyType,
            propertyAddress: payload.propertyAddress,
            actionUrl: `${env.BETTER_AUTH_URL}/swapings`,
          },
        });
        console.log('Like notification result:', result.result);
        Sentry.logger.info('Like notification result:', {
          res: result.result,
        });
        return;
      } catch (err) {
        console.log('Like notification err:', err);
        Sentry.captureException(err);
        Sentry.flush();
        return;
      }
    }

    case 'matched': {
      if (!payload.matched) return;

      try {
        const result = await novuClient.trigger({
          workflowId: payload.workflowType,
          to: {
            subscriberId: payload.matched.userId,
            firstName:
              payload.matched.userFirstName ||
              payload.matched.userName.split(' ')[0],
            lastName:
              payload.matched.userLastName ||
              payload.matched.userName.split(' ')[1] ||
              '',
            email: payload.matched.userEmail,
            phone: payload.matched.userContactNumber || '',
          },
          payload: {
            workflowType: payload.workflowType,
            oppositeUserName: payload.matched.oppositeUserName,
            actionUrl: env.BETTER_AUTH_URL,
          },
        });
        console.log('Matched notification result:', result.result);
        Sentry.logger.info('Matched notification result:', {
          res: result.result,
        });
        return;
      } catch (err) {
        console.log('Matched notification err:', err);
        Sentry.captureException(err);
        Sentry.flush();
        return;
      }
    }

    case 'incoming-swap-request': {
      if (!payload.swapRequest) return;
      const { swapRequest } = payload;

      try {
        const result = await novuClient.trigger({
          workflowId: payload.workflowType,
          to: {
            subscriberId: swapRequest.initiatorId, // sent to owner
            firstName: swapRequest.userFirstName,
            lastName: swapRequest.userLastName,
            email: swapRequest.userEmail,
            phone: swapRequest.userContactNumber,
          },
          payload: {
            workflowType: payload.workflowType,
            oppositeUserName: swapRequest.oppositeUserName, // we have to find some how
            swapId: swapRequest.swapId,
            bookingId: swapRequest.initiatorBookingId, // initiator booking id
          },
        });
        console.log('Incoming notification result:', result.result);
        Sentry.logger.info('Incoming notification result:', {
          res: result.result,
        });
        return;
      } catch (err) {
        console.log('Incoming notification err:', err);
        Sentry.captureException(err);
        Sentry.flush();
        return;
      }
    }

    default:
      console.warn('No suitable workflow found for trigger');
      Sentry.captureException('No suitable workflow found for trigger');
      Sentry.flush();
      break;
  }
}
