'use server';

import locales from '@/i18n/locales';
import { inngest } from '@/inngest/client';
import { Locale } from 'next-intl';
import { cookies } from 'next/headers';
import { polarClient } from './polar';
import { sleep } from './utils';

// export function getRequiredEnv(
//   name: 'POLAR_SANDBOX_ORGANIZATION_ID' | 'POLAR_PRODUCTION_ORGANIZATION_ID',
// ) {
//   const value = process.env[name];
//   if (!value || value.trim() === '') {
//     throw new Error(`Missing required environment variable: ${name}`);
//   }
//   return value;
// }

const sandBoxOrganizationId = '687f74cd-fba2-483d-8f1f-fd2856236ef9';
const productionOrganizationId = '295cccff-c03f-453f-92d7-5e8dd1588acd';
const isDev = process.env.NODE_ENV === 'development';
const orgId = isDev ? sandBoxOrganizationId : productionOrganizationId;

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

export async function fetchPolarProducts() {
  const result = await polarClient.products.list({
    organizationId: orgId,
  });

  return result;
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
