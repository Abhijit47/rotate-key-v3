'use client';

import './custom.css';

import data from '@emoji-mart/data';
import { TRPCClientError } from '@trpc/client';
import { init, SearchIndex } from 'emoji-mart';
import { useTheme } from 'next-themes';
import { KeyboardEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { Event as StreamEvent } from 'stream-chat';
import {
  Channel,
  ChannelHeader,
  ChannelList,
  ChannelListUI,
  type ChannelListUIProps,
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
} from 'stream-chat-react';
import { EmojiPicker } from 'stream-chat-react/emojis';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';

import { useUpgradeModal } from '@/features/common/hooks/use-upgrade-modal';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useTestCustomChatContext } from '@/contexts/test-chat-context';
import { useSession } from '@/lib/auth-client';
import { ArrowLeftCircle, UploadCloudIcon } from 'lucide-react';
import Link from 'next/link';
import { useChatSessionStorage } from '../hooks/useChatSessionStorage';
import EmptyChatState from './empty-chat-state';
import LoadingChatState from './loading-chat-state';
import MessageListHeader from './message-list-header';
import SidebarToggle from './test-sidebar-toggle';

export const DEFAULT_CHANNEL_ID = 'general';
export const DEFAULT_CHANNEL_TYPE = 'messaging';

init({ data });
export default function TestChatInterface() {
  const [isReady, setIsReady] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const { resolvedTheme } = useTheme();
  const currentTheme = resolvedTheme ?? 'dark';

  // const isDocUploaded = true; // This should be determined based on your application's logic for document upload

  // const [isOpen, setIsOpen] = useState(true);

  // const params = useParams<{ channelId?: string }>();

  const {
    chatClient,
    isTokenPending,
    isMatchedUsers,
    filters,
    sort,
    options,
    sidebarOpen,
  } = useTestCustomChatContext();

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

                  <DocumentUploadDialog />
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
  const { closeSidebar } = useTestCustomChatContext();
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
  // const { mutateAsync: checkLimit } = useMyCheck();
  const messageComposer = useMessageComposerController();

  const overrideSubmitHandler2: MessageComposerProps['overrideSubmitHandler'] =
    async ({ cid, localMessage, message, sendOptions }) => {
      if (!messageComposer?.channel) {
        toast.error(
          'No channel available to send message. Please try again later.',
        );
        return;
      }
      try {
        // const res = await checkLimit();
        // if (res.isMessageLimitReached) {
        //   handleError(
        //     'You have reached the free tier message limit. Please upgrade to continue chatting.',
        //   );
        //   return;
        // }
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
  // const { mutateAsync: checkLimit } = useMyCheck();
  const messageComposer = useMessageComposerController();

  const overrideSubmitHandler2: MessageComposerProps['overrideSubmitHandler'] =
    async ({ cid, localMessage, message, sendOptions }) => {
      if (!messageComposer?.channel) {
        toast.error(
          'No channel available to send message. Please try again later.',
        );
        return;
      }
      try {
        // const res = await checkLimit();
        // if (res.isMessageLimitReached) {
        //   handleError(
        //     'You have reached the free tier message limit. Please upgrade to continue chatting.',
        //   );
        //   return;
        // }

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

  const { onOpenDocumentDialog } = useTestCustomChatContext();

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

    onOpenDocumentDialog(true);

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

  return <ChannelListUI {...props} />;
}

export function DocumentUploadDialog() {
  const { data: user } = useSession();
  const { channel } = useChatContext();

  const { isOpenDocumentDialog, onOpenDocumentDialog } =
    useTestCustomChatContext();

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission logic here, such as validating the input and uploading the document
    // For example, you can access the input value using event.target.elements
    const formData = new FormData(event.currentTarget);
    // const fileLink = formData.get('fileLink') as string;
    const fileLink = 'https://pdfobject.com/pdf/sample.pdf'; // Replace with actual file link after upload
    if (fileLink) {
      // Here you would typically upload the document to your server or a cloud storage service
      // and then send a message in the chat with the document link or content.
      // For demonstration, we'll just send a message with the file link.
      const res = await channel?.sendMessage({
        text: `${user?.user.name ?? 'User'} uploaded a document: ${fileLink}`,
        attachments: [
          {
            type: 'file',
            asset_url: fileLink,
            title: 'Uploaded Document',
          },
        ],
        mentioned_channel: true,
        // mentioned_users: [], // oposite user_ID need to be mention here.
      });
      console.log('Message sent with document link:', res);
      // onOpenChange(false); // Close the dialog after submission
    } else {
      toast.error('Please enter a valid file URL.');
    }
  };

  return (
    <AlertDialog
      open={isOpenDocumentDialog}
      onOpenChange={onOpenDocumentDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Kindly Upload Your Document</AlertDialogTitle>
          <AlertDialogDescription>
            To provide you with accurate responses, we need to analyze the
            content of your document. Please upload the file you'd like to
            discuss in this chat.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Separator />

        <div>
          <div
            className={
              'border-2 border-dashed border-muted rounded-md p-6 flex flex-col items-center justify-center gap-4 cursor-pointer'
            }>
            <UploadCloudIcon className={'size-10 text-muted-foreground'} />
          </div>

          <Label>Supported format: PDF format. Max size: 10MB.</Label>
        </div>

        <form onSubmit={handleSubmit}>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor='fileLink'>File URL</FieldLabel>
                <Input
                  id='fileLink'
                  type='url'
                  name='fileLink'
                  autoComplete='off'
                  placeholder='https://example.com/your-document.pdf'
                />
              </Field>
            </FieldGroup>
          </FieldSet>

          <Separator />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction type='submit'>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </form>

        {/* <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction type='submit'>Continue</AlertDialogAction>
        </AlertDialogFooter> */}
      </AlertDialogContent>
    </AlertDialog>
  );
}
