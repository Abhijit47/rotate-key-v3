import Link from 'next/link';
import { redirect, RedirectType } from 'next/navigation';

import Logo from '@/components/shared/logo';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { requireAuth } from '@/lib/requireAuth';
import { caller } from '@/trpc/server';

export default async function OAuthRedirectPage() {
  const { user } = await requireAuth();

  // if user is not complete with social sign in, then trigger the background task to complete the social sign in process and redirect to onboarding page
  if (!user.isSocialSignInComplete) {
    await caller.auth.oauthSignUpComplete();

    // if user is not onboarded, redirect to onboarding page
    if (!user.isOnboarded) {
      return redirect('/onboarding', RedirectType.replace);
    }
  }

  // if user is already signed up with OAuth and is onboarded, then redirect to homepage
  if (user.isSocialSignInComplete) {
    return redirect('/', RedirectType.replace);
  }

  return (
    <Card className='z-1 w-full gap-3 border-none shadow-md sm:max-w-lg'>
      <CardHeader className='gap-6'>
        <Logo className='gap-3' />

        <div>
          <CardTitle className='mb-1.5 text-2xl'>
            <h1 className='text-2xl font-bold text-center'>
              OAuth Redirecting...
            </h1>
          </CardTitle>
          <CardDescription className='text-sm text-center'>
            <p className='text-muted-foreground text-sm text-balance'>
              You are being redirected back to the application after
              authenticating with your OAuth provider. Please wait a moment...
            </p>
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <div className={'flex items-center justify-center w-full mx-auto'}>
          <div>
            <Spinner className={'size-4 md:size-6 lg:size-8'} />
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <p className='text-muted-foreground text-center text-xs'>
          If you are not redirected automatically, please{' '}
          <Link
            href='#'
            className='text-card-foreground underline hover:no-underline'>
            click here
          </Link>{' '}
          to return to the homepage.
        </p>
      </CardFooter>
    </Card>
  );
}
