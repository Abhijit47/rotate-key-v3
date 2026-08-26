import { PlusCircleIcon } from 'lucide-react';

import SectionBanner from '@/components/shared/section-banner';
import { EmptyPropertiesState } from '@/features/property/components/property-listings';

export default function MyExchangesPage() {
  return (
    <main
      className={
        'max-w-(--breakpoint-xl) mx-auto px-4 2xl:px-0 space-y-8 py-8'
      }>
      <SectionBanner
        description='"Keep track of your exchange history and know when your keys are available."'
        buttonText='Explore Swapings'
        buttonLink='/swapings'>
        <span className={'text-primary'}>Rotate Keys</span>
        <span className={'text-muted dark:text-accent-foreground'}>
          {' '}
          : My Exchanges
        </span>
      </SectionBanner>

      {/* TODO: Getting the successfull exchanges data will future coming */}
      <EmptyPropertiesState
        title='No Exchanges Found'
        description="You haven't made any exchanges yet. Click the button below to start making exchanges."
        buttonText='Make Exchange'
        buttonLink='/swapings'
        buttonIcon={<PlusCircleIcon size={20} />}
      />
    </main>
  );
}
