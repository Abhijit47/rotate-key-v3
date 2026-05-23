import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import UserTestCard from '@/features/test-purpose/components/user-test-card';
import { prefetchTestPurposeChatUsers } from '@/features/test-purpose/server/prefetch';
import { HydrateClient } from '@/trpc/server';
import { MessageCircleMore } from 'lucide-react';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export default function TestUsersPage() {
  prefetchTestPurposeChatUsers();
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
                  <UserTestCard />
                </Suspense>
              </CardContent>
            </Card>
          </section>
        </main>
      </ErrorBoundary>
    </HydrateClient>
  );
}
