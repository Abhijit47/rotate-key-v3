'use client';

import { env } from '@/env';
import { Bell, Inbox, Notifications } from '@novu/nextjs';

import { useSession } from '@/lib/auth-client';
import {
  IconArrowBigDownLine,
  IconBellCog,
  IconSettings2,
} from '@tabler/icons-react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Skeleton } from '../ui/skeleton';

const appearance = {
  icons: {
    cogs: () => <IconSettings2 />,
    arrowDown: () => <IconArrowBigDownLine />,
    bell: () => <IconBellCog />,
  },
};

export default function NotificationInbox() {
  const { data,isPending,isRefetching } = useSession();
  
  if (isPending || isRefetching) {
    return <Skeleton className='h-10 w-10 rounded-full' />;
  }

  return (
    <Inbox
      applicationIdentifier={env.NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER}
      subscriber={data?.user.id}
      appearance={appearance}>
      <Popover>
        <PopoverTrigger asChild>
          <Button size={'icon-sm'} variant={'outline'}>
            <Bell />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='h-150 w-100 p-0'>
          <Notifications />
        </PopoverContent>
      </Popover>
    </Inbox>
  );
}
