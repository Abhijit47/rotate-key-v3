'use client';

import {
  ConsentBanner,
  ConsentDialog,
  ConsentManagerProvider,
} from '@c15t/nextjs';
import { type ReactNode } from 'react';

export default function ConsentManagerClient({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ConsentManagerProvider
      options={{
        mode: 'hosted',
        backendURL: 'https://your-instance.c15t.dev',
        consentCategories: ['necessary', 'measurement', 'marketing'],
        // Shows banner during development. Remove for production.
        overrides: { country: 'DE' },
      }}>
      <ConsentBanner />
      <ConsentDialog />
      {children}
    </ConsentManagerProvider>
  );
}
