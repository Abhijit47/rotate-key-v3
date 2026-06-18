'use client';

import {
  IconArchiveFilled,
  IconBellRinging,
  IconCheckbox,
  IconChecklist,
  IconClock,
  IconEyeCheck,
  IconArchive,
} from '@tabler/icons-react';
import { EllipsisVerticalIcon } from 'lucide-react';
import { useEffect, useRef, useTransition } from 'react';
import Link from 'next/link';
import { formatDistance } from 'date-fns';
import { Route } from 'next';
import Image from 'next/image';
import {
  type Notification,
  useNotifications,
  useNovu,
  NovuProvider,
} from '@novu/react';

import { env } from '@/env';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { LazyNotificationsList, LazyNotificationsParentActions } from './lazy';
import { formatMarkdownText } from '@/lib/utils';

const sampleNotifications = [
  {
    id: '6a32b80759bfa9fe5b9b3c8f',
    transactionId: 'txn_6a32b807onknspirt2qf',
    subject: 'Incoming Swap Request from **James horne**',
    body: 'Hey, ***Serena*** you got a swap request from ***James horne***, if you interested to swap your property with ***James horne***, you can accpet the request from ***James horne***, to continue the next process. Thanks for choosing our platform. Stay Happy 😉.',
    to: {
      id: '6a30bf587b4dd86a4cfb8add',
      firstName: 'Serena',
      lastName: 'Chaney',
      subscriberId: 'abfe01df-f7ab-4444-979a-b1325dcbedbd',
    },
    isRead: false,
    isSeen: true,
    isArchived: false,
    isSnoozed: false,
    deliveredAt: ['2026-06-17T15:06:47.833Z'],
    createdAt: '2026-06-17T15:06:47.836Z',
    firstSeenAt: '2026-06-17T15:34:32.246Z',
    avatar: 'https://dashboard.novu.co/images/info-2.svg',
    primaryAction: {
      label: 'Accept Request',
      isCompleted: false,
    },
    secondaryAction: {
      label: 'Reject Request',
      isCompleted: false,
    },
    channelType: 'in_app',
    tags: ['engagements'],
    data: {
      workflowType: 'incoming-swap-request',
      swapId: 'ed679618-d7ac-4592-a7c9-6c200db5afdf',
      bookingId: 'd3d0eb85-3c01-4260-bdf5-d5ddb672e70b',
    },
    workflow: {
      critical: false,
      id: '6a3243f3df488dc706f7468b',
      identifier: 'incoming-swap-request',
      name: 'Incoming Swap Request',
      tags: ['engagements'],
      severity: 'none',
    },
    severity: 'none',
  },
  {
    id: '6a32b69eb484bd81a1fc4b1a',
    transactionId: 'txn_6a32b6963ryhhtnfmanz',
    subject: 'Incoming Swap Request from **James horne**',
    body: 'Hey, ***Serena*** you got a swap request from ***James horne***, if you interested to swap your property with ***James horne***, you can accpet the request from ***James horne***, to continue the next process. Thanks for choosing our platform. Stay Happy 😉.',
    to: {
      id: '6a30bf587b4dd86a4cfb8add',
      firstName: 'Serena',
      lastName: 'Chaney',
      subscriberId: 'abfe01df-f7ab-4444-979a-b1325dcbedbd',
    },
    isRead: false,
    isSeen: true,
    isArchived: false,
    isSnoozed: false,
    deliveredAt: ['2026-06-17T15:00:46.881Z'],
    createdAt: '2026-06-17T15:00:46.884Z',
    firstSeenAt: '2026-06-17T15:34:32.246Z',
    avatar: 'https://dashboard.novu.co/images/info-2.svg',
    primaryAction: {
      label: 'Accept Request',
      isCompleted: false,
    },
    secondaryAction: {
      label: 'Reject Request',
      isCompleted: false,
    },
    channelType: 'in_app',
    tags: ['engagements'],
    data: {
      workflowType: 'incoming-swap-request',
      swapId: '8ecb8f69-f7db-4b2b-9e27-fae2ca58c9f1',
      bookingId: 'd3d0eb85-3c01-4260-bdf5-d5ddb672e70b',
    },
    workflow: {
      critical: false,
      id: '6a3243f3df488dc706f7468b',
      identifier: 'incoming-swap-request',
      name: 'Incoming Swap Request',
      tags: ['engagements'],
      severity: 'none',
    },
    severity: 'none',
  },
  {
    id: '6a32a095ac63f903f2b2385c',
    transactionId: 'txn_6a32a094xcsv33vf23uf',
    subject: 'Incoming Swap Request from **James horne**',
    body: 'Hey, ***Serena*** you got a swap request from ***James horne***, if you interested to swap your property with ***James horne***, you can accpet the request from ***James horne***, to continue the next process. Thanks for choosing our platform. Stay Happy 😉.',
    to: {
      id: '6a30bf587b4dd86a4cfb8add',
      firstName: 'Serena',
      lastName: 'Chaney',
      subscriberId: 'abfe01df-f7ab-4444-979a-b1325dcbedbd',
    },
    isRead: false,
    isSeen: true,
    isArchived: false,
    isSnoozed: false,
    deliveredAt: ['2026-06-17T13:26:45.206Z'],
    createdAt: '2026-06-17T13:26:45.209Z',
    firstSeenAt: '2026-06-17T13:27:37.657Z',
    avatar: 'https://dashboard.novu.co/images/info-2.svg',
    primaryAction: {
      label: 'Accept Request',
      isCompleted: false,
    },
    secondaryAction: {
      label: 'Reject Request',
      isCompleted: false,
    },
    channelType: 'in_app',
    tags: ['swap', 'accept', 'reject'],
    data: {
      workflowType: 'incoming-swap-request',
      swapId: 'bb2d207e-3a70-4a2a-84a9-2b3a895b1349',
      bookingId: 'd3d0eb85-3c01-4260-bdf5-d5ddb672e70b',
    },
    workflow: {
      critical: false,
      id: '6a3243f3df488dc706f7468b',
      identifier: 'incoming-swap-request',
      name: 'Incoming Swap Request',
      tags: ['engagements'],
      severity: 'none',
    },
    severity: 'none',
  },
  {
    id: '6a329ea64c8b020326c24c1d',
    transactionId: 'txn_6a329ea596nb2arguxcl',
    subject: 'Matched Confirmed',
    body: 'Hey ***Serena*** you matched with ***James horne***, Go ahead for next process, Happy Swaping 🔃.',
    to: {
      id: '6a30bf587b4dd86a4cfb8add',
      firstName: 'Serena',
      lastName: 'Chaney',
      subscriberId: 'abfe01df-f7ab-4444-979a-b1325dcbedbd',
    },
    isRead: false,
    isSeen: true,
    isArchived: false,
    isSnoozed: false,
    deliveredAt: ['2026-06-17T13:18:30.350Z'],
    createdAt: '2026-06-17T13:18:30.351Z',
    firstSeenAt: '2026-06-17T13:18:42.224Z',
    avatar: 'https://dashboard.novu.co/images/confetti.svg',
    channelType: 'in_app',
    tags: ['like'],
    redirect: {
      url: 'http://localhost:3000',
      target: '_self',
    },
    data: {
      workflowType: 'matched',
      actionUrl: 'http://localhost:3000',
    },
    workflow: {
      critical: false,
      id: '6a315648036ca8c21440d487',
      identifier: 'matched',
      name: 'Matched',
      tags: ['engagements'],
      severity: 'none',
    },
    severity: 'none',
  },
  {
    id: '6a329e8ccb91cff2298cce8f',
    transactionId: 'txn_6a329e8c43g4e0x60c05',
    subject: 'James Likes 👍🏻 Your Property',
    body: "**James** likes your **Apartment** property, \nLet's try to connect, for further discussion.\n**Request Details:**\nProperty Type: ***Apartment***\nProperty Address: 123, main st, pune, maharashtra, 000000",
    to: {
      id: '6a30bf587b4dd86a4cfb8add',
      firstName: 'Serena',
      lastName: 'Chaney',
      subscriberId: 'abfe01df-f7ab-4444-979a-b1325dcbedbd',
    },
    isRead: false,
    isSeen: true,
    isArchived: false,
    isSnoozed: false,
    deliveredAt: ['2026-06-17T13:18:04.751Z'],
    createdAt: '2026-06-17T13:18:04.752Z',
    firstSeenAt: '2026-06-17T13:18:42.224Z',
    avatar: 'https://dashboard.novu.co/images/bell.svg',
    primaryAction: {
      label: "See James's Property List ↗️",
      isCompleted: false,
    },
    channelType: 'in_app',
    tags: ['like'],
    redirect: {
      url: 'http://localhost:3000/swapings',
      target: '_self',
    },
    data: {
      workflowType: 'liked-property',
      actionUrl: 'http://localhost:3000/swapings',
    },
    workflow: {
      critical: false,
      id: '68389d0272a126f2bc36bdcb',
      identifier: 'liked-property',
      name: 'Liked Property',
      tags: ['engagements'],
      severity: 'none',
    },
    severity: 'none',
  },
];

