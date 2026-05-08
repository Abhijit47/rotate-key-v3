'use client';

import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { IconExclamationCircle } from '@tabler/icons-react';
import Link from 'next/link';

import { useErrorBoundary } from 'react-error-boundary';

export default function ErrorChatState() {
  const { error, resetBoundary } = useErrorBoundary();

  return (
    <div
      className={'flex h-screen w-full flex-col items-center justify-between'}>
      <Empty className='h-full'>
        <EmptyHeader>
          <EmptyMedia variant='icon' className='animate-pulse mb-4'>
            <IconExclamationCircle
              className={'size-8 md:size-12 lg:size-16 xl:size-20'}
            />
          </EmptyMedia>
          <EmptyTitle>Oops! Something went wrong.</EmptyTitle>
          <EmptyDescription className='max-w-xs text-pretty text-xs text-destructive'>
            {error instanceof Error
              ? error.message
              : 'An unknown error occurred.'}
          </EmptyDescription>
        </EmptyHeader>

        <EmptyContent className='flex-row justify-center gap-2'>
          <Button onClick={resetBoundary}>Try Again</Button>
          <Button variant='outline' asChild>
            <Link href={'/'}>Go Back</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
