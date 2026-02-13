'use server';

import locales from '@/i18n/locales';
import { inngest } from '@/inngest/client';
import { Locale } from 'next-intl';
import { cookies } from 'next/headers';
import { sleep } from './utils';

export async function changeLocaleAction(locale: Locale) {
  if (!locales.includes(locale)) {
    throw new Error(`Invalid locale: ${locale}`);
  }

  const cookieStore = await cookies();

  cookieStore.set('locale', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
  });
}

export async function mockSignUpWithInngest() {
  // Send your event payload to Inngest
  await inngest.send({
    name: 'test/hello.world',
    data: {
      email: 'testUser@example.com',
    },
  });
}
export async function mockSignUpWithOutInngest() {
  const startTime = Date.now();
  await sleep(1000);

  await sleep(5000);

  await sleep(10000);
  const endTime = Date.now();

  // we could return the start time and end time to show the difference in the UI
  return { startTime, endTime };
}