type NotificationsWrapperProps = {
  subscriber: string;
  subscriberHash: string;
};

// Wrapper component with NovuProvider
export function NotificationsWrapper(props: NotificationsWrapperProps) {
  const { subscriber, subscriberHash } = props;
  return (
    <NovuProvider
      applicationIdentifier={env.NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER}
      subscriber={subscriber}
      subscriberHash={subscriberHash}
    >
      <Card className='gap-4'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <IconBellRinging className='size-4' />
            <h3 className='font-semibold'>Your Notifications</h3>
          </CardTitle>
          <CardDescription>
            Here you can see your all notifications.
          </CardDescription>

          <LazyNotificationsParentActions />
        </CardHeader>

        <Separator />

        <CardContent className='space-y-4 px-4'>
          <LazyNotificationsList />
        </CardContent>
      </Card>
    </NovuProvider>
  );
}

export function NotificationsList() {
  const observerTarget = useRef<HTMLDivElement | null>(null);
  const { notifications, hasMore, isLoading, fetchMore, error } =
    useNotifications();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchMore();
        }
      },
      { threshold: 0.5 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, fetchMore]);

  if (isLoading || !notifications)
    return (
      <>
        {Array.from({ length: 5 }).map((_, idx) => (
          <NotificationItemSkeleton key={idx} />
        ))}
      </>
    );
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      {notifications.map((item) => {
        return (
          <NotificationItem
            key={item.id}
            notification={item}
            isLoading={isLoading}
          />
        );
      })}

      {hasMore && <div ref={observerTarget} className='h-10' />}
    </>
  );
}

