'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from './ui/skeleton';

export const LazyNotificationButton = dynamic(
  () => import('./shared/notification-inbox'),
  {
    ssr: false,
    loading: () => <Skeleton className='size-8 rounded-md animate-pulse' />,
  },
);
