import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { Card } from '@/components/ui/card';
import { PropertyContextProvider } from '@/contexts/property-context';
import { LazyNewPropertyFormSidebar } from '@/features/property/components/lazy';
import { PropertySidebarOpenButton } from '@/features/property/components/property-form-sidebar';
import UpdatePropertyFrom from '@/features/property/components/update-property';
import { prefetchPropertyDetailsForUpdate } from '@/features/property/server/prefetch';
import { requireAuth } from '@/lib/requireAuth';
import { HydrateClient } from '@/trpc/server';

export default async function UpdateProperty(
  props: PageProps<'/property/[id]/update'>,
) {
  await requireAuth();
  const propertyId = (await props.params).id;
  if (!propertyId) {
    notFound();
  }

  prefetchPropertyDetailsForUpdate(propertyId);

  return (
    <HydrateClient>
      <ErrorBoundary
        fallback={
          <div>Something went wrong loading the property for update.</div>
        }>
        {/* <main
          className={
            'max-w-(--breakpoint-xl) mx-auto px-4 2xl:px-0 space-y-8 py-8'
          }>
          <section>
            <h1 className={'text-3xl font-bold mb-4'}>Update Property</h1>
            <p>
              {`Please note that updating a property may affect its visibility in search results and swapings. Ensure that your property details are accurate and up-to-date to attract potential swappers.`}
              {propertyId}
            </p>
          </section> */}

        <main>
          <Suspense
            fallback={
              <div className='h-[calc(100dvh-4.9rem)] w-full flex items-center justify-center'>
                Loading property update form...
              </div>
            }>
            <PropertyContextProvider propertyId={propertyId}>
              <div className='relative grid grid-cols-12 h-[calc(100dvh-4.9rem)]'>
                <LazyNewPropertyFormSidebar />
                <div className='relative col-span-full xl:col-span-9 overflow-x-hidden'>
                  <PropertySidebarOpenButton />

                  <section className='h-full'>
                    <Card className='gap-2 shadow-none px-0 rounded-none w-full h-full'>
                      <UpdatePropertyFrom />
                    </Card>
                  </section>
                </div>
              </div>
            </PropertyContextProvider>
          </Suspense>
        </main>
        {/* </main> */}
      </ErrorBoundary>
    </HydrateClient>
  );
}
