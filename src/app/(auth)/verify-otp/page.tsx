import Logo from '@/components/shared/logo';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import VerifyOtpForm from '@/features/auth/verify-otp-form';

export default function VerifyOTPPage() {
  return (
    <Card className='z-1 w-full border-none shadow-md sm:max-w-md'>
      <CardHeader className='gap-6'>
        <Logo className='gap-3' />

        <div>
          <CardTitle className='mb-1.5 text-2xl'>Verify your email</CardTitle>
          <CardDescription className='text-sm'>
            An activation link has been sent to your email address:
            hello@example.com. Please check your inbox and click on the link to
            complete the activation process.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <VerifyOtpForm />
      </CardContent>
    </Card>
  );
}
