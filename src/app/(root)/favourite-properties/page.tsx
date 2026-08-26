import { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

import SectionBanner from '@/components/shared/section-banner';
import { PropertyFilterProvider } from '@/contexts/property-filter-context';
import { FavoritePropertyListings } from '@/features/property/components/favorite-properties';
import { PropertyErrorBoundary } from '@/features/property/components/property-listings';
import { loadBasicFilterAndPaginateParams } from '@/features/property/searchParams';
import { prefetchUserFavouriteProperties } from '@/features/property/server/prefetch';
import { requireAuth } from '@/lib/requireAuth';
import { HydrateClient } from '@/trpc/server';

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function FavouritePropertiesPage({
  searchParams,
}: PageProps) {
  await requireAuth();

  // console.log("searchparams", await searchParams);

  const { offset, limit, sort } =
    await loadBasicFilterAndPaginateParams(searchParams);

  // console.log("PAGE", { offset, limit, sort });

  prefetchUserFavouriteProperties({ offset, limit, sort });

  return (
    <HydrateClient>
      <PropertyErrorBoundary fallBackText='Something went wrong loading favorite properties.'>
        <main
          className={
            'max-w-(--breakpoint-xl) mx-auto px-4 2xl:px-0 space-y-8 py-8'
          }>
          <SectionBanner
            description='"Find your dream home and make unforgettable memories."'
            buttonText='Explore Swapings'
            buttonLink='/swapings'>
            <span className={'text-primary'}>Rotate Keys</span>
            <span className={'text-muted dark:text-accent-foreground'}>
              {' '}
              : Favorite Properties
            </span>
          </SectionBanner>

          <section>
            <Suspense fallback={<div>Loading Listings...</div>}>
              <PropertyFilterProvider>
                <FavoritePropertyListings />
              </PropertyFilterProvider>
            </Suspense>
          </section>
        </main>
      </PropertyErrorBoundary>
    </HydrateClient>
  );
}
