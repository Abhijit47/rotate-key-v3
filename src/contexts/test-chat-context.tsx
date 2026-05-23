'use client';

import { useRouter } from 'next/navigation';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ChannelFilters, ChannelOptions, ChannelSort } from 'stream-chat';
import { useCreateChatClient } from 'stream-chat-react';

import { env } from '@/env';
import {
  useTestMatchedUsers,
  useTestRefreshChatToken,
} from '@/features/test-purpose/hooks/use-test-purpose';
import { toast } from 'sonner';

type TestChatContextType = {
  chatClient: ReturnType<typeof useCreateChatClient>;
  isTokenPending: boolean;
  filters: ChannelFilters;
  sort: ChannelSort;
  options: ChannelOptions;
  isMatchedUsers: boolean;
  sidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  isOpenDocumentDialog: boolean;
  onOpenDocumentDialog: Dispatch<SetStateAction<boolean>>;
};

const TestChatContext = createContext<TestChatContextType | undefined>(
  undefined,
);

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
  initialOpen?: boolean;
};

export function TestChatCustomContextProvider(props: Props) {
  const { children, user, initialOpen = true } = props;

  const [sidebarOpen, setSidebarOpen] = useState(initialOpen);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const openSidebar = useCallback(() => setSidebarOpen(true), []);

  const [isOpenDocumentDialog, setIsOpenDocumentDialog] = useState(true);

  const [timeout, _] = useState(6000);

  // The useCreateChatClient hook accepts an options object forwarded to the StreamChat constructor. The client is not recreated when options changes. If you need to re-create it, set a key on the component that calls the hook:
  // const key = `timeout_${timeout}`;

  const router = useRouter();

  const { mutateAsync, isPending: isTokenPending } = useTestRefreshChatToken();
  const { data, isLoading: isMatchedUsers } = useTestMatchedUsers();

  const chatClient = useCreateChatClient({
    apiKey: env.NEXT_PUBLIC_STREAM_API_KEY,
    options: { timeout },
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

  const values: TestChatContextType = {
    chatClient,
    isTokenPending,
    filters,
    sort,
    options,
    isMatchedUsers,
    sidebarOpen,
    openSidebar,
    closeSidebar,
    isOpenDocumentDialog,
    onOpenDocumentDialog: setIsOpenDocumentDialog,
  };

  return (
    <TestChatContext.Provider value={values}>
      {children}
    </TestChatContext.Provider>
  );
}

export function useTestCustomChatContext() {
  const context = useContext(TestChatContext);
  if (!context) {
    throw new Error(
      'useTestCustomChatContext must be used within a TestChatContextProvider',
    );
  }
  return context;
}
