'use client';

import { createContext, ReactNode, useContext } from 'react';
import { useCreateChatClient } from 'stream-chat-react';

import { env } from '@/env';
import { useRefreshChatToken } from '@/features/chat/hooks/use-chat';
import { ChannelFilters, ChannelOptions, ChannelSort } from 'stream-chat';

type ChatContextType = {
  chatClient: ReturnType<typeof useCreateChatClient>;
  isTokenPending: boolean;
  filters: ChannelFilters;
  sort: ChannelSort;
  options: ChannelOptions;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

type Props = {
  children: ReactNode;
  user: {
    id: string;
    fullName: string;
    avatar: string | null | undefined;
    streamToken: string | null | undefined;
    expireTime: Date | null | undefined;
    issuedAt: Date | null | undefined;
  };
};

export function ChatCustomContextProvider(props: Props) {
  const { children, user } = props;
  const { mutateAsync, isPending: isTokenPending } = useRefreshChatToken();

  const chatClient = useCreateChatClient({
    apiKey: env.NEXT_PUBLIC_STREAM_API_KEY,
    tokenOrProvider: mutateAsync,
    userData: {
      id: user.id,
      name: user.fullName,
      image: user.avatar ?? undefined,
    },
  });

  const filters: ChannelFilters = {
    members: { $in: [user.id] },
  };
  const sort: ChannelSort = { last_message_at: -1 };
  const options: ChannelOptions = { limit: 10 };

  const values = {
    chatClient,
    isTokenPending,
    filters,
    sort,
    options,
  };

  return <ChatContext.Provider value={values}>{children}</ChatContext.Provider>;
}

export function useCustomChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error(
      'useCustomChatContext must be used within a ChatContextProvider',
    );
  }
  return context;
}
