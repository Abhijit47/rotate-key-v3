import { Locale } from '@/i18n/locales';
import { formats } from '@/i18n/request';
import messages from '../locales/en.json';

declare module 'next-intl' {
  interface AppConfig {
    Locale: Locale;
    Messages: typeof messages;
    Formats: typeof formats;
  }
}
