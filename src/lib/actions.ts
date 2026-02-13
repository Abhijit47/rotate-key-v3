'use server';

import locales from '@/i18n/locales';
import { Locale } from 'next-intl';
import { cookies } from 'next/headers';

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
