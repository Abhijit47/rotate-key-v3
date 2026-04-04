import { env } from '@/env';
import { Bell, Inbox, Notifications } from '@novu/nextjs';
import {
  IconArrowBigDownLine,
  IconBellCog,
  IconSettings2,
} from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const appearance = {
  icons: {
    cogs: () => <IconSettings2 />,
    arrowDown: () => <IconArrowBigDownLine />,
    bell: () => <IconBellCog className={'text-background'} />,
  },
};

export default function NotificationInbox({ userId }: { userId: string }) {
  return (
    <Inbox
      applicationIdentifier={env.NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER}
      subscriber={userId}
      appearance={appearance}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size={'icon-sm'}
            variant={'outline'}
            aria-label='Open notifications'>
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

//** FUTURE UPDATE */ Line 34 passes only the raw user ID to subscriber. To prevent subscriber impersonation, Novu requires HMAC authentication: generate a SHA256 hash of the subscriber ID using your server-side NOVU_SECRET_KEY, then pass it via the subscriberHash prop alongside subscriber. Create an API endpoint that computes this hash after authenticating the user, return it to the client, and update the Inbox component to accept both props. Ensure HMAC encryption is enabled in your Novu Dashboard settings.
