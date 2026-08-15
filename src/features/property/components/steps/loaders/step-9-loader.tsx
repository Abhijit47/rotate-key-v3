import { Skeleton } from '@/components/ui/skeleton';
import { DynamicOptionsLoadingProps } from 'next/dynamic';
import { ReactNode } from 'react';
import ComponentLoadError from '../component-load-error';

export default function Step9Loader(
  loadingProps: DynamicOptionsLoadingProps,
): ReactNode {
  return <Step9LoaderComp {...loadingProps} />;
}

function Step9LoaderComp(props: DynamicOptionsLoadingProps) {
  const { pastDelay, error, isLoading, retry } = props || {};

  if (pastDelay) {
    return (
      <div className={'space-y-2'}>
        <Skeleton className={'w-3/12 h-3'} />
        <Skeleton className={'h-9 w-full'} />
        <Skeleton className={'w-2/12 h-2'} />
      </div>
    );
  }
  if (error) {
    return <ComponentLoadError error={error} retry={retry} />;
  }
  if (isLoading) {
    return (
      <div className={'space-y-2'}>
        <Skeleton className={'w-3/12 h-3'} />
        <Skeleton className={'h-9 w-full'} />
        <Skeleton className={'w-2/12 h-2'} />
      </div>
    );
  }
  return null;
}
