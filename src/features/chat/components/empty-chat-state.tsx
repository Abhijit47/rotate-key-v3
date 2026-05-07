import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { IconLock, IconMessage2Off } from '@tabler/icons-react';

export default function EmptyChatState() {
  return (
    <div
      className={
        'flex h-full w-full flex-col items-center justify-between select-none pointer-events-none transition-opacity animate-slide-out'
      }>
      <div>&nbsp;</div>

      <Empty className='h-full'>
        <EmptyHeader>
          <EmptyMedia variant='icon' className='animate-pulse'>
            <IconMessage2Off
              className={'size-8 md:size-12 lg:size-16 xl:size-20'}
            />
          </EmptyMedia>
          <EmptyTitle>No messages yet</EmptyTitle>
          <EmptyDescription className='max-w-xs text-pretty text-xs'>
            It looks like there are no messages yet. Start the conversation by
            sending a message
          </EmptyDescription>
        </EmptyHeader>
      </Empty>

      <div className={'text-center pb-2'}>
        <p className={'flex items-center gap-2 text-xs text-muted-foreground'}>
          <IconLock className={'size-4'} />
          Your messages are end-to-end encrypted
        </p>
      </div>
    </div>
  );
}
