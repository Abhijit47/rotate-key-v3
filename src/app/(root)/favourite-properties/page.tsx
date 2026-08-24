import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { SearchParams } from "nuqs/server";

import { prefetchUserFavouriteProperties } from "@/features/property/server/prefetch";
import { requireAuth } from "@/lib/requireAuth";
import { HydrateClient } from "@/trpc/server";
import { loadBasicFilterAndPaginateParams } from "@/features/property/searchParams";
import { PropertyFilterProvider } from "@/contexts/property-filter-context";
import { FavoritePropertyListings } from "@/features/property/components/favorite-properties";

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
      <ErrorBoundary
        fallback={<div>Something went wrong loading favorite properties.</div>}
      >
        <main
          className={
            "max-w-(--breakpoint-xl) mx-auto px-4 2xl:px-0 space-y-8 py-8"
          }
        >
          <section>
            <h1 className={"text-3xl font-bold mb-4"}>Favorite Properties</h1>
          </section>

          <section>
            <Suspense fallback={<div>Loading Listings...</div>}>
              <PropertyFilterProvider>
                <FavoritePropertyListings />
              </PropertyFilterProvider>
            </Suspense>
          </section>
        </main>
      </ErrorBoundary>
    </HydrateClient>
  );
}
