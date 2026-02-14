import Logo from '@/components/shared/logo';
import { ChevronLeftIcon } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ResetPasswordForm from '@/features/auth/reset-password-form';
import Link from 'next/link';

export default function ResetPasswordPage() {
  return (
    <Card className='z-1 w-full border-none shadow-md sm:max-w-md'>
      <CardHeader className='gap-6'>
        <Logo className='gap-3' />

        <div>
          <CardTitle className='mb-1.5 text-2xl'>Reset Password</CardTitle>
          <CardDescription className='text-base'>
            Enter your email and choose a new password to update your account
            security.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* ResetPassword Form */}
        <ResetPasswordForm />

        <Link href='/' className='group mx-auto flex w-fit items-center gap-2'>
          <ChevronLeftIcon className='size-5 transition-transform duration-200 group-hover:-translate-x-0.5' />
          <span>Back to login</span>
        </Link>
      </CardContent>
    </Card>
  );
}
