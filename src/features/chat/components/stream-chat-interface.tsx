'use client';

import data from '@emoji-mart/data';
import { init, SearchIndex } from 'emoji-mart';
// import { useTheme } from 'next-themes';
// import { useCallback } from 'react';
// import { ChannelFilters, ChannelOptions, ChannelSort } from 'stream-chat';
import {
  Channel,
  // ChannelList,
  // ChannelList,
  // Chat,
  // LoadingIndicator,
  MessageInput,
  MessageList,
  Thread,
  // useCreateChatClient,
  Window,
} from 'stream-chat-react';
import { EmojiPicker } from 'stream-chat-react/emojis';

// import { env } from '@/env';

// import { useLocale } from 'next-intl';
import { Skeleton } from '@/components/ui/skeleton';
// import { useRefreshChatToken } from '../hooks/use-chat';
import { useCustomChatContext } from '@/contexts/chat-context';
import CustomChannelHeader from './custom-channel-header';
import FreeTierMessage from './free-tier-message';
// import UserActivity from './user-activity';
// import CustomInput from './custom-input';

type Props = {
  user: {
    id: string;
    fullName: string;
    avatar: string | null | undefined;
    streamToken: string | null | undefined;
    expireTime: Date | null | undefined;
    issuedAt: Date | null | undefined;
  };
  matchedRecord: {
    id: string;
    channelId: string | null;
    channelType: string;
    isActive: boolean;
  };
  matchedUserId: string;
};

init({ data });
export default function StreamChatInterface(props: Props) {
  const { matchedRecord, matchedUserId, user } = props;

  // const { mutateAsync, isPending: isTokenPending } = useRefreshChatToken();
  const { chatClient, isTokenPending } = useCustomChatContext();

  // const { theme } = useTheme();

  // const chatClient = useCreateChatClient({
  //   apiKey: env.NEXT_PUBLIC_STREAM_API_KEY,
  //   tokenOrProvider: mutateAsync,
  //   userData: user,
  // });

  if (!chatClient || isTokenPending) {
    return <Skeleton className={'h-dvh w-full animate-pulse'} />;
  }

  // const channelId = matchedRecord.channelId?.split(':')[1];

  // const chatChannel = chatClient.channel(matchedRecord.channelType, channelId);

  const rawChannelId = matchedRecord.channelId ?? '';
  const [, parsedChannelId] = rawChannelId.split(':');

  if (!parsedChannelId) {
    return (
      <div className='p-4 text-sm text-muted-foreground'>
        This conversation isn&apos;t ready yet. Please try again in a moment.
      </div>
    );
  }

  const chatChannel = chatClient.channel(
    matchedRecord.channelType,
    parsedChannelId,
  );

  // channel list filters/sort/options are unused here because we open a specific channel
  // const filters: ChannelFilters = {
  //   members: { $in: [user.id] },
  // };
  // const sort: ChannelSort = { last_message_at: -1 };
  // const options: ChannelOptions = { limit: 10 };

  // const currentTheme = theme === 'system' ? 'dark' : theme;

  const isFreeTierLimitReached = false; // Replace with actual logic to determine if the limit is reached

  return (
    // <div className={'h-dvh w-full'}>
    <>
      {/* <Chat theme={`str-chat__theme-${currentTheme}`} client={chatClient}> */}
      {/* <ChannelList
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
        /> */}
      <Channel
        // Input={CustomInput}
        channel={chatChannel}
        EmojiPicker={EmojiPicker}
        emojiSearchIndex={SearchIndex}>
        <Window>
          <CustomChannelHeader />
          <MessageList />
          <MessageInput
            audioRecordingEnabled={true}
            {...(isFreeTierLimitReached
              ? {
                  Input: () => <FreeTierMessage />,
                }
              : undefined)}
          />
        </Window>
        <Thread />
      </Channel>
      {/* </Chat> */}
    </>
    // </div>
  );
}
