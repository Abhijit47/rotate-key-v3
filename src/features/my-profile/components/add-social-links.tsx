'use client';

import {
  IconBrandFacebook,
  IconBrandGoogle,
  IconBrandLinkedin,
  IconBrandX,
} from '@tabler/icons-react';
import { toast } from 'sonner';
import * as Sentry from '@sentry/nextjs';
import { useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { authClient, useSession } from '@/lib/auth-client';
import { Spinner } from '@/components/ui/spinner';

export default function AddSocialLinks() {
  const { linkSocial } = authClient;
  const { refetch } = useSession();
  const [isGooglePending, startGoogleTransition] = useTransition();
  const [isFacebookPending, startFacebookTransition] = useTransition();

  function handleLinkingGoogle() {
    startGoogleTransition(() => {
      toast.promise(
        linkSocial({
          provider: 'google',
          callbackURL: '/social-and-network',
        }),
        {
          description: 'Sit back and relax.',
          descriptionClassName: 'text-[10px]',
          loading: 'Please Wait...',
          success: async (data) => {
            await refetch({
              query: {
                disableCookieCache: true,
              },
            });
            Sentry.logger.error('Google linking success', {
              reason: data,
            });
            return 'Succesfully linking with google.';
          },
          error: (err) => {
            Sentry.logger.error('Google linking failed', {
              reason: err.message,
            });
            return 'Failed to linking with google.';
          },
        },
      );
    });
  }

  function handleLinkingFacebook() {
    startFacebookTransition(() => {
      toast.promise(
        linkSocial({
          provider: 'facebook',
          callbackURL: '/social-and-network',
        }),
        {
          description: 'Sit back and relax.',
          descriptionClassName: 'text-[10px]',
          loading: 'Please Wait...',
          success: async (data) => {
            await refetch({
              query: {
                disableCookieCache: true,
              },
            });
            Sentry.logger.error('facebook linking success', {
              reason: data,
            });
            return 'Succesfully linking with facebook.';
          },
          error: (err) => {
            Sentry.logger.error('facebook linking failed', {
              reason: err.message,
            });
            return 'Failed to linking with facebook.';
          },
        },
      );
    });
  }

  const isPending = isGooglePending || isFacebookPending;

  return (
    <Card className={'gap-3 py-4 h-full'}>
      <CardHeader>
        <CardTitle>Social and Network</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className={'space-y-4 h-full flex flex-col justify-center'}>
        <Button
          variant={'outline'}
          className={'w-full'}
          onClick={handleLinkingGoogle}
          disabled={isPending}
        >
          {isGooglePending ? (
            <span className='inline-flex items-center gap-2'>
              Processing...
              <Spinner className='size-4' />
            </span>
          ) : (
            <span className='inline-flex items-center gap-2'>
              <IconBrandGoogle className={'size-4'} />
              Link with Google
            </span>
          )}
        </Button>
        <Button
          variant={'outline'}
          className={'w-full'}
          onClick={handleLinkingFacebook}
          disabled={isPending}
        >
          {isFacebookPending ? (
            <span className='inline-flex items-center gap-2'>
              Processing...
              <Spinner className='size-4' />
            </span>
          ) : (
            <span className='inline-flex items-center gap-2'>
              <IconBrandFacebook className={'size-4'} />
              Link with Facebook
            </span>
          )}
        </Button>
        <Button
          variant={'outline'}
          className={'w-full'}
          disabled={isPending}
          onClick={() => {
            toast.info('Not implemented yet.');
          }}
        >
          <IconBrandX className={'size-4'} />
          Link with Twitter/X
        </Button>
        <Button
          variant={'outline'}
          className={'w-full'}
          disabled={isPending}
          onClick={() => {
            toast.info('Not implemented yet.');
          }}
        >
          <IconBrandLinkedin className={'size-4'} />
          Link with LinkedIn
        </Button>
      </CardContent>
    </Card>
  );
}
