'use client';

import { REGEXP_ONLY_DIGITS } from 'input-otp';

import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useState } from 'react';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { useFormContext } from 'react-hook-form';
import { ConfidentialInformationClientValues } from '@/lib/validators/profile-schemas';
import { Dispatch, SetStateAction } from 'react';

type VerifyPhoneOTPProps = {
  phoneNumber: string;
  isValidatedNumber: boolean;
  onValidatedNumber: Dispatch<SetStateAction<boolean>>;
};

export default function VerifyPhoneOTP(props: VerifyPhoneOTPProps) {
  const { phoneNumber, isValidatedNumber, onValidatedNumber } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');

  const form =
    useFormContext<
      Pick<ConfidentialInformationClientValues, 'contactNumber'>
    >();

  function toggleDialog() {
    if (phoneNumber.length > 1) {
      if (!isValidPhoneNumber(phoneNumber)) {
        form.setError(
          'contactNumber',
          {
            message: 'Expect valid phone number',
          },
          { shouldFocus: true },
        );
        form.setValue('contactNumber', '');
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size='xs' variant='secondary'>
          Verify
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-sm'>
        <DialogHeader>
          <DialogTitle>Enter OTP</DialogTitle>
          <DialogDescription>
            Please enter the OTP, that you recieved your phone.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor='valid-otp'>Valid OTP</FieldLabel>
            <InputOTP
              id='valid-otp'
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
              disabled={false}
              value={value}
              onChange={(value) => setValue(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose asChild>
            <Button size='sm' variant='outline'>
              Cancel
            </Button>
          </DialogClose>
          <Button size='sm' type='submit'>
            Verify
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
