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
  useMemo,
  useState,
} from 'react';
import { ChannelFilters, ChannelOptions, ChannelSort } from 'stream-chat';
import { useCreateChatClient } from 'stream-chat-react';

import { env } from '@/env';
import {
  useMatchedUsers,
  useRefreshChatToken,
} from '@/features/chat/hooks/use-chat';
import { useSession } from '@/lib/auth-client';
import { toast } from 'sonner';

type User = {
  id: string;
  fullName: string;
  avatar: string | null | undefined;
  streamToken: string | null | undefined;
  expireTime: Date | null | undefined;
  issuedAt: Date | null | undefined;
  isPropertyDocumentUploaded: boolean;
  propertyDocument: string | null | undefined;
};

type ChatContextType = {
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
  onClose: () => void;
  user: User;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

type Props = {
  children: ReactNode;
  user: User;
  initialOpen?: boolean;
};

export function ChatCustomContextProvider(props: Props) {
  const { children, user, initialOpen = true } = props;

  const [sidebarOpen, setSidebarOpen] = useState(initialOpen);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const openSidebar = useCallback(() => setSidebarOpen(true), []);

  const [timeout, _] = useState(6000);
  // The useCreateChatClient hook accepts an options object forwarded to the StreamChat constructor. The client is not recreated when options changes. If you need to re-create it, set a key on the component that calls the hook:
  // const key = `timeout_${timeout}`;

  const { refetch } = useSession();
  const userId = user.id;

  const storageKey = userId ? `document-upload:${userId}` : null;

  const shouldPrompt = user.isPropertyDocumentUploaded;

  const [isOpenDocumentDialog, setIsOpenDocumentDialog] =
    useState(shouldPrompt);
  const dismissed = useMemo(() => {
    if (!storageKey) return false;
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(storageKey) === 'dismissed';
  }, [storageKey]);

  const router = useRouter();

  const { mutateAsync, isPending: isTokenPending } = useRefreshChatToken();
  const { data: matchedUsers, isLoading: isMatchedUsers } = useMatchedUsers();

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
    if (matchedUsers?.length === 0) {
      router.push('/');
      toast.error(
        'You have no matches yet. Please match with someone to start chatting.',
      );
      return;
    }
  }, [matchedUsers, router]);

  useEffect(() => {
    if (shouldPrompt && !dismissed) {
      console.log(
        "triggering document upload dialog because user hasn't dismissed it yet",
      );
      // setIsOpenDocumentDialog(true);
    }
  }, [shouldPrompt]);

  async function handleClose() {
    if (!storageKey) return;
    if (typeof window === 'undefined') return;

    await refetch({
      query: {
        disableCookieCache: true,
      },
    });

    window.localStorage.setItem(storageKey, 'dismissed');
    router.refresh();
    setIsOpenDocumentDialog(false);
  }

  const values: ChatContextType = {
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
    onClose: handleClose,
    user,
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
