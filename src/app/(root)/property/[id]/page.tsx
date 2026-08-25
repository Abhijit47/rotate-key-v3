import { ArrowLeftCircle } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { after } from 'next/server';
import { Suspense } from 'react';

import { Button, buttonVariants } from '@/components/ui/button';
import BookingForm from '@/features/booking/components/booking-form';
import { PropertyDetails } from '@/features/property/components/property-details';
import { PropertyErrorBoundary } from '@/features/property/components/property-listings';
import { prefetchPropertyDetails } from '@/features/property/server/prefetch';
import { requireAuth } from '@/lib/requireAuth';
import { HydrateClient, caller } from '@/trpc/server';

export async function clearCache(
  pathName: string,
  type: 'layout' | 'page' = 'page',
) {
  console.log(`Revalidating cache for tag: ${pathName}`);
  revalidatePath(pathName, type);
  return;
}

export const dynamic = 'force-dynamic';

const isDev = process.env.NODE_ENV === 'development';

export default async function PropertyPage(props: PageProps<'/property/[id]'>) {
  await requireAuth();

  const propertyId = (await props.params).id;
  if (!propertyId) {
    return notFound();
  }

  prefetchPropertyDetails(propertyId);

  // add view to a property on page load (after render layout)
  after(async () => {
    await caller.engagement.addViewsToProperty({
      propertyId,
      path: `/property/${propertyId}`,
    });
  });

  return (
    <HydrateClient>
      <PropertyErrorBoundary fallBackText='Something went wrong loading the property details.'>
        <div
          className={
            'max-w-(--breakpoint-xl) mx-auto px-4 2xl:px-0 space-y-8 py-8'
          }>
          <div className='flex justify-between items-center'>
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

            {isDev ? (
              <form
                action={async () => {
                  'use server';
                  await clearCache(`/(root)/property/${propertyId}`, 'page');
                }}>
                <Button size={'xs'} variant={'destructive'}>
                  Clear cache
                </Button>
              </form>
            ) : null}
          </div>

          <div className={'grid grid-cols-12 gap-6'}>
            <main className={'col-span-full lg:col-span-8'}>
              <Suspense fallback={<div>Loading Property...</div>}>
                <PropertyDetails propertyId={propertyId} />
              </Suspense>
            </main>

            <aside className={'col-span-full lg:col-span-4'}>
              <BookingForm />
            </aside>
          </div>
        </div>
      </PropertyErrorBoundary>
    </HydrateClient>
  );
}
