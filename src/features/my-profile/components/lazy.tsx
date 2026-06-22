'use client';

import { buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';

export const LazyPreviewProfileDocument = dynamic(
  () => import('./preview-profile-document'),
  {
    ssr: false,
    loading: () => {
      return (
        <Skeleton
          className={buttonVariants({
            className: 'w-full',
            variant: 'secondary',
            size: 'sm',
          })}
        />
      );
    },
  },
);

export const LazyUploadProfileDocumentDialog = dynamic(
  () => import('./upload-profile-document-dialog'),
  {
    ssr: false,
    loading: () => {
      return (
        <Skeleton
          className={buttonVariants({
            className: 'w-full',
            variant: 'secondary',
            size: 'sm',
          })}
        />
      );
    },
  },
);
