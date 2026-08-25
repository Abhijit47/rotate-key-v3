import { PlusCircleIcon } from 'lucide-react';

import { EmptyPropertiesState } from '@/features/property/components/property-listings';

export default function MyExchangesPage() {
  return (
    <main
      className={
        'max-w-(--breakpoint-xl) mx-auto px-4 2xl:px-0 space-y-8 py-8'
      }>
      <section>
        <h1 className={'text-3xl font-bold mb-4'}>My Exchanges</h1>
      </section>
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
