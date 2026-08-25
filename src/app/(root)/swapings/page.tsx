import { SearchParams } from 'nuqs/server';
import { Suspense, ViewTransition } from 'react';

import { PropertyFilterProvider } from '@/contexts/property-filter-context';
import { PropertyErrorBoundary } from '@/features/property/components/property-listings';
import {
  SwapingsPropertyListings,
  SwappingBanner,
  SwappingCarousel,
  SwappingFilterByType,
} from '@/features/property/components/swaping-properties';
import { loadBasicFilterAddonParams } from '@/features/property/searchParams';
import { prefetchPublicProperties } from '@/features/property/server/prefetch';
import { requireAuth } from '@/lib/requireAuth';
import { HydrateClient } from '@/trpc/server';

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Swapings({ searchParams }: PageProps) {
  await requireAuth();

  // console.log("searchParams", await searchParams);

  const filters = await loadBasicFilterAddonParams(searchParams);

  // console.log({ filters });

  prefetchPublicProperties(filters);

  return (
    <HydrateClient>
      <PropertyErrorBoundary fallBackText='Something went wrong loading the swaping properties.'>
        <main
          className={
            'max-w-(--breakpoint-xl) mx-auto px-4 2xl:px-0 space-y-8 py-8'
          }>
          <SwappingBanner />

          <SwappingCarousel />

          <section>
            <Suspense
              fallback={
                <ViewTransition exit='slide-down' default='none'>
                  <div className='h-32'>Loading Swapings Filter...</div>
                </ViewTransition>
              }>
              <ViewTransition enter='slide-up' default='none'>
                <PropertyFilterProvider>
                  <SwappingFilterByType />
                </PropertyFilterProvider>
              </ViewTransition>
            </Suspense>
          </section>

          <section>
            <Suspense
              fallback={
                <ViewTransition exit='slide-down' default='none'>
                  <div className='h-32'>Loading Listings...</div>
                </ViewTransition>
              }>
              <ViewTransition enter='slide-up' default='none'>
                <PropertyFilterProvider>
                  <SwapingsPropertyListings />
                </PropertyFilterProvider>
              </ViewTransition>
            </Suspense>
          </section>
        </main>
      </PropertyErrorBoundary>
    </HydrateClient>
  );
}
