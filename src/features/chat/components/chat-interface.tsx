'use client';

import './custom.css';

import data from '@emoji-mart/data';
import { init, SearchIndex } from 'emoji-mart';
import { useTheme } from 'next-themes';
import { KeyboardEvent, useEffect, useState } from 'react';
import {
  Channel,
  Chat,
  MessageComposer,
  MessageList,
  Thread,
  Window,
  WithComponents,
} from 'stream-chat-react';
import { EmojiPicker } from 'stream-chat-react/emojis';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useCustomChatContext } from '@/contexts/chat-context';
import { useChatSessionStorage } from '../hooks/useChatSessionStorage';
import ChatSidebar from './chat-sidebar';
import { CustomChannelHeader } from './custom-channel-header';
import CustomSidebarToggle from './custom-sidebar-toggle';
import EmptyChatState from './empty-chat-state';
import LoadingChatState from './loading-chat-state';
import MessageListHeader from './message-list-header';

export const DEFAULT_CHANNEL_ID = 'general';
export const DEFAULT_CHANNEL_TYPE = 'messaging';

init({ data });
export default function ChatInterface() {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const { resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme ?? 'dark';

  // const params = useParams<{ channelId?: string }>();

  const { chatClient, isTokenPending, isMatchedUsers } = useCustomChatContext();

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

  const defaultShouldSubmit = (event: KeyboardEvent) =>
    event.key === 'Enter' && !event.shiftKey;

  const isFreeTierLimitReached = false; // Replace with actual logic to determine if the free tier limit has been reached

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
                      <MessageComposer
                        audioRecordingEnabled={true}
                        emojiSearchIndex={SearchIndex}
                        focus={true}
                        hideSendButton={isFreeTierLimitReached}
                        // overrideSubmitHandler={{
                        //   cid: 'string',
                        //   localMessage: '',
                        //   message: '',
                        //   sendOptions: {},
                        // }}
                        shouldSubmit={defaultShouldSubmit}
                      />
                      {/* </WithComponents> */}
                    </Window>
                    <Thread />
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
