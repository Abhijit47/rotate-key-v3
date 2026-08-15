'use client';

import dynamic from 'next/dynamic';

import { buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export const LazyNewPropertyForm = dynamic(() => import('./new-property'), {
  ssr: false,
  loading: () => (
    <div className='relative col-span-full xl:col-span-9 overflow-x-hidden'>
      <Skeleton className='w-full h-full' />
    </div>
  ),
});

export const LazyNewPropertyFormSidebar = dynamic(
  () => import('./property-form-sidebar'),
  {
    ssr: false,
    loading: () => (
      <div className='hidden xl:block space-y-4 xl:col-span-3 p-4 h-full'>
        <Skeleton className='w-full h-16' />
        <Skeleton
          className={buttonVariants({
            size: 'sm',
            className: 'w-full',
          })}
        />
        <Skeleton
          className={buttonVariants({
            size: 'sm',
            className: 'w-full',
          })}
        />
        <Skeleton
          className={buttonVariants({
            size: 'sm',
            className: 'w-full',
          })}
        />
        <Skeleton
          className={buttonVariants({
            size: 'sm',
            className: 'w-full',
          })}
        />
      </div>
    ),
  },
);
