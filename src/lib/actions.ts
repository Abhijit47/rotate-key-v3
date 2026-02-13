'use server';

import { Locale } from 'next-intl';
import { cookies } from 'next/headers';

export async function changeLocaleAction(locale: Locale) {
  const cookieStore = await cookies();

  cookieStore.set('locale', locale);
}
