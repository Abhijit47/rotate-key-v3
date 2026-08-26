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
import SignupForm from '@/features/auth/components/signup-form';
import ThemeToggler from '@/features/common/components/theme-toggler';

const isDev = process.env.NODE_ENV === 'development';

export default function SignupPage() {
  return (
    <Card className='z-1 relative gap-0 shadow-md border-none w-full sm:max-w-lg'>
      {isDev ? (
        <span className='top-2 right-2 absolute'>
          <ThemeToggler />
        </span>
      ) : null}
      <CardHeader className='gap-2'>
        <CardAction className='justify-self-start col-start-1 row-span-1'>
          <Link
            href={'/'}
            className={buttonVariants({ variant: 'outline', size: 'icon-xs' })}>
            <ArrowLeftCircle />
          </Link>
        </CardAction>

        <div className='flex flex-col col-start-1 row-start-1 ml-8'>
          <CardTitle className='mb-1.5 text-2xl'>
            <h1 className='font-bold text-2xl'>Create your account</h1>
          </CardTitle>
          <CardDescription className='text-base'>
            <p className='text-muted-foreground text-sm text-balance'>
              Fill in the form below to create your account
            </p>
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        {/* Register Form */}
        <div className='space-y-2'>
          <SignupForm />

          <p className='text-muted-foreground text-center'>
            Already have an account?{' '}
            <Link
              href='/login'
              className='text-card-foreground hover:underline'>
              Sign in instead
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
