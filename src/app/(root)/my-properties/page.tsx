import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { MyPropertyListings } from '@/features/property/components/property-listings';
import { prefetchUserProperties } from '@/features/property/server/prefetch';
import { requireAuth } from '@/lib/requireAuth';
import { HydrateClient } from '@/trpc/server';

export default async function MyPropertiesPage() {
  await requireAuth();
  prefetchUserProperties();

  return (
    <HydrateClient>
      <ErrorBoundary
        fallback={<div>Something went wrong loading my properties.</div>}>
        <main
          className={
            'max-w-(--breakpoint-xl) mx-auto px-4 2xl:px-0 space-y-8 py-8'
          }>
          <section>
            <h1 className={'text-3xl font-bold mb-4'}>My Properties</h1>
          </section>

          <section>
            <Suspense fallback={<div>Loading Listings...</div>}>
              <MyPropertyListings />
            </Suspense>
          </section>
        </main>
      </ErrorBoundary>
    </HydrateClient>
  );
}
