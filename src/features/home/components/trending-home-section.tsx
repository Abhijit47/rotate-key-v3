import { HydrateClient } from '@/trpc/server';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import SectionBadge from '@/components/shared/section-badge';
import SectionHeading from '@/components/shared/section-heading';
import SectionWrapper from '@/components/shared/section-wrapper';
import TreandingHomeCarousel from './treanding-home-carousel';

export default function TrendingHomeSection() {
  return (
    <section className={'py-16'}>
      <SectionWrapper
        className={
          'space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10 xl:space-y-12'
        }>
        <div className='space-y-2 sm:space-y-4 md:space-y-6'>
          <SectionBadge align='left'>
            Top trending home of the week!
          </SectionBadge>

          <SectionHeading align='left' className={'text-foreground'}>
            <span className={'block'}>Have your eye on these,</span>
            <span className={'inline lg:block'}>
              Most liked Home of the Week
            </span>
          </SectionHeading>
        </div>

        <HydrateClient>
          <ErrorBoundary
            fallback={<div>Something went wrong try again later</div>}>
            <Suspense fallback={<div>Loading...</div>}>
              <TreandingHomeCarousel />
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </SectionWrapper>
    </section>
  );
}
