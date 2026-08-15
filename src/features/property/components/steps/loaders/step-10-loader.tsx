import { Skeleton } from '@/components/ui/skeleton';
import { DynamicOptionsLoadingProps } from 'next/dynamic';
import { ReactNode } from 'react';
import ComponentLoadError from '../component-load-error';

export default function Step10Loader(
  loadingProps: DynamicOptionsLoadingProps,
): ReactNode {
  return <Step10LoaderComp {...loadingProps} />;
}

function Step10LoaderComp(props: DynamicOptionsLoadingProps) {
  const { pastDelay, error, isLoading, retry } = props || {};

  if (pastDelay) {
    return (
      <div className={'space-y-4'}>
        <div
          className={
            'min-h-48 flex flex-col gap-2 items-center justify-center border border-dashed rounded-lg p-4'
          }>
          <Skeleton className={'size-8 rounded-full'} />
          <Skeleton className={'h-3 w-3/12'} />
          <Skeleton className={'h-2 w-3/12'} />
          <Skeleton className={'h-2 w-3/12'} />
          <Skeleton className={'h-9 w-32'} />
        </div>
      </div>
    );
  }
  if (error) {
    return <ComponentLoadError error={error} retry={retry} />;
  }
  if (isLoading) {
    return (
      <div className={'space-y-4'}>
        <div
          className={
            'min-h-48 flex flex-col gap-2 items-center justify-center border border-dashed rounded-lg p-4'
          }>
          <Skeleton className={'size-8 rounded-full'} />
          <Skeleton className={'h-3 w-3/12'} />
          <Skeleton className={'h-2 w-3/12'} />
          <Skeleton className={'h-2 w-3/12'} />
          <Skeleton className={'h-9 w-32'} />
        </div>
      </div>
    );
  }
  return null;
}
