import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import UserCard from '@/features/chat/components/user-card';
import { prefetchChatUsers } from '@/features/chat/server/prefetch';
import { HydrateClient } from '@/trpc/server';
import { MessageCircleMore } from 'lucide-react';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import 'stream-chat-react/dist/css/v2/index.css';

export default function ChatPage() {
  prefetchChatUsers();
  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Something went wrong, chat page.</div>}>
        <main
          className={
            'container mx-auto max-w-7xl px-4 2xl:px-0 py-8 space-y-8'
          }>
          <section>
            <Card className={'gap-4 py-4'}>
              <CardHeader>
                <CardTitle>
                  <h1 className='text-2xl font-sans font-bold flex items-center gap-2'>
                    Continue your chat ...{' '}
                    <span>
                      <MessageCircleMore className='size-6' />
                    </span>
                  </h1>
                </CardTitle>
                <CardDescription>
                  <p>Select a match to start chatting with the matched user.</p>
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Suspense fallback={<div>Loading matches...</div>}>
                  <UserCard />
                </Suspense>
              </CardContent>
            </Card>
          </section>
        </main>
      </ErrorBoundary>
    </HydrateClient>
  );
}
