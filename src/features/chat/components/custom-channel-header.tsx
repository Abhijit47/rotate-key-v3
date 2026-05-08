import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  useChannelPreviewInfo,
  useChannelStateContext,
  useTypingContext,
} from 'stream-chat-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import LocaleToggler from '@/features/common/components/locale-toggler';
import ThemeToggler from '@/features/common/components/theme-toggler';
import { IconArrowRightFromArc, IconLogout } from '@tabler/icons-react';
import { DotIcon } from 'lucide-react';
import ComposerStatus from './composer-status';
import CustomAvatar from './custom-avatar';

export const CustomChannelHeader = () => {
  const { channel, channelConfig } = useChannelStateContext();
  const { typing } = useTypingContext();
  const { displayTitle, displayImage } = useChannelPreviewInfo({ channel });
  const hasTyping =
    channelConfig?.typing_events !== false &&
    Object.values(typing ?? {}).some(({ parent_id }) => !parent_id);

  const date = channel?.lastKeyStroke;
  // const lastSeenDate = channel.lastMessage()?.created_at;

  const formattedLastSeen = date
    ? new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(date))
    : 'No messages yet';

  return (
    <header className='bg-background flex h-(--header-height) shrink-0 items-center justify-between gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) lg:px-6 sticky top-0 z-10'>
      <SidebarTrigger className='-ml-1' />

      <p className='text-sm font-medium flex flex-col items-center'>
        <span className={'capitalize'}>{displayTitle}</span>
        <span>
          {hasTyping ? (
            <span className='text-xs font-normal text-muted-foreground'>
              {displayTitle} is typing...
            </span>
          ) : (
            <span className='text-xs font-normal text-muted-foreground'>
              Last seen: {formattedLastSeen}
            </span>
          )}
        </span>
      </p>

      <Popover>
        <PopoverTrigger asChild>
          <button className='flex items-center rounded-full transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary size-8'>
            <CustomAvatar
              size={'md'}
              imageUrl={displayImage}
              userName={displayTitle || 'Channel Avatar'}
              className='rounded-full!'
            />
          </button>
        </PopoverTrigger>
        <PopoverContent align='end' className='w-48 p-2'>
          <div className={'flex items-center justify-between'}>
            <Badge variant={'outline'} className={'capitalize'}>
              {displayTitle}
            </Badge>
            <span className={'size-10'}>
              <DotIcon className='size-full text-green-500 animate-pulse' />
            </span>
          </div>

          <Separator className={'mb-2'} />
          <ComposerStatus />
          <Separator className={'my-2'} />

          <div className={'flex items-center justify-between'}>
            <ThemeToggler />
            <LocaleToggler />
          </div>

          <Separator className={'my-2'} />

          <div className={'flex flex-col gap-2'}>
            {/* TODO: Implement later */}
            <Button
              variant={'secondary'}
              className={'w-full text-sm!'}
              size={'xs'}>
              <IconArrowRightFromArc className='size-4' />
              Go Back
            </Button>
            {/* TODO: Implement later */}
            <Button
              variant={'destructive'}
              className={'w-full text-sm!'}
              size={'xs'}>
              <IconLogout className='size-4' />
              Log Out
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </header>
  );
};
