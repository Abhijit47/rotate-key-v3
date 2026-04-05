import { PropertyListings } from '@/features/property/components/property-listings';
import { prefetchPublicProperties } from '@/features/property/server/prefetch';
import { requireAuth } from '@/lib/requireAuth';
import { HydrateClient } from '@/trpc/server';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export default async function Swapings() {
  await requireAuth();
  prefetchPublicProperties();

  return (
    <HydrateClient>
      <ErrorBoundary
        fallback={<div>Something went wrong loading the properties.</div>}>
        <main
          className={
            'max-w-(--breakpoint-xl) mx-auto px-4 2xl:px-0 space-y-8 py-8'
          }>
          <section>
            <h1 className={'text-3xl font-bold mb-4'}>Swapings</h1>
          </section>

          <section>
            <Suspense fallback={<div>Loading Listings...</div>}>
              <PropertyListings />
            </Suspense>
          </section>
        </main>
      </ErrorBoundary>
    </HydrateClient>
  );
}
