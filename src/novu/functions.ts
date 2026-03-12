'use server';

import { ServerSession } from '@/lib/auth';
import { novuClient } from './client';

export async function createSubscriber(user: ServerSession['user']) {
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

export async function sendWelcomeNotification(user: ServerSession['user']) {
  const firstName = user.name.split(' ')[0];
  const lastName = user.name.split(' ')[1] || '';
  const welcomeNotification = await novuClient.trigger({
    to: {
      subscriberId: user.id,
      firstName,
      lastName,
      email: user.email,
      phone: 'n/a',
    },
    workflowId: 'welcome-user',
    payload: {
      name: firstName,
    },
  });

  return welcomeNotification;
}
