import { Skeleton } from '@/components/ui/skeleton';
import { DynamicOptionsLoadingProps } from 'next/dynamic';
import { ReactNode } from 'react';
import ComponentLoadError from '../component-load-error';

export default function Step6Loader(
  loadingProps: DynamicOptionsLoadingProps,
): ReactNode {
  return <Step6LoaderComp {...loadingProps} />;
}

function Step6LoaderComp(props: DynamicOptionsLoadingProps) {
  const { pastDelay, error, isLoading, retry } = props || {};

  if (pastDelay) {
    return (
      <div className={'grid grid-cols-1 md:grid-cols-2 gap-4 py-4'}>
        <div className={'space-y-2'}>
          <Skeleton className={'w-2/12 h-3'} />
          <Skeleton className={'h-9 w-full'} />
        </div>

        <div className={'min-h-75 border rounded-lg p-4 space-y-4'}>
          <Skeleton className={'w-full h-3'} />
          <Skeleton className={'w-full h-3'} />

          <div className={'flex flex-wrap items-center gap-3'}>
            {Array.from({ length: 9 }).map((_, index) => (
              <Skeleton className={'h-4 w-24'} key={index} />
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
      <div className={'grid grid-cols-1 md:grid-cols-2 gap-4 py-4'}>
        <div className={'space-y-2'}>
          <Skeleton className={'w-2/12 h-3'} />
          <Skeleton className={'h-9 w-full'} />
        </div>

        <div className={'min-h-75 border rounded-lg p-4 space-y-4'}>
          <Skeleton className={'w-full h-3'} />
          <Skeleton className={'w-full h-3'} />

          <div className={'flex flex-wrap items-center gap-3'}>
            {Array.from({ length: 9 }).map((_, index) => (
              <Skeleton className={'h-4 w-24'} key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }
  return null;
}
