'use client';

import { LazyStreamChatInterface } from '.';

import { IconFolderCode, IconInnerShadowTop } from '@tabler/icons-react';
import { ArrowUpRightIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useCustomChatContext } from '@/contexts/chat-context';
import ThemeToggler from '@/features/common/components/theme-toggler';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChannelList, Chat } from 'stream-chat-react';
import { useMatchedUser } from '../hooks/use-chat';

export function EmptyDemo() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant='icon'>
          <IconFolderCode />
        </EmptyMedia>
        <EmptyTitle>No Projects Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any projects yet. Get started by creating
          your first project.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className='flex-row justify-center gap-2'>
        <Button>Create Project</Button>
        <Button variant='outline'>Import Project</Button>
      </EmptyContent>
      <Button
        variant='link'
        asChild
        className='text-muted-foreground'
        size='sm'>
        <a href='#'>
          Learn More <ArrowUpRightIcon />
        </a>
      </Button>
    </Empty>
  );
}

export function ChatUILoading() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant='icon'>
          <IconFolderCode />
        </EmptyMedia>
        <EmptyTitle>Loading Chat Interface...</EmptyTitle>
        <EmptyDescription>
          Please wait while we load the chat interface for you.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className='flex-row justify-center gap-2'>
        <Button>Create Project</Button>
        <Button variant='outline'>Import Project</Button>
      </EmptyContent>
      <Button
        variant='link'
        asChild
        className='text-muted-foreground'
        size='sm'>
        <a href='#'>
          Learn More <ArrowUpRightIcon />
        </a>
      </Button>
    </Empty>
  );
}

export function ChatUIError() {
  const router = useRouter();

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant='icon'>
          <IconFolderCode />
        </EmptyMedia>
        <EmptyTitle>Loading Chat Interface...</EmptyTitle>
        <EmptyDescription>
          Please wait while we load the chat interface for you.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className='flex-row justify-center gap-2'>
        <Button type='button' onClick={() => router.refresh()}>
          Retry
        </Button>
        <Button
          type='button'
          variant='outline'
          onClick={() => router.push('/chat')}>
          Go Back to Chat List
        </Button>
      </EmptyContent>
    </Empty>
  );
}

type Props = {
  user: {
    id: string;
    fullName: string;
    avatar: string | null | undefined;
    streamToken: string | null | undefined;
    expireTime: Date | null | undefined;
    issuedAt: Date | null | undefined;
  };
  // matchedRecord: {
  //   id: string;
  //   channelId: string | null;
  //   channelType: string;
  //   isActive: boolean;
  // };
  matchedUserId: string;
};

export function ChatUI({ user, matchedUserId }: Props) {
  const { data: matchedRecord } = useMatchedUser(matchedUserId);

  const { chatClient, isTokenPending } = useCustomChatContext();

  const { theme } = useTheme();

  const currentTheme = theme === 'system' ? 'dark' : theme;

  if (!chatClient || isTokenPending) {
    return <Skeleton className={'h-dvh w-full animate-pulse'} />;
  }

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }>
      <Chat theme={`str-chat__theme-${currentTheme}`} client={chatClient}>
        <ChatUISidebar variant='inset' />
        <SidebarInset>
          <ChatUIHeader />
          <div className='flex flex-1 flex-col border-l'>
            <div className='@container/main flex flex-1 flex-col gap-2'>
              <LazyStreamChatInterface
                user={{
                  id: user.id,
                  fullName: user.fullName,
                  avatar: user.avatar,
                  streamToken: user.streamToken,
                  expireTime: user.expireTime,
                  issuedAt: user.issuedAt,
                }}
                matchedRecord={matchedRecord}
                matchedUserId={matchedUserId}
              />
            </div>
          </div>
        </SidebarInset>
      </Chat>
    </SidebarProvider>
  );
}

export function ChatUISidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { filters, sort, options } = useCustomChatContext();

  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className='data-[slot=sidebar-menu-button]:p-1.5!'>
              <Link href='/'>
                <IconInnerShadowTop className='size-5!' />
                <span className='text-base font-semibold'>Rotate key Inc.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator className={'my-1'} />
      <SidebarContent>
        <ChannelList
          showChannelSearch={true}
          filters={filters}
          sort={sort}
          options={options}
          onMessageNew={(ev) => {
            console.log({ ev });
          }}
          onAddedToChannel={(ev) => {
            console.log({ ev });
          }}
          onChannelVisible={(ev) => {
            console.log({ ev });
          }}
        />
      </SidebarContent>
    </Sidebar>
  );
}

export function ChatUIHeader() {
  return (
    <header className='flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'>
      <div className='flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6'>
        <SidebarTrigger className='-ml-1' />
        <Separator
          orientation='vertical'
          className='mx-2 data-[orientation=vertical]:h-4'
        />
        <h1 className='text-base font-medium'>Home</h1>
        <div className='ml-auto flex items-center gap-2'>
          {/* <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              GitHub
            </a>
          </Button> */}
          <ThemeToggler />
        </div>
      </div>
    </header>
  );
}
