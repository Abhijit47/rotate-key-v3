// import { fetchPolarProducts } from '@/lib/actions';

import { unstable_cache as cache } from 'next/cache';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import SimplePricing from '@/features/pricing/components/simple-pricing';
import { polarClient } from '@/lib/polar';
import { HydrateClient } from '@/trpc/server';

const getCachedPlans = cache(
  async () => {
    const products = await polarClient.products.list({
      limit: 10,
      page: 1,
      sorting: ['-created_at'],
    });

    return products;
  },
  ['plans'],
  {
    revalidate: 60 * 60 * 24, // 24 hours
  },
);

export default async function PricingPage() {
  // const result = await fetchPolarProducts();
  // console.log('result', JSON.stringify(result.result.items, null, 2));

  const plans = await getCachedPlans();

  // console.log("plans", JSON.stringify(plans, null, 2));

  // const planNames = plans.result.items
  //   .filter((item) => {
  //     const isArchived = item.isArchived;

  //     if (isArchived) return;

  //     return item;
  //   })
  //   .map((item) => {
  //     // plan name with price []
  //     return {
  //       name: item.name,
  //       prices: item.prices.length,
  //     };
  //   });

  const filteredPlans = plans.result.items.filter((item) => {
    const isArchived = item.isArchived;

    if (isArchived) return;

    return item;
  });

  // console.log("planNames", JSON.stringify(planNames, null, 2));

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Something went wrong try again later</div>}>
        <main>
          <Suspense fallback={<div>Loading...</div>}>
            {/* <pre className="bg-card p-4 rounded-md w-full font-sans text-left">
              {JSON.stringify(filteredPlans, null, 2)}
            </pre> */}
            <SimplePricing plans={filteredPlans} />
          </Suspense>
        </main>
      </ErrorBoundary>
    </HydrateClient>
  );
}
