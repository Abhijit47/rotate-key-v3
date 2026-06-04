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
import { useChatSessionStorage } from '../hooks/useChatSessionStorage';
import DocumentUploadAlertDialog from './document-upload-dialog';
import EmptyChatState from './empty-chat-state';
import LoadingChatState from './loading-chat-state';
import MessageListHeader from './message-list-header';
import SidebarToggle from './sidebar-toggle';

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
    user,
  } = useCustomChatContext();

  // const { documentAlertModal } = useDocumentUploadAlert(user);

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
    <>
      <WithComponents
        overrides={{
          HeaderStartContent: () => (
            <div className={'flex items-center gap-2'}>
              <Link href='/test-users'>
                <ArrowLeftCircle className={'size-4'} />
              </Link>
              <SidebarToggle />
            </div>
          ),
          HeaderEndContent: SidebarToggle,
        }}>
        <div
          className={`chat-layout ${!sidebarOpen ? 'chat-layout--sidebar-collapsed' : ''}`}>
          <Chat theme={`str-chat__theme-${currentTheme}`} client={chatClient}>
            <div className='chat-sidebar'>
              <WithComponents
                overrides={{
                  ChannelListUI: OverrideChannelListUI,
                  Search: OverrideSidebarSearch,
                }}>
                <ChannelList
                  showChannelSearch={true}
                  filters={filters}
                  sort={sort}
                  options={options}
                  setActiveChannelOnMount={false}
                />
              </WithComponents>
            </div>

            <div className='chat-main'>
              {storedValue.channelId === 'general' ? (
                <EmptyChatState />
              ) : (
                <>
                  <WithComponents
                    overrides={{
                      EmojiPicker,
                      // HeaderStartContent: SidebarToggle,
                      // HeaderEndContent: SidebarToggle,
                    }}>
                    <Channel channel={chatChannel}>
                      <Window>
                        <ChannelHeader />
                        <MessageList
                          head={<MessageListHeader />}
                          showAvatar={true}
                        />

                        <OverrideComposer />
                      </Window>
                      <OverrideThread />
                    </Channel>
                  </WithComponents>

                  <DocumentUploadAlertDialog />
                </>
              )}
            </div>
            <AutoCloseSidebar />
          </Chat>
        </div>
      </WithComponents>
    </>
  );
}

const MOBILE_BREAKPOINT = 768;
const AutoCloseSidebar = () => {
  const { channel } = useChatContext();
  const { closeSidebar } = useCustomChatContext();
  useEffect(() => {
    if (
      channel &&
      typeof window !== 'undefined' &&
      window.innerWidth < MOBILE_BREAKPOINT
    ) {
      closeSidebar();
    }
  }, [channel?.cid, closeSidebar]);
  return null;
};

