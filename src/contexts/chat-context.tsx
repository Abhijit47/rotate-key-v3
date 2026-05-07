'use client';

import { useRouter } from 'next/navigation';
import { createContext, ReactNode, useContext, useEffect } from 'react';
import { ChannelFilters, ChannelOptions, ChannelSort } from 'stream-chat';
import { useCreateChatClient } from 'stream-chat-react';

import { env } from '@/env';
import {
  useMatchedUsers,
  useRefreshChatToken,
} from '@/features/chat/hooks/use-chat';
import { toast } from 'sonner';

type ChatContextType = {
  chatClient: ReturnType<typeof useCreateChatClient>;
  isTokenPending: boolean;
  filters: ChannelFilters;
  sort: ChannelSort;
  options: ChannelOptions;
  isMatchedUsers: boolean;
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

  const router = useRouter();

  const { mutateAsync, isPending: isTokenPending } = useRefreshChatToken();
  const { data, isLoading: isMatchedUsers } = useMatchedUsers();

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

  useEffect(() => {
    if (data?.length === 0) {
      router.push('/');
      toast.error(
        'You have no matches yet. Please match with someone to start chatting.',
      );
      return;
    }
  }, [data, router]);

  const values = {
    chatClient,
    isTokenPending,
    filters,
    sort,
    options,
    isMatchedUsers,
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
