import { ChevronLeftIcon } from 'lucide-react';

import Logo from '@/components/shared/logo';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ForgotPasswordForm from '@/features/auth/forgot-password-form';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <Card className='z-1 w-full border-none shadow-md sm:max-w-md'>
      <CardHeader className='gap-6'>
        <Logo className='gap-3' />

        <div>
          <CardTitle className='mb-1.5 text-2xl'>Forgot Password?</CardTitle>
          <CardDescription className='text-base'>
            Enter your email and we&apos;ll send you instructions to reset your
            password
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* ForgotPassword Form */}
        <ForgotPasswordForm />

        <Link
          href='/login'
          className='group mx-auto flex w-fit items-center gap-2'>
          <ChevronLeftIcon className='size-5 transition-transform duration-200 group-hover:-translate-x-0.5' />
          <span>Back to login</span>
        </Link>
      </CardContent>
    </Card>
  );
}
