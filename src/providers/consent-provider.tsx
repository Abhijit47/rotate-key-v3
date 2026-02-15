'use client';

import {
  ConsentManagerDialog,
  // ConsentManagerProvider,
  CookieBanner,
} from '@c15t/nextjs';
import type { ReactNode } from 'react';
// For client-only apps (non-SSR), you can use:
import { C15TDevTools } from '@c15t/dev-tools';
import { ConsentManagerProvider } from '@c15t/nextjs/client';
import { useLocale } from 'next-intl';
import { useTheme } from 'next-themes';

import { getTranslatedCookieBanner } from '@/constants/translations';
import { ConsentOptionsProvider } from './consent-options-provider';

/**
 * Server-side rendered consent management wrapper for Next.js App Router
 *
 * This component provides SSR-compatible consent management by separating
 * server-side configuration from client-side functionality. The server handles
 * initial setup and configuration, while client-side features (callbacks,
 * scripts) are delegated to the ConsentManagerClient component.
 *
 * @param props - Component properties
 * @param props.children - Child components to render within the consent manager context
 *
 * @returns The consent manager provider with banner, dialog, and client wrapper
 *
 * @remarks
 * This split architecture is necessary because certain options like callbacks
 * and scripts cannot be serialized during server-side rendering. For
 * client-only implementations, use `<ConsentManagerProvider />` from
 * `@c15t/nextjs/client`.
 *
 * @example
 * ```tsx
 * // In your root layout.tsx
 * import { ConsentManager } from './consent-manager';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <ConsentManager>
 *           {children}
 *         </ConsentManager>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
const isDev = process.env.NODE_ENV === 'development';

export function ConsentProvider({ children }: { children: ReactNode }) {
  const locale = useLocale();
  const { theme } = useTheme();

  const currentTheme = theme as 'light' | 'dark' | 'system';

  return (
    <ConsentManagerProvider
      options={{
        mode: 'c15t',
        backendURL: '/api/c15t',
        consentCategories: ['necessary', 'marketing'], // Optional: Specify which consent categories to show in the banner.
        ignoreGeoLocation: true, // Useful for development to always view the banner.
        translations: getTranslatedCookieBanner(locale), // Provide translations for the consent banner and dialog.
        react: {
          colorScheme: currentTheme,
        },
      }}>
      {isDev ? <C15TDevTools position='bottom-left' /> : null}

      <CookieBanner />
      <ConsentManagerDialog />
      <ConsentOptionsProvider>{children}</ConsentOptionsProvider>
    </ConsentManagerProvider>
  );
}
