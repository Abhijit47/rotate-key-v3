import { ArrowLeftCircle } from 'lucide-react';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import LoginForm from '@/features/auth/components/login-form';
import ThemeToggler from '@/features/common/components/theme-toggler';

const isDev = process.env.NODE_ENV === 'development';

export default function LoginPage() {
  return (
    <Card className='z-1 relative gap-3 shadow-md border-none w-full sm:max-w-lg'>
      {isDev ? (
        <span className='top-2 right-2 absolute'>
          <ThemeToggler />
        </span>
      ) : null}
      <CardHeader className='gap-6'>
        <CardAction className='justify-self-start col-start-1 row-span-1'>
          <Link
            href={'/'}
            className={buttonVariants({ variant: 'outline', size: 'icon-xs' })}>
            <ArrowLeftCircle />
          </Link>
        </CardAction>

        <div className='flex flex-col col-start-1 row-start-1 ml-8'>
          <CardTitle className='mb-1.5 text-2xl'>
            <h1 className='font-bold text-2xl'>Login to your account</h1>
          </CardTitle>
          <CardDescription className='text-base'>
            <p className='text-muted-foreground text-sm text-balance'>
              Enter your email below to login to your account
            </p>
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <p className='mb-6 text-muted-foreground'>
          Login with{' '}
          <Link href='#' className='text-card-foreground hover:underline'>
            Magic Link
          </Link>
        </p>

        {/* Login Form */}
        <div className='space-y-4'>
          <LoginForm />

          <p className='text-muted-foreground text-center'>
            New on our platform?{' '}
            <Link
              href='/sign-up'
              className='text-card-foreground underline underline-offset-2 hover:no-underline'>
              Create an account
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
