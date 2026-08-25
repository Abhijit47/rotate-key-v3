'use client';

import dynamic from 'next/dynamic';

import { Skeleton } from '@/components/ui/skeleton';

export const LazyHeroSearch = dynamic(() => import('./hero-search'), {
  ssr: false,
  loading: () => (
    <div className={'inline-grid place-items-center content-center'}>
      <Skeleton className='w-full h-9' />
    </div>
  ),
});

export const LazyKeyWordTags = dynamic(() => import('./keyword-tags'), {
  ssr: false,
  loading: () => (
    <div className={'absolute bottom-16 left-10 translate-y-1/2'}>
      <Skeleton className='w-full h-9' />
    </div>
  ),
});
