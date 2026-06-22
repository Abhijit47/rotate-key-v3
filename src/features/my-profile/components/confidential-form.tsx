'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Controller,
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  useWatch,
} from 'react-hook-form';
import { toast } from 'sonner';
import { IconReload } from '@tabler/icons-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TRPCClientError } from '@trpc/client';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldError,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PhoneInput } from '@/components/extends/phone-input';
import VerifyPhoneOTP from './verify-phone-otp';

import { generateBirthYears } from '@/lib/utils';
import {
  confidentialInformationSchema,
  type ConfidentialInformationClientValues,
} from '@/lib/validators/profile-schemas';
import { useUpdateConfidentialInformation } from '@/features/users/hooks/use-user';
import { ClientSession } from '@/lib/auth-client';
import {
  LazyPreviewProfileDocument,
  LazyUploadProfileDocumentDialog,
} from './lazy';

type ConfidentialInformationFormProps = {
  confidentialInformation: Pick<
    ClientSession['user'],
    | 'yearOfBirth'
    | 'contactNumber'
    | 'email'
    | 'profileVerificationDocument'
    | 'isProfileDocumentVerified'
  >;
};

export default function ConfidentialForm(
  props: ConfidentialInformationFormProps,
) {
  const [isValidatedNumber, setIsValidatedNumber] = useState(false);
  const router = useRouter();

  const { confidentialInformation } = props;
  const { mutateAsync, isPending } = useUpdateConfidentialInformation();

  const form = useForm<ConfidentialInformationClientValues>({
    resolver: zodResolver(confidentialInformationSchema),
    defaultValues: {
      yearOfBirth: confidentialInformation.yearOfBirth,
      contactNumber: confidentialInformation.contactNumber,
      email: confidentialInformation.email,
      password: '',
      confirmPassword: '',
      profileDocument: confidentialInformation.profileVerificationDocument,
      isUploaded: false,
    },
    mode: 'onChange',
  });

  const isProfileDocument = Boolean(
    confidentialInformation.profileVerificationDocument,
  );

  const onError: SubmitErrorHandler<ConfidentialInformationClientValues> = (
    errors,
  ) => {
    // console.log('Form errors:', errors);
    Object.keys(errors).forEach((field) => {
      const error = errors[field as keyof ConfidentialInformationClientValues];
      if (error) {
        toast.error(error.message);
      }
    });
  };

  const onSubmit: SubmitHandler<ConfidentialInformationClientValues> = (
    values,
  ) => {
    toast.promise(mutateAsync({ ...values }), {
      description: 'Please wait we are updating your information',
      descriptionClassName: 'text-[10px]',
      loading: 'Processing...',
      success: () => {
        router.refresh();
        return 'Confidential information updated successfully';
      },
      error: (err) => {
        if (err instanceof TRPCClientError) {
          return err.message;
        }
        return 'Failed to update confidential information.';
      },
    });
  };

  const watchedPhoneNumber = useWatch({
    name: 'contactNumber',
    control: form.control,
    compute: (val) => {
      if (val?.length && val.length > 1) {
        return val;
      }
      return '';
    },
  });

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className='w-full h-full'
      >
        <FieldSet className={'gap-3'}>
          <FieldLegend>Confidential Information</FieldLegend>
          <FieldSeparator />

          <div className='grid grid-cols-2 gap-4'>
            <Controller
              name='yearOfBirth'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  aria-invalid={fieldState.invalid}
                >
                  <FieldLabel htmlFor='yearOfBirth'>Year of Birth</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value ?? ''}
                    onValueChange={(e) => field.onChange(e)}
                  >
                    <SelectTrigger
                      id='yearOfBirth'
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder='YYYY' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Choose your birth year</SelectLabel>
                        {generateBirthYears().map((year) => {
                          return (
                            <SelectItem key={year} value={year}>
                              {year}
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />

            <Controller
              name='contactNumber'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  className='gap-2'
                  data-invalid={fieldState.invalid}
                  aria-invalid={fieldState.invalid}
                >
                  <FieldLabel htmlFor='contactNumber'>
                    Contact Number
                  </FieldLabel>

                  <div className='flex items-center gap-2'>
                    <PhoneInput
                      international
                      defaultCountry='IN'
                      placeholder='Enter a phone number'
                      {...field}
                      value={field?.value?.length ? field.value : ''}
                      aria-invalid={fieldState.invalid}
                    />
                    <VerifyPhoneOTP
                      phoneNumber={watchedPhoneNumber}
                      isValidatedNumber={isValidatedNumber}
                      onValidatedNumber={setIsValidatedNumber}
                    />
                  </div>

                  {fieldState.invalid && (
                    <FieldError
                      className='text-xs'
                      errors={[fieldState.error]}
                    />
                  )}
                </Field>
              )}
            />
          </div>

          <Controller
            name='email'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                className='gap-2'
                data-invalid={fieldState.invalid}
                aria-invalid={fieldState.invalid}
              >
                <FieldLabel htmlFor='email'>Email</FieldLabel>
                <Input
                  id='email'
                  placeholder='someone@gmail.com'
                  type='email'
                  {...field}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError className='text-xs' errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className='grid grid-cols-2 gap-4'>
            <Controller
              name='password'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  className='gap-2'
                  data-invalid={fieldState.invalid}
                  aria-invalid={fieldState.invalid}
                >
                  <FieldLabel htmlFor='password'>Password</FieldLabel>
                  <Input
                    id='password'
                    placeholder='********'
                    type='password'
                    {...field}
                    value={field?.value?.length ? field.value : ''}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError
                      className='text-xs'
                      errors={[fieldState.error]}
                    />
                  )}
                </Field>
              )}
            />

            <Controller
              name='confirmPassword'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  className='gap-2'
                  data-invalid={fieldState.invalid}
                  aria-invalid={fieldState.invalid}
                >
                  <FieldLabel htmlFor='confirmPassword'>
                    Confirm Password
                  </FieldLabel>
                  <Input
                    id='confirmPassword'
                    placeholder='********'
                    type='password'
                    {...field}
                    value={field?.value?.length ? field.value : ''}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError
                      className='text-xs'
                      errors={[fieldState.error]}
                    />
                  )}
                </Field>
              )}
            />
          </div>

          <LazyPreviewProfileDocument
            confidentialInformation={confidentialInformation}
          />

          {isProfileDocument ? <LazyUploadProfileDocumentDialog /> : null}

          <FieldSeparator />

          <Field orientation='horizontal' className='justify-end gap-2'>
            <Button type='submit' size={'sm'} disabled={isPending}>
              {isPending ? 'Updating...' : 'Update'}
            </Button>
            <Button
              variant='outline'
              type='button'
              size={'sm'}
              disabled={isPending}
            >
              Cancel
            </Button>
          </Field>
        </FieldSet>
      </form>
    </FormProvider>
  );
}
