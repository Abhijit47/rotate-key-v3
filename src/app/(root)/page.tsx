import { ClientGreeting } from '@/components/client-greeting';
import LocaleToggler from '@/components/shared/locale-toggler';
import ThemeToggler from '@/components/shared/theme-toggler';
import TestJobs from '@/components/test-jobs';
import { Button, buttonVariants } from '@/components/ui/button';
import { caller, HydrateClient, prefetch, trpc } from '@/trpc/server';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
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
        <div>
          <Button>Click me</Button>
          <ThemeToggler />
          <LocaleToggler />
        </div>

        <div>{greeting.greeting}</div>

        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <ClientGreeting />
        </ErrorBoundary>

        <TestJobs />

        <div className={'space-x-4'}>
          <Link
            href={'/login'}
            className={buttonVariants({
              variant: 'outline',
              className: 'rounded-full!',
            })}>
            Continue to Login
          </Link>
          <Link
            href={'/sign-up'}
            className={buttonVariants({
              className: 'rounded-full!',
            })}>
            Get Started
          </Link>
        </div>

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
