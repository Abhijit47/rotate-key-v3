'use client';

import { Button } from '@/components/ui/button';
import { FieldGroup, FieldSet } from '@/components/ui/field';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';

export default function VerifyOtpForm() {
  return (
    <form className='space-y-4' onSubmit={(e) => e.preventDefault()}>
      <FieldSet>
        <FieldGroup className={'gap-3'}>
          <div className='flex items-center justify-between gap-1'>
            <Label htmlFor='recoveryCode' className='text-base'>
              Code*
            </Label>
          </div>

          <InputOTP id='recoveryCode' maxLength={6}>
            <InputOTPGroup className='w-full justify-center gap-4 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border'>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          <Button className='w-full' type='submit'>
            Verify OTP
          </Button>

          <p className='text-muted-foreground text-center text-xs'>
            Didn&apos;t get the email?
          </p>

          <Button className='w-full' variant={'outline'}>
            Resend
          </Button>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
