import { Skeleton } from '@/components/ui/skeleton';
import { DynamicOptionsLoadingProps } from 'next/dynamic';
import { ReactNode } from 'react';
import ComponentLoadError from '../component-load-error';

export default function Step4Loader(
  loadingProps: DynamicOptionsLoadingProps,
): ReactNode {
  return <Step4LoaderComp {...loadingProps} />;
}

function Step4LoaderComp(props: DynamicOptionsLoadingProps) {
  const { pastDelay, error, isLoading, retry } = props || {};

  if (pastDelay) {
    return (
      <div className={'space-y-4 py-4'}>
        <div className={'grid grid-cols-1 gap-4'}>
          {Array.from({ length: 4 }).map((_, index) => (
            <div className={'space-y-2'} key={index}>
              <Skeleton className={'w-2/12 h-3'} />
              <Skeleton className={'w-6/12 h-2'} />
              <Skeleton className={'h-3 w-full'} />
            </div>
          ))}
        </div>

        <div className={'space-y-2'}>
          <Skeleton className={'w-2/12 h-3'} />
          <Skeleton className={'w-3/12 h-2'} />

          <div
            className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'}>
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                className={'space-y-2 border border-dashed rounded-lg p-4'}
                key={index}>
                <Skeleton className={'w-3/12 h-3'} />
                <Skeleton className={'h-2 w-full'} />
                <Skeleton className={'h-2 w-full'} />
                <Skeleton className={'h-2 w-full'} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return <ComponentLoadError error={error} retry={retry} />;
  }
  if (isLoading) {
    return (
      <div className={'space-y-4 py-4'}>
        <div className={'grid grid-cols-1 gap-4'}>
          {Array.from({ length: 4 }).map((_, index) => (
            <div className={'space-y-2'} key={index}>
              <Skeleton className={'w-2/12 h-3'} />
              <Skeleton className={'w-6/12 h-2'} />
              <Skeleton className={'h-3 w-full'} />
            </div>
          ))}
        </div>

        <div className={'space-y-2'}>
          <Skeleton className={'w-2/12 h-3'} />
          <Skeleton className={'w-3/12 h-2'} />

          <div
            className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'}>
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                className={'space-y-2 border border-dashed rounded-lg p-4'}
                key={index}>
                <Skeleton className={'w-3/12 h-3'} />
                <Skeleton className={'h-2 w-full'} />
                <Skeleton className={'h-2 w-full'} />
                <Skeleton className={'h-2 w-full'} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return null;
}
