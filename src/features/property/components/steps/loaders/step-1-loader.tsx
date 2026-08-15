import { Skeleton } from '@/components/ui/skeleton';
import { DynamicOptionsLoadingProps } from 'next/dynamic';
import { ReactNode } from 'react';
import ComponentLoadError from '../component-load-error';

export default function Step1Loader(
  loadingProps: DynamicOptionsLoadingProps,
): ReactNode {
  return <Step1LoaderComp {...loadingProps} />;
}

function Step1LoaderComp(props: DynamicOptionsLoadingProps) {
  const { pastDelay, error, isLoading, retry } = props || {};

  if (pastDelay) {
    return (
      <div className={'grid grid-cols-1 md:grid-cols-2 gap-4'}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div className={'space-y-2'} key={index}>
            <Skeleton className={'w-1/12 h-3'} />
            <Skeleton className={'w-2/12 h-2'} />
            <Skeleton className={'h-8 w-full'} />
          </div>
        ))}
      </div>
    );
  }
  if (error) {
    return <ComponentLoadError error={error} retry={retry} />;
  }
  if (isLoading) {
    return (
      <div className={'grid grid-cols-1 md:grid-cols-2 gap-4'}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div className={'space-y-2'} key={index}>
            <Skeleton className={'w-1/12 h-3'} />
            <Skeleton className={'w-2/12 h-2'} />
            <Skeleton className={'h-8 w-full'} />
          </div>
        ))}
      </div>
    );
  }
  return null;
}
