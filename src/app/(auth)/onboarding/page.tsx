import { ChevronRightIcon } from 'lucide-react';

import Logo from '@/components/shared/logo';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import OnboardingForm from '@/features/auth/onboarding-form';
import Link from 'next/link';

export default function OnboardingPage() {
  return (
    <Card className='z-1 w-full border-none shadow-md sm:max-w-md'>
      <CardHeader className='gap-6'>
        <Logo className='gap-3' />

        <div>
          <CardTitle className='mb-1.5 text-2xl'>
            Welcome, let&apos;s get you set up!
          </CardTitle>
          <CardDescription className='text-base'>
            We just need a few more details to give you a more personalized
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* Onboarding Form */}
        <OnboardingForm />

        <Link href='/' className='group mx-auto flex w-fit items-center gap-2'>
          <span>Skip for now</span>
          <ChevronRightIcon className='size-5 transition-transform duration-200 group-hover:-translate-x-0.5' />
        </Link>
      </CardContent>
    </Card>
  );
}
