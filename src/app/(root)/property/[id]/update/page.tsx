import UpdatePropertyForm from '@/features/property/components/update-property-form';
import { prefetchUserProperty } from '@/features/property/server/prefetch';
import { requireAuth } from '@/lib/requireAuth';
import { HydrateClient } from '@/trpc/server';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export default async function UpdateProperty(
  props: PageProps<'/property/[id]/update'>,
) {
  await requireAuth();
  const propertyId = (await props.params).id;
  if (!propertyId) {
    notFound();
  }

  prefetchUserProperty(propertyId);

  return (
    <HydrateClient>
      <ErrorBoundary
        fallback={
          <div>Something went wrong loading the property for update.</div>
        }>
        <main
          className={
            'max-w-(--breakpoint-xl) mx-auto px-4 2xl:px-0 space-y-8 py-8'
          }>
          <section>
            <h1 className={'text-3xl font-bold mb-4'}>Update Property</h1>
            <p>
              {`Please note that updating a property may affect its visibility in search results and swapings. Ensure that your property details are accurate and up-to-date to attract potential swappers.`}
              {propertyId}
            </p>
          </section>

          <section>
            <Suspense fallback={<div>Loading property details...</div>}>
              <UpdatePropertyForm propertyId={propertyId} />
            </Suspense>
          </section>
        </main>
      </ErrorBoundary>
    </HydrateClient>
  );
}