function OverrideThread() {
  const { handleError, modal } = useUpgradeModal();
  const { mutateAsync: checkLimit } = useMyCheck();
  const messageComposer = useMessageComposerController();
  const { client, channel } = useChatContext();

  const { onOpenDocumentDialog, user } = useCustomChatContext();

  const overrideSubmitHandler2: MessageComposerProps['overrideSubmitHandler'] =
    async ({ cid, localMessage, message, sendOptions }) => {
      if (!messageComposer?.channel) {
        toast.error(
          'No channel available to send message. Please try again later.',
        );
        return;
      }
      try {
        const res = await checkLimit();
        if (res.isMessageLimitReached) {
          handleError(
            'You have reached the free tier message limit. Please upgrade to continue chatting.',
          );
          return;
        }
        await messageComposer.channel.sendMessage(message, sendOptions);
        messageComposer.clear();
      } catch (err) {
        console.error('Error in overrideSubmitHandler:', err);
        if (err instanceof TRPCClientError) {
          toast.error(err.message || 'An error occurred. Please try again.');
          return;
        } else {
          toast.error('Failed to send message. Please try again.');
          return;
        }
      }
    };

  const hasDocumentMessageFromCurrentUser = channel?.state.messages.some(
    (msg) => {
      const sentByCurrentUser = msg?.user?.id === client.userID;
      const hasDocumentAttachment = msg.attachments?.some(
        (att) => att.type === 'file' && !!att.asset_url,
      );

      return sentByCurrentUser && hasDocumentAttachment;
    },
  );

  const showComposer =
    user.isPropertyDocumentUploaded && hasDocumentMessageFromCurrentUser;

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

function OverrideComposer() {
  const { handleError, modal } = useUpgradeModal();
  const { mutateAsync: checkLimit } = useMyCheck();
  const messageComposer = useMessageComposerController();

  const { onOpenDocumentDialog, user } = useCustomChatContext();
  const { client, channel } = useChatContext();

  const overrideSubmitHandler2: MessageComposerProps['overrideSubmitHandler'] =
    async ({ cid, localMessage, message, sendOptions }) => {
      if (!messageComposer?.channel) {
        toast.error(
          'No channel available to send message. Please try again later.',
        );
        return;
      }
      try {
        const res = await checkLimit();
        if (res.isMessageLimitReached) {
          handleError(
            'You have reached the free tier message limit. Please upgrade to continue chatting.',
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

  const hasDocumentMessageFromCurrentUser = channel?.state.messages.some(
    (msg) => {
      const sentByCurrentUser = msg?.user?.id === client.userID;
      const hasDocumentAttachment = msg.attachments?.some(
        (att) => att.type === 'file' && !!att.asset_url,
      );

      return sentByCurrentUser && hasDocumentAttachment;
    },
  );

  const showComposer =
    user.isPropertyDocumentUploaded && hasDocumentMessageFromCurrentUser;

  return (
    <>
      {modal}
      {!showComposer ? (
        <div className={'h-16 border border-t border-border'}>
          <Button
            variant='outline'
            className='w-full h-full rounded-none'
            onClick={() => onOpenDocumentDialog(true)}>
            <MousePointerClickIcon className='size-4' />
            Click here to upload your property document to start chatting
          </Button>
        </div>
      ) : (
        <MessageComposer
          audioRecordingEnabled={true}
          emojiSearchIndex={SearchIndex}
          focus={true}
          shouldSubmit={defaultShouldSubmit}
          hideSendButton={false}
          overrideSubmitHandler={overrideSubmitHandler2}
        />
      )}
    </>
  );
}

function OverrideSidebarSearch() {
  return (
    <Search
      exitSearchOnInputBlur
      placeholder='Search channels, messages, and users...'
    />
  );
}

function OverrideChannelListUI(props: ChannelListUIProps) {
  // const { channelId } = useParams<{ channelId: string }>();
  // const router = useRouter();

  const { onOpenDocumentDialog, user } = useCustomChatContext();

  const [storedValue, setValue] = useChatSessionStorage('chat-session', {
    channelId: DEFAULT_CHANNEL_ID,
  });

  const channelId = storedValue.channelId;

  const { client, channel, setActiveChannel } = useChatContext();
  const { setChannels } = useChannelListContext();

  // This effect is to set the active channel on mount and when channelId changes. It also handles the case when user tries to access a channel that is not in the list (e.g. by entering the URL directly), it will load that channel and set it as active.
  useEffect(() => {
    // if (!channelId) return router.push(`/chats/${DEFAULT_CHANNEL_ID}`);
    if (!channelId) return setValue({ channelId: DEFAULT_CHANNEL_ID });
    if (channel?.id === channelId || !client) return;
    let subscription: { unsubscribe: () => void } | undefined;
    if (channel?.id) {
      // router.push(`/chats/${channel.id}`);
      setValue({ channelId: channel.id });
    }
    // BUG: 768px or below this channel is undefined on mount, so in sidebar mobile or medium not showing channel list "undefined"
    // console.log('Channel data on ChannelListUI mount:', channel?.id);
    if (!channel?.id || channel?.id !== channelId) {
      subscription = client.on('channels.queried', (event: StreamEvent) => {
        const loadedChannelData = event.queriedChannels?.channels.find(
          (response) => response.channel.id === channelId,
        );

        if (loadedChannelData?.channel.id !== 'general') {
          setActiveChannel(client.channel(DEFAULT_CHANNEL_TYPE, channelId));
          subscription?.unsubscribe();
          return;
        }
        return getChannel({
          client,
          id: channelId,
          type: DEFAULT_CHANNEL_TYPE,
        }).then((newActiveChannel) => {
          setActiveChannel(newActiveChannel);
          setChannels((channels) => {
            return [
              newActiveChannel,
              ...channels.filter(
                (ch) => ch.data?.cid !== newActiveChannel.data?.cid,
              ),
            ];
          });
        });
      });
    }
    return () => {
      subscription?.unsubscribe();
    };
    // }, [channel?.id, channelId, setChannels, client, setActiveChannel, router]);
  }, [channel?.id, channelId, setChannels, client, setActiveChannel, setValue]);

  // This effect is to show the opposite user info in toast when channel changes.
  useEffect(() => {
    if (!channel?.cid || !client) return;

    const members = Object.values(channel.state.members ?? {}) as Array<{
      user?: { id?: string | null };
    }>;
    if (!members.length) return;

    const currentUserId = client.userID;
    const oppositeUser = members.find(
      (member) => member.user?.id && member.user.id !== currentUserId,
    );

    console.log('members of loaded channel:', members);
    console.log('current user id:', currentUserId);
    console.log('opposite user:', oppositeUser);
    toast.info(
      <pre className={'font-sans text-xs'}>
        {JSON.stringify(
          oppositeUser?.user || { id: 'unknown user', name: 'unknown user' },
          null,
          2,
        )}
      </pre>,
      {
        duration: 5000,
      },
    );
  }, [channel?.cid, client]);

  // this return true or false based on the value from DB,
  const isUploadedFromDB = user.isPropertyDocumentUploaded;

  // This effect is to check if there's a document message from current user in the channel, if not and also not uploaded from DB then open the document upload dialog. We need this because user might have uploaded document before but if they switch to another device or clear local storage, we still want to prompt them to upload document if there's no record of it in the current channel.
  useEffect(() => {
    if (!client || !channel?.cid) return;

    const hasDocumentMessageFromCurrentUser = channel.state.messages.some(
      (msg) => {
        // console.log(
        //   'msg?.user?.id',
        //   msg?.user?.id,
        //   'client.userID',
        //   client.userID,
        //   'msg.user_id',
        //   msg.user_id, // this was undefined
        // );
        const sentByCurrentUser = msg?.user?.id === client.userID;
        const hasDocumentAttachment = msg.attachments?.some(
          (att) => att.type === 'file' && !!att.asset_url,
        );

        return sentByCurrentUser && hasDocumentAttachment;
      },
    );
    // console.log('channel:', channel.cid);
    // console.log('isUploadedFromDB:', isUploadedFromDB);
    // console.log(
    //   'hasDocumentMessageFromCurrentUser:',
    //   hasDocumentMessageFromCurrentUser,
    // );

    // If you want the modal to open only when both are missing instead of either one, change the condition to if (!isUploadedFromDB && !hasSystemMessage).
    if (!isUploadedFromDB && !hasDocumentMessageFromCurrentUser) {
      console.log('Opening document upload dialog for channel:', channel.id);
      onOpenDocumentDialog(true);
    } else {
      onOpenDocumentDialog(false);
    }
  }, [
    channel?.cid,
    channel?.state.messages,
    client,
    isUploadedFromDB,
    onOpenDocumentDialog,
  ]);

  return <ChannelListUI {...props} />;
}
