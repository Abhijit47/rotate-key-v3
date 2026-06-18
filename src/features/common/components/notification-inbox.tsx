import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import { toast } from 'sonner';
import { Inbox, ReactInboxAppearance } from '@novu/nextjs';
import { TRPCClientError } from '@trpc/client';
import {
  IconArrowBigDownLine,
  IconBellCog,
  IconSettings2,
} from '@tabler/icons-react';

import { useAcceptSwap, useRejectSwap } from '@/features/swap/hooks/use-swap';
import { env } from '@/env';

const appearance: ReactInboxAppearance = {
  elements: {
    inboxStatus__dropdownContent:
      'bg-background! text-foreground! dark:bg-grey-900! dark:text-foreground',
    popoverContent:
      'bg-background! text-foreground! dark:bg-grey-900! dark:text-foreground!',

    notificationBody: 'dark:text-foreground!',
    dropdownTrigger: 'text-primary!',
    dropdownContent: 'bg-background! text-primary!',
    // popoverTrigger: 'bg-primary!',
    preferencesListEmptyNotice: 'text-primary!',
    notificationListEmptyNotice: 'text-primary!',
    notificationArchive__button: 'text-primary!',
    notificationUnarchive__button: 'text-primary!',
    notificationSnooze__button: 'text-primary!',
    notificationRead__button: 'text-primary!',
    notificationUnread__button: 'text-primary!',
    notificationPrimaryAction__button:
      'bg-primary! text-white! border-none! outline-none!',
    notificationSecondaryAction__button:
      'bg-secondary! text-primary! border-none! outline-none!',
  },
  icons: {
    cogs: () => <IconSettings2 className='text-primary' />,
    arrowDown: () => <IconArrowBigDownLine className='text-primary' />,
    bell: () => <IconBellCog className={'text-primary'} />,
  },
};

declare global {
  interface NotificationData {
    workflowType: WorkflowTypes;
    actionUrl: string;
    swapId?: string;
    bookingId?: string;
  }
}

type NotificationInboxProps = {
  subscriberHash: string | null | undefined;
  userId: string;
};

export default function NotificationInbox({
  subscriberHash,
  userId,
}: NotificationInboxProps) {
  const router = useRouter();
  const { mutateAsync: acceptSwapAsync } = useAcceptSwap();
  const { mutateAsync: rejectSwapAsync } = useRejectSwap();

  // TODO: will handle check properly later
  if (subscriberHash && subscriberHash == null) return null;

  return (
    <Inbox
      applicationIdentifier={env.NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER}
      subscriber={userId}
      subscriberHash={subscriberHash!}
      routerPush={(path: string) => router.push(path as Route)}
      onNotificationClick={(notification) => {
        // your logic to handle notification click
        const data = notification?.data;
        if (!data) return;

        switch (data.workflowType) {
          case 'welcome-user':
            router.push(data.actionUrl as Route);
            break;

          case 'skipped-onboarding':
            router.push(data.actionUrl as Route);
            break;

          case 'liked-property':
            router.push(data.actionUrl as Route);
            return;

          case 'matched':
            router.push(data.actionUrl as Route);
            break;

          case 'incoming-swap-request':
            break;

          default:
            console.log('No suitable option found!!! Try Again');
            break;
        }
      }}
      onPrimaryActionClick={(notification) => {
        // your logic to handle primary action click
        const data = notification?.data;
        if (!data) return;

        switch (data.workflowType) {
          case 'welcome-user':
            router.push(data.actionUrl as Route);
            break;

          case 'skipped-onboarding':
            router.push(data.actionUrl as Route);
            break;

          case 'liked-property':
            router.push(data.actionUrl as Route);
            break;

          case 'matched':
            break;

          case 'incoming-swap-request': {
            const { swapId, bookingId } = data;
            if (!swapId || !bookingId) return;

            toast.promise(
              acceptSwapAsync({
                swapId: swapId,
                bookingId: bookingId,
              }),
              {
                loading: 'Processing Swap Request',
                success: async () => {
                  await notification.read();
                  await notification.seen();
                  await notification.completePrimary();
                  await notification.archive();
                  await notification.completeSecondary();
                  return 'Swap Request Accepted';
                },
                error: (err) => {
                  if (err instanceof TRPCClientError) {
                    return err.message;
                  }
                  return err.message || 'Failed to accept swap request';
                },
                description: 'Please wait for the swap request to be processed',
                descriptionClassName: 'text-[10px]',
              },
            );
            return;
          }

          default:
            console.log('No suitable option found!!! Try Again');
            break;
        }
      }}
      onSecondaryActionClick={(notification) => {
        // your logic to handle secondary action click
        const data = notification?.data;
        if (!data) return;

        switch (data.workflowType) {
          case 'welcome-user':
            break;

          case 'skipped-onboarding':
            break;

          case 'matched':
            break;

          case 'liked-property':
            break;

          case 'incoming-swap-request': {
            const { swapId } = data;
            if (!swapId) return;

            toast.promise(
              rejectSwapAsync({
                swapId: swapId,
              }),
              {
                loading: 'Processing Swap Reject Request',
                success: async () => {
                  await notification.read();
                  await notification.seen();
                  await notification.completePrimary();
                  await notification.archive();
                  await notification.completeSecondary();
                  return 'Swap Request Rejected';
                },
                error: (err) => {
                  if (err instanceof TRPCClientError) {
                    return err.message;
                  }
                  return err.message || 'Failed to reject swap request';
                },
                description: 'Please wait for the swap request to be processed',
                descriptionClassName: 'text-[10px]',
              },
            );
            return;
          }

          default:
            console.log('No suitable option found!!! Try Again');
            break;
        }
      }}
      appearance={appearance}
    />
  );
}

/**
 * TODO: Make the notificationHash in user table and user-config default undefined not null, so that we can check the length easily
 *  otherwise notificationHash: string | null | undefined its little bit hard to check the length
 */

//** FUTURE UPDATE */ Line 65 passes only the raw user ID to subscriber. To prevent subscriber impersonation, Novu requires HMAC authentication: generate a SHA256 hash of the subscriber ID using your server-side NOVU_SECRET_KEY, then pass it via the subscriberHash prop alongside subscriber. Create an API endpoint that computes this hash after authenticating the user, return it to the client, and update the Inbox component to accept both props. Ensure HMAC encryption is enabled in your Novu Dashboard settings.
