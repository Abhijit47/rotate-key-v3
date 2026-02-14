import Logo from '@/components/shared/logo';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import TwoFactorAuthenticationForm from '@/features/auth/two-factor-authentication-form';

export default function TwoFactorAuthentication() {
  return (
    <Card className='z-1 w-full border-none shadow-md sm:max-w-md'>
      <CardHeader className='gap-6'>
        <Logo className='gap-3' />

        <div>
          <CardTitle className='mb-1.5 text-2xl'>
            Two Factor Authentication
          </CardTitle>
          <CardDescription className='text-base'>
            Please confirm access to your account by entering the code provided
            by your authenticator application
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        {/* TwoFactorAuthentication Form */}
        <TwoFactorAuthenticationForm />
      </CardContent>
    </Card>
  );
}
