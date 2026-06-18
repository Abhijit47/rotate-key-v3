'use client';

import dynamic from 'next/dynamic';

import { NotificationItemSkeleton } from '.';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export const LazyNotificationsWrapper = dynamic(
  () => import('.').then((mod) => mod.NotificationsWrapper),
  {
    ssr: false,
    loading: () => (
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Skeleton className='size-4' />
            <Skeleton className='h-4 w-36' />
          </CardTitle>
          <CardDescription>
            <Skeleton className='h-3 w-48' />
          </CardDescription>

          <CardAction>
            <Skeleton className='size-8' />
          </CardAction>
        </CardHeader>

        <Separator />

        <CardContent className='space-y-4 px-4'>
          {Array.from({ length: 5 }).map((_, idx) => (
            <NotificationItemSkeleton key={idx} />
          ))}
        </CardContent>
      </Card>
    ),
  },
);

export const LazyNotificationsList = dynamic(
  () => import('.').then((mod) => mod.NotificationsList),
  {
    ssr: false,
    loading: () => (
      <>
        {Array.from({ length: 5 }).map((_, idx) => (
          <NotificationItemSkeleton key={idx} />
        ))}
      </>
    ),
  },
);

export const LazyNotificationsParentActions = dynamic(
  () => import('.').then((mod) => mod.NotificationsParentActions),
  {
    ssr: false,
    loading: () => <Skeleton className='size-8' />,
  },
);
