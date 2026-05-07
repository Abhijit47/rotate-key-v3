import 'stream-chat-react/dist/css/emoji-picker.css';
import 'stream-chat-react/dist/css/index.css';

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { ChatCustomContextProvider } from '@/contexts/chat-context';
import ChatInterface from '@/features/chat/components/chat-interface';
import { prefetchMatchedUsers } from '@/features/chat/server/prefetch';
import { requireAuth } from '@/lib/requireAuth';
import { HydrateClient } from '@/trpc/server';

export default async function ChatPage() {
  const { user } = await requireAuth();

  prefetchMatchedUsers();

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Something went wrong, chat page.</div>}>
        <ChatCustomContextProvider
          user={{
            id: user.id,
            fullName: user.name,
            avatar: user.image,
            streamToken: user.chatToken,
            expireTime: user.chatTokenExpireAt,
            issuedAt: user.chatTokenIssuedAt,
          }}>
          <Suspense fallback={<div>Loading chat interface...</div>}>
            <ChatInterface />
          </Suspense>
        </ChatCustomContextProvider>
      </ErrorBoundary>
    </HydrateClient>
  );
}