export function NotificationItem({
  notification,
  isLoading,
}: {
  notification: Notification;
  isLoading: boolean;
}) {
  const [isReadPending, startReadTransition] = useTransition();
  const [isArchivePending, startArchiveTransition] = useTransition();
  const [isSnoozePending, startSnoozeTransition] = useTransition();
  const [isSeenPending, startSeenTransition] = useTransition();

  const novu = useNovu();

  const markAsRead = () => {
    startReadTransition(async () => {
      try {
        await novu.notifications.read({ notificationId: notification.id });
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
      return;
    });
  };

  const markAsSeen = () => {
    startSeenTransition(async () => {
      try {
        await novu.notifications.seen({ notificationId: notification.id });
      } catch (error) {
        console.error('Failed to mark as seen:', error);
      }
      return;
    });
  };

  const markAsArchive = () => {
    startArchiveTransition(async () => {
      try {
        await novu.notifications.archive({ notificationId: notification.id });
      } catch (error) {
        console.error('Failed to archive:', error);
      }
      return;
    });
  };

  const markAsSnooze = () => {
    // Snooze for 1 hour from now
    const snoozeDate = new Date();
    snoozeDate.setHours(snoozeDate.getHours() + 1);

    startSnoozeTransition(async () => {
      try {
        await novu.notifications.snooze({
          notificationId: notification.id,
          snoozeUntil: snoozeDate.toISOString(),
        });
      } catch (error) {
        console.error('Failed to archive:', error);
      }
      return;
    });
  };

  const isPending =
    isReadPending || isArchivePending || isSnoozePending || isSeenPending;

  const formattedDate = formatDistance(
    // item?.deliveredAt[0] || new Date(Date.now()),
    notification.createdAt,
    new Date(Date.now()),
    {
      includeSeconds: true,
      addSuffix: true,
    },
  );

  const url =
    (notification?.data?.actionUrl as Route) ??
    notification.redirect?.url ??
    '/';

  return (
    <Card key={notification.id} className='gap-1 p-3'>
      <CardHeader className='px-3 pb-0!'>
        <Link
          href={url}
          className='cursor-pointer flex items-center gap-2 w-full z-0'
        >
          <div>
            <Image
              src={
                notification?.avatar ??
                'https://dashboard.novu.co/images/info-2.svg'
              }
              alt='notification-avatar'
              height={32}
              width={32}
              className='w-full h-full'
            />
          </div>
          <div>
            <CardTitle
              className='font-medium text-sm sm:text-base'
              dangerouslySetInnerHTML={{
                __html: formatMarkdownText(notification?.subject),
              }}
            />
            <CardDescription>
              <span className='text-xs inline-flex items-center gap-1'>
                <IconClock className='size-3' />
                {formattedDate}
              </span>
            </CardDescription>
          </div>
        </Link>

        <CardAction className='z-10'>
          <Popover>
            <PopoverTrigger asChild>
              <Button size={'icon-xs'} variant='outline' disabled={isLoading}>
                <EllipsisVerticalIcon className='size-4' />
              </Button>
            </PopoverTrigger>
            <PopoverContent align='end' className='w-fit flex flex-col p-2'>
              <Button
                size={'xs'}
                variant={'outline'}
                className='justify-start'
                onClick={markAsRead}
                disabled={isPending}
              >
                <IconCheckbox />
                Mark as Read
              </Button>
              <Separator className='my-1' />
              <Button
                size={'xs'}
                variant={'outline'}
                className='justify-start'
                onClick={markAsSeen}
                disabled={isPending}
              >
                <IconEyeCheck /> Mark as Seen
              </Button>
              <Separator className='my-1' />
              <Button
                size={'xs'}
                variant={'outline'}
                className='justify-start'
                onClick={markAsArchive}
                disabled={isPending}
              >
                <IconArchive /> Mark as Archive
              </Button>
              <Separator className='my-1' />
              <Button
                size={'xs'}
                variant={'outline'}
                className='justify-start'
                onClick={markAsSnooze}
                disabled={isPending}
              >
                <IconClock /> Mark as Snooze
              </Button>
            </PopoverContent>
          </Popover>
        </CardAction>
      </CardHeader>

      <CardContent className='space-y-3 px-3'>
        <Link href={url} className='cursor-pointer block w-full'>
          <CardDescription
            className='text-xs sm:text-sm'
            dangerouslySetInnerHTML={{
              __html: formatMarkdownText(notification.body),
            }}
          />
        </Link>

        {/* Stay way these button from Link */}
        {/* Here is one problem check the sampleNotifications data above which notifications have no key "primaryAction", "secondaryAction" those time button print in UI but no text, maybe below checks are not working as expected*/}
        {'primaryAction' && 'secondaryAction' in notification ? (
          <CardAction className='justify-self-start space-x-2'>
            <Button
              size={'xs'}
              variant={'default'}
              className='cursor-pointer disabled:cursor-not-allowed'
              disabled={notification.primaryAction?.isCompleted}
            >
              {notification.primaryAction?.label}
            </Button>
            <Button
              size={'xs'}
              variant={'outline'}
              className='cursor-pointer disabled:cursor-not-allowed'
              disabled={notification.secondaryAction?.isCompleted}
            >
              {notification.secondaryAction?.label}
            </Button>
          </CardAction>
        ) : 'primaryAction' in notification ? (
          <Button
            size={'xs'}
            variant={'default'}
            className='cursor-pointer disabled:cursor-not-allowed'
            disabled={notification.primaryAction?.isCompleted}
          >
            {notification.primaryAction?.label}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function NotificationsParentActions() {
  const novu = useNovu();
  const [isReadAllPending, startReadAllTransition] = useTransition();
  const [isArchiveAllPending, startArchiveAllTransition] = useTransition();
  const [isSeenAllPending, startSeenAllTransition] = useTransition();
  const [isArchiveAllReadPending, startArchiveAllReadTransition] =
    useTransition();

  const markAsReadAll = () => {
    startReadAllTransition(async () => {
      const { error } = await novu.notifications.readAll();
      if (error) {
        console.error('Failed to mark all as read:', error);
      }
      return;
    });
  };

  const markAsArchiveAll = () => {
    startArchiveAllTransition(async () => {
      const { error } = await novu.notifications.archiveAll();
      if (error) {
        console.error('Failed to archive all:', error);
      }
      return;
    });
  };

  const markAsSeenAll = () => {
    startSeenAllTransition(async () => {
      const { error } = await novu.notifications.seenAll();
      if (error) {
        console.error('Failed to mark all as seen:', error);
      }
      return;
    });
  };

  const markAsArchiveAllRead = () => {
    startArchiveAllReadTransition(async () => {
      const { error } = await novu.notifications.archiveAllRead();
      if (error) {
        console.error('Failed to archive read notifications:', error);
      }
      return;
    });
  };

  const isPending =
    isReadAllPending ||
    isArchiveAllPending ||
    isSeenAllPending ||
    isArchiveAllReadPending;

  return (
    <CardAction>
      <Popover>
        <PopoverTrigger asChild>
          <Button size={'icon-sm'} variant='outline'>
            <EllipsisVerticalIcon className='size-4' />
          </Button>
        </PopoverTrigger>
        <PopoverContent align='end' className='w-fit flex flex-col p-2'>
          <Button
            size={'xs'}
            variant={'outline'}
            className='justify-start'
            onClick={markAsReadAll}
            disabled={isPending}
          >
            <IconChecklist />
            Mark All as Read
          </Button>
          <Separator className='my-1' />
          <Button
            size={'xs'}
            variant={'outline'}
            className='justify-start'
            onClick={markAsSeenAll}
            disabled={isPending}
          >
            <IconEyeCheck /> Mark All as Seen
          </Button>
          <Separator className='my-1' />
          <Button
            size={'xs'}
            variant={'outline'}
            className='justify-start'
            onClick={markAsArchiveAll}
            disabled={isPending}
          >
            <IconArchive /> Archive All
          </Button>
          <Separator className='my-1' />
          <Button
            size={'xs'}
            variant={'outline'}
            className='justify-start'
            onClick={markAsArchiveAllRead}
            disabled={isPending}
          >
            <IconArchiveFilled /> Archive All Read
          </Button>
        </PopoverContent>
      </Popover>
    </CardAction>
  );
}

export function NotificationItemSkeleton() {
  return (
    <Card className='gap-1 p-3'>
      <CardHeader className='px-3 pb-0!'>
        <div className='flex items-center gap-2'>
          <Skeleton className='size-10 rounded-full' />
          <div className='space-y-2'>
            <Skeleton className='h-3 w-[250px]' />
            <Skeleton className='h-3 w-[200px]' />
          </div>
        </div>
        <CardAction>
          <Skeleton className='size-6' />
        </CardAction>
      </CardHeader>
      <CardContent className='space-y-2 px-3'>
        <CardDescription className='space-y-1.5'>
          <Skeleton className='h-3 w-full' />
          <Skeleton className='h-3 w-xl' />
          <Skeleton className='h-3 w-lg' />
        </CardDescription>

        <CardAction className='flex items-center justify-self-start space-x-2'>
          <Skeleton className='w-28 h-6' />
          <Skeleton className='w-28 h-6' />
        </CardAction>
      </CardContent>
    </Card>
  );
}
