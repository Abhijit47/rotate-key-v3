# Chat Interface Backup

```typescript
'use client';

import './custom.css';

import data from '@emoji-mart/data';
import { TRPCClientError } from '@trpc/client';
import { init, SearchIndex } from 'emoji-mart';
import { ArrowLeftCircle, MousePointerClickIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { KeyboardEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { Event as StreamEvent } from 'stream-chat';
import {
  Channel,
  ChannelHeader,
  ChannelList,
  ChannelListUI,
  Chat,
  getChannel,
  MessageComposer,
  MessageComposerProps,
  MessageList,
  Search,
  Thread,
  useChannelListContext,
  useChatContext,
  useMessageComposerController,
  Window,
  WithComponents,
  type ChannelListUIProps,
} from 'stream-chat-react';

import { EmojiPicker } from 'stream-chat-react/emojis';

import { useUpgradeModal } from '@/features/common/hooks/use-upgrade-modal';
import { useMyCheck } from '../hooks/use-chat';

import { Button } from '@/components/ui/button';
import { useCustomChatContext } from '@/contexts/chat-context';
import { useSession } from '@/lib/auth-client';
import { useChatSessionStorage } from '../hooks/useChatSessionStorage';
import DocumentUploadAlertDialog from './document-upload-dialog';
import EmptyChatState from './empty-chat-state';
import LoadingChatState from './loading-chat-state';
import MessageListHeader from './message-list-header';
import SidebarToggle from './sidebar-toggle';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import ChatSidebar from './chat-sidebar';
import { CustomChannelHeader } from './custom-channel-header';
import CustomSidebarToggle from './custom-sidebar-toggle';

export const DEFAULT_CHANNEL_ID = 'general';
export const DEFAULT_CHANNEL_TYPE = 'messaging';

init({ data });
export default function ChatInterface() {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const { resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme ?? 'dark';

  // const params = useParams<{ channelId?: string }>();

  const {
    chatClient,
    isTokenPending,
    isMatchedUsers,
    filters,
    sort,
    options,
    sidebarOpen,
  } = useCustomChatContext();

  const [storedValue] = useChatSessionStorage('chat-session', {
    channelId: 'general',
  });

  useEffect(() => {
    if (!chatClient) return;

    const initChannel = async () => {
      const channel = chatClient.channel(
        DEFAULT_CHANNEL_TYPE,
        // params.channelId ? params.channelId : DEFAULT_CHANNEL_ID,
        storedValue.channelId,
      );

      await channel.watch();
      setIsReady(true);
    };

    // Simulate loading progress
    const timer = setTimeout(async () => {
      setProgress(100);
      // Simulate a short delay before initializing the channel
      await new Promise((resolve) => setTimeout(resolve, 100));
      initChannel().catch((error) => {
        console.error('Failed to initialize channel', error);
      });
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [chatClient, storedValue.channelId]);

  // if (!chatClient) return <div>Setting up client & connection...</div>;
  // if (!isReady) return <div>Loading channels...</div>;

  if (isTokenPending || isMatchedUsers || !isReady || !chatClient) {
    return <LoadingChatState progress={progress} />;
  }

  // if (isTokenPending) {
  //   return <LoadingChatState progress={progress} />;
  // }

  const chatChannel = chatClient.channel(
    DEFAULT_CHANNEL_TYPE, // always "messaging" for 1:1 conversations
    // params.channelId ? params.channelId : DEFAULT_CHANNEL_ID,
    storedValue.channelId,
  );

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 74)',
          '--header-height': 'calc(var(--spacing) * 14)',
        } as React.CSSProperties
      }>
      <Chat theme={`str-chat__theme-${currentTheme}`} client={chatClient}>
        <ChatSidebar variant='inset' />
        <SidebarInset className='mt-0! mr-0!'>
          <div className='flex flex-1 flex-col border-l'>
            <div className='@container/main flex flex-1 flex-col gap-2'>
              {storedValue.channelId === 'general' ? (
                <EmptyChatState />
              ) : (
                <WithComponents
                  overrides={{
                    EmojiPicker,
                    HeaderStartContent: CustomSidebarToggle,
                  }}>
                  <Channel channel={chatChannel}>
                    <Window>
                      {/* <ChannelHeader Avatar={HeaderEndContent} /> */}
                      <CustomChannelHeader />
                      <MessageList
                        head={<MessageListHeader />}
                        showAvatar={true}
                      />
                      {/* <WithComponents
                        overrides={{
                          AttachmentSelector: CustomAttachmentSelector,
                          // MessageComposerUI: CustomMessageComposer,
                        }}> */}

                      <Composer />
                      {/* </WithComponents> */}
                    </Window>
                    <CustomThread />
                  </Channel>
                </WithComponents>
              )}
            </div>
          </div>
        </SidebarInset>
      </Chat>
    </SidebarProvider>
  );
}

function CustomThread() {
  const { handleError, modal } = useUpgradeModal();
  const { mutateAsync: checkLimit } = useMyCheck();
  const messageComposer = useMessageComposerController();

  const overrideSubmitHandler2: MessageComposerProps['overrideSubmitHandler'] =
    async ({ cid, localMessage, message, sendOptions }) => {
      try {
        const res = await checkLimit();
        if (res.isMessageLimitReached) {
          handleError(
            'You have reached the free tier message limit. Please upgrade to continue chatting.',
          );
          return;
        }

        if (!messageComposer?.channel) {
          toast.error(
            'No channel available to send message. Please try again later.',
          );
          return;
        }

        await messageComposer.channel.sendMessage(message, sendOptions);
        messageComposer.clear();
      } catch (err) {
        console.error('Error in overrideSubmitHandler:', err);
        if (err instanceof TRPCClientError) {
          handleError(err);
        } else {
          toast.error('Failed to send message. Please try again.');
        }
      }
    };

  return (
    <>
      {modal}
      <Thread
        additionalMessageComposerProps={{
          overrideSubmitHandler: overrideSubmitHandler2,
        }}
      />
    </>
  );
}

const Composer = () => {
  const { handleError, modal } = useUpgradeModal();
  const { mutateAsync: checkLimit } = useMyCheck();
  const messageComposer = useMessageComposerController();

  const overrideSubmitHandler2: MessageComposerProps['overrideSubmitHandler'] =
    async ({ cid, localMessage, message, sendOptions }) => {
      try {
        const res = await checkLimit();
        if (res.isMessageLimitReached) {
          handleError(
            'You have reached the free tier message limit. Please upgrade to continue chatting.',
          );
          return;
        }

        if (!messageComposer?.channel) {
          toast.error(
            'No channel available to send message. Please try again later.',
          );
          return;
        }

        await messageComposer.channel.sendMessage(message, sendOptions);
        messageComposer.clear();
      } catch (err) {
        console.error('Error in overrideSubmitHandler:', err);
        if (err instanceof TRPCClientError) {
          handleError(err);
        } else {
          toast.error('Failed to send message. Please try again.');
        }
      }
    };

  const defaultShouldSubmit = (event: KeyboardEvent) =>
    event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing;

  return (
    <>
      {modal}
      <MessageComposer
        audioRecordingEnabled={true}
        emojiSearchIndex={SearchIndex}
        focus={true}
        shouldSubmit={defaultShouldSubmit}
        hideSendButton={false}
        overrideSubmitHandler={overrideSubmitHandler2}
      />
    </>
  );
};
```
