import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import Logo from '@/components/shared/logo';
import LoginForm from '@/features/auth/login-form';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <Card className='z-1 w-full gap-3 border-none shadow-md sm:max-w-lg'>
      <CardHeader className='gap-6'>
        <Logo className='gap-3' />

        <div>
          <CardTitle className='mb-1.5 text-2xl'>
            <h1 className='text-2xl font-bold'>Login to your account</h1>
          </CardTitle>
          <CardDescription className='text-base'>
            <p className='text-muted-foreground text-sm text-balance'>
              Enter your email below to login to your account
            </p>
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <p className='text-muted-foreground mb-6'>
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
