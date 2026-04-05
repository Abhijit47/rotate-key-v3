import { buttonVariants } from '@/components/ui/button';
import { PropertyListing } from '@/features/property/components/property-listings';
import { prefetchUserProperty } from '@/features/property/server/prefetch';
import { requireAuth } from '@/lib/requireAuth';
import { HydrateClient } from '@/trpc/server';
import { ArrowLeftCircle } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export default async function PropertyPage(props: PageProps<'/property/[id]'>) {
  await requireAuth();

  const propertyId = (await props.params).id;
  if (!propertyId) {
    notFound();
  }

  prefetchUserProperty(propertyId);

  return (
    <HydrateClient>
      <ErrorBoundary
        fallback={<div>Something went wrong loading the property.</div>}>
        <main
          className={
            'max-w-(--breakpoint-xl) mx-auto px-4 2xl:px-0 space-y-8 py-8'
          }>
          <div>
            <Link
              prefetch
              href={'/swapings'}
              className={buttonVariants({
                variant: 'outline',
                size: 'sm',
              })}>
              <ArrowLeftCircle className={'size-4'} />
              Back to Swapings
            </Link>
          </div>

          <section>
            <h1 className={'text-3xl font-bold mb-4'}>Property Details</h1>

            <Suspense fallback={<div>Loading Property...</div>}>
              <PropertyListing propertyId={propertyId} />
            </Suspense>
          </section>
        </main>
      </ErrorBoundary>
    </HydrateClient>
  );
}
