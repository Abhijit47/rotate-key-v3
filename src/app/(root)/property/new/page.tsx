import { Card } from '@/components/ui/card';
import { PropertyContextProvider } from '@/contexts/property-context';
import {
  LazyNewPropertyForm,
  LazyNewPropertyFormSidebar,
} from '@/features/property/components/lazy';
import { PropertySidebarOpenButton } from '@/features/property/components/property-form-sidebar';
import { HydrateClient } from '@/trpc/server';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export default function NewPropertyPage() {
  return (
    <HydrateClient>
      <ErrorBoundary
        fallback={
          <div>Something went wrong loading the new property form.</div>
        }>
        <Suspense
          fallback={
            <div className='h-[calc(100dvh-4.9rem)] w-full flex items-center justify-center'>
              Loading...
            </div>
          }>
          <PropertyContextProvider>
            <div className='relative grid grid-cols-12 h-[calc(100dvh-4.9rem)]'>
              <LazyNewPropertyFormSidebar />
              <main className='relative col-span-full xl:col-span-9 overflow-x-hidden'>
                <PropertySidebarOpenButton />

                <section className='h-full'>
                  <Card className='gap-2 shadow-none px-0 rounded-none w-full h-full'>
                    <LazyNewPropertyForm />
                  </Card>
                </section>
              </main>
            </div>
          </PropertyContextProvider>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
