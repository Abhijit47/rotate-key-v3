import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import Logo from '@/components/shared/logo';
import SignupForm from '@/features/auth/signup-form';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <Card className='z-1 w-full border-none shadow-md sm:max-w-lg'>
      <CardHeader className='gap-6'>
        <Logo className='gap-3' />

        <div>
          <CardTitle className='mb-1.5 text-2xl'>
            <h1 className='text-2xl font-bold'>Create your account</h1>
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
        <div className='space-y-4'>
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
