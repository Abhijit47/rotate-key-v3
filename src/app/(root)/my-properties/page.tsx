import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

import { PropertyFilterProvider } from '@/contexts/property-filter-context';
import MyPropertyListings from '@/features/property/components/my-properties';
import { PropertyErrorBoundary } from '@/features/property/components/property-listings';
import { loadBasicFilterAndPaginateParams } from '@/features/property/searchParams';
import { prefetchUserProperties } from '@/features/property/server/prefetch';
import { requireAuth } from '@/lib/requireAuth';
import { HydrateClient } from '@/trpc/server';

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function MyPropertiesPage({ searchParams }: PageProps) {
  await requireAuth();

  // console.log("searchparams", await searchParams);

  const { offset, limit, sort } =
    await loadBasicFilterAndPaginateParams(searchParams);

  // console.log("PAGE", { offset, limit, sort });

  prefetchUserProperties({ offset, limit, sort });

  return (
    <HydrateClient>
      <PropertyErrorBoundary fallBackText='Something went wrong loading my properties.'>
        <main
          className={
            'max-w-(--breakpoint-xl) mx-auto px-4 2xl:px-0 space-y-8 py-8'
          }>
          <section>
            <h1 className={'text-3xl font-bold mb-4'}>My Properties</h1>
          </section>

          <section>
            <Suspense fallback={<div>Loading Listings...</div>}>
              <PropertyFilterProvider>
                <MyPropertyListings />
              </PropertyFilterProvider>
            </Suspense>
          </section>
        </main>
      </PropertyErrorBoundary>
    </HydrateClient>
  );
}
