'use client';

import { Loader2Icon } from 'lucide-react';
import dynamic from 'next/dynamic';

import { Skeleton } from '@/components/ui/skeleton';

function DynamicLoader() {
  return (
    <div className={'w-full h-full flex items-center justify-center'}>
      <span className={'sr-only'}>Loading...</span>
      <span>
        <Loader2Icon className={'size-4 md:size-6 lg:size-8 animate-spin'} />
      </span>
    </div>
  );
}

export const LazyUserButton = dynamic(() => import('../user-button'), {
  ssr: false,
  loading: () => <Skeleton className='rounded-md size-8 animate-pulse' />,
});

export const CustomerFeedbackTestimonials = dynamic(
  () => import('../testimonials'),
  {
    ssr: false,
    loading: () => <DynamicLoader />,
  },
);

export const LazyNewsLetterForm = dynamic(() => import('../news-letter-form'), {
  ssr: false,
  loading: () => (
    <div className={'w-full flex flex-col items-start justify-start gap-2'}>
      <Skeleton className='rounded-full w-12 h-4' />
      <Skeleton className='rounded-full w-full h-9' />
      <Skeleton className='rounded-full w-24 h-8' />
    </div>
  ),
});
