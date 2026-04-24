import 'stream-chat-react/dist/css/v2/index.css';
import './chat-layout.css';

import { notFound } from 'next/navigation';

// import { LazyStreamChatInterface } from '@/features/chat/components';
import { ChatCustomContextProvider } from '@/contexts/chat-context';
import {
  ChatUI,
  ChatUIError,
  ChatUILoading,
} from '@/features/chat/components/chat-ui-elements';
import { prefetchMatchedUser } from '@/features/chat/server/prefetch';
import { requireAuth } from '@/lib/requireAuth';
import { HydrateClient } from '@/trpc/server';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export default async function ChatPage(props: PageProps<'/chat/[userId]'>) {
  const { user } = await requireAuth();

  const friendId = (await props.params).userId;

  if (!friendId) {
    return notFound();
  }

  prefetchMatchedUser({ ownerId: friendId });

  // const matchedRecord = await caller.chat.getMatchedUser({ ownerId: friendId });

  const matchedUserId = friendId;

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<ChatUIError />}>
        <Suspense fallback={<ChatUILoading />}>
          <ChatCustomContextProvider
            user={{
              id: user.id,
              fullName: user.name,
              avatar: user.image,
              streamToken: user.chatToken,
              expireTime: user.chatTokenExpireAt,
              issuedAt: user.chatTokenIssuedAt,
            }}>
            <ChatUI
              user={{
                id: user.id,
                fullName: user.name,
                avatar: user.image,
                streamToken: user.chatToken,
                expireTime: user.chatTokenExpireAt,
                issuedAt: user.chatTokenIssuedAt,
              }}
              // matchedRecord={matchedRecord}
              matchedUserId={matchedUserId}
            />
          </ChatCustomContextProvider>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
