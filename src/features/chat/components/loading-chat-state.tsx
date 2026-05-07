import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Progress } from '@/components/ui/progress';
import { IconLock, IconMessage } from '@tabler/icons-react';

export default function LoadingChatState({ progress }: { progress: number }) {
  return (
    <div
      className={
        'flex h-dvh w-full flex-col items-center justify-between select-none pointer-events-none'
      }>
      <div>&nbsp;</div>
      <Empty className='h-full'>
        <EmptyHeader>
          <EmptyMedia variant='icon' className='animate-pulse'>
            <IconMessage
              className={'size-8 md:size-12 lg:size-16 xl:size-20'}
            />
          </EmptyMedia>
          <EmptyTitle>Loading your chats</EmptyTitle>
        </EmptyHeader>
        <EmptyContent>
          <Progress value={progress} className='w-full' />
        </EmptyContent>
        <EmptyDescription className='max-w-xs text-pretty text-xs'>
          <p
            className={'flex items-center gap-2 text-xs text-muted-foreground'}>
            <IconLock className={'size-4'} />
            Your messages are end-to-end encrypted
          </p>
        </EmptyDescription>
      </Empty>
      <div className={'pb-4'}>
        {/* TODO: Will implement later */}
        <Button variant={'secondary'} size={'sm'} className={'rounded-full!'}>
          Log Out
        </Button>
      </div>
    </div>
  );
}
