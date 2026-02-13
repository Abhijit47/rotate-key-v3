import { Formats, Locale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import locales from './locales';

export const formats = {
  dateTime: {
    short: {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
  },
  number: {
    precise: {
      maximumFractionDigits: 5,
    },
  },
  list: {
    enumeration: {
      style: 'long',
      type: 'conjunction',
    },
  },
} satisfies Formats;

export default getRequestConfig(async (params) => {
  const store = await cookies();

  const rawLocale = params.locale || store.get('locale')?.value || 'en';
  const locale = locales.includes(rawLocale as Locale)
    ? (rawLocale as Locale)
    : 'en';
  const messages = (await import(`../../locales/${locale}.json`))
    .default as Awaited<Promise<typeof import('../../locales/en.json')>>;

  return {
    locale,
    messages,
    formats,
  };
});
