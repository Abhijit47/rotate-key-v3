import { ClientGreeting } from '@/components/client-greeting';
import TestJobs from '@/components/test-jobs';
import { caller, HydrateClient, prefetch, trpc } from '@/trpc/server';
import { getTranslations } from 'next-intl/server';
import { ErrorBoundary } from 'react-error-boundary';

export default async function Home() {
  const greeting = await caller.hello({ text: 'Hello from server' });
  prefetch(
    trpc.hello.queryOptions({
      text: 'Hello from server',
    }),
  );

  const t = await getTranslations();

  return (
    <HydrateClient>
      <div className={'space-y-6'}>
        <div>{greeting.greeting}</div>

        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <ClientGreeting />
        </ErrorBoundary>

        <TestJobs />

        <div className={'space-y-5'}>
          <h1 className={'font-display text-7xl font-extrabold'}>
            {t(
              'hello-world-this-is-a-test-of-the-new-font-loading-system-thefont-should-load-without-any-issues-and-there-should-be-no-flashes-of-unstyled-text',
            )}
          </h1>
          <h1 className={'font-body text-7xl font-bold'}>
            {t(
              'hello-world-this-is-a-test-of-the-new-font-loading-system-thefont-should-load-without-any-issues-and-there-should-be-no-flashes-of-unstyled-text',
            )}
          </h1>
          <h1 className={'font-mono text-7xl font-bold'}>
            {t(
              'hello-world-this-is-a-test-of-the-new-font-loading-system-thefont-should-load-without-any-issues-and-there-should-be-no-flashes-of-unstyled-text',
            )}
          </h1>
        </div>
      </div>
    </HydrateClient>
  );
}
