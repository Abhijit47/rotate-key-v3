import { TrendingUpIcon } from 'lucide-react';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import SectionBadge from '@/components/shared/section-badge';
import SectionHeading from '@/components/shared/section-heading';
import SectionWrapper from '@/components/shared/section-wrapper';
import { HydrateClient } from '@/trpc/server';
import TreandingHomeCarousel from './treanding-home-carousel';

export default function TrendingHomeSection() {
  return (
    <section className={'py-16'}>
      <SectionWrapper
        className={
          'space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10 xl:space-y-12'
        }>
        <div className='space-y-2 sm:space-y-4 md:space-y-6'>
          <SectionBadge
            align='left'
            className='flex justify-start items-center gap-2 bg-foreground dark:bg-foreground w-fit text-background dark:text-background'>
            Top trending home of the week!
            <TrendingUpIcon className='stroke-accent' />
          </SectionBadge>

          <SectionHeading
            align='left'
            className={'text-foreground font-display'}>
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
