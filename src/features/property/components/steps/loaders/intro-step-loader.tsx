import { Skeleton } from '@/components/ui/skeleton';
import { DynamicOptionsLoadingProps } from 'next/dynamic';
import { ReactNode } from 'react';
import ComponentLoadError from '../component-load-error';

export default function IntroLoader(
  loadingProps: DynamicOptionsLoadingProps,
): ReactNode {
  return <IntroLoaderComp {...loadingProps} />;
}

function IntroLoaderComp(props: DynamicOptionsLoadingProps) {
  const { pastDelay, error, isLoading, retry } = props || {};

  if (pastDelay) {
    return (
      <div
        className={
          'border-2 border-dashed rounded-lg flex flex-col gap-4 items-center justify-center'
        }>
        <Skeleton className='size-8' />
        <Skeleton className='w-2/12 h-3' />

        <Skeleton className={'w-2/12 h-3'} />
        <Skeleton className={'w-3/12 h-3'} />

        <div className='flex flex-col md:flex-row justify-center gap-2'>
          {Array.from({ length: 2 }).map((_, idx) => (
            <Skeleton key={idx} className='h-8 w-32 rounded-lg' />
          ))}
        </div>

        <Skeleton className='w-2/12 h-6' />
      </div>
    );
  }
  if (error) {
    return <ComponentLoadError error={error} retry={retry} />;
  }
  if (isLoading) {
    return (
      <div
        className={
          'border-2 border-dashed rounded-lg flex flex-col gap-4 items-center justify-center'
        }>
        <Skeleton className='size-8' />
        <Skeleton className='w-2/12 h-3' />

        <Skeleton className={'w-2/12 h-3'} />
        <Skeleton className={'w-3/12 h-3'} />

        <div className='flex flex-col md:flex-row justify-center gap-2'>
          {Array.from({ length: 2 }).map((_, idx) => (
            <Skeleton key={idx} className='h-8 w-32 rounded-lg' />
          ))}
        </div>

        <Skeleton className='w-2/12 h-6' />
      </div>
    );
  }
  return null;
}
