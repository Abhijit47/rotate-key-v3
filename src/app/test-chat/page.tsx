import 'stream-chat-react/dist/css/emoji-picker.css';
import 'stream-chat-react/dist/css/index.css';

import { TestChatCustomContextProvider } from '@/contexts/test-chat-context';
import EmptyChatState from '@/features/chat/components/empty-chat-state';
import ErrorChatState from '@/features/chat/components/error-chat-state';
import TestChatInterface from '@/features/test-purpose/components/chat-interface';
import { prefetchTestMatchedUsers } from '@/features/test-purpose/server/prefetch';
import { requireAuth } from '@/lib/requireAuth';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export default async function TestChatPage() {
  const { user } = await requireAuth();

  prefetchTestMatchedUsers();

  return (
    <ErrorBoundary fallback={<ErrorChatState />}>
      <TestChatCustomContextProvider
        user={{
          id: user.id,
          fullName: user.name,
          avatar: user.image,
          streamToken: user.chatToken,
          expireTime: user.chatTokenExpireAt,
          issuedAt: user.chatTokenIssuedAt,
        }}>
        <Suspense fallback={<EmptyChatState />}>
          <TestChatInterface />
        </Suspense>
      </TestChatCustomContextProvider>
    </ErrorBoundary>
  );
}
