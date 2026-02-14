'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import {
  onboardingSchema,
  OnboardingValues,
} from '@/lib/validators/auth-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { PartyPopper } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { toast } from 'sonner';
import { useOnboardUser } from './hooks/use-auth';

const inputLabelClassName =
  'origin-start text-muted-foreground group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:text-foreground absolute top-1/2 block -translate-y-1/2 cursor-text px-2 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium';

export default function OnboardingForm() {
  const router = useRouter();

  const form = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      whereAreYouFrom: '',
      whereDoYouWantToGo: '',
    },
    mode: 'onChange',
  });

  const { mutateAsync, isPending } = useOnboardUser();

  const onError: SubmitErrorHandler<OnboardingValues> = (errors) => {
    // console.log('Form validation errors:', errors);
    Object.entries(errors).forEach(([fieldName, error]) => {
      if (error) {
        toast.error(error.message, {
          description: `Error in ${fieldName}`,
          descriptionClassName: 'text-[10px] text-balance',
        });
      }
    });
  };

  const onSubmit: SubmitHandler<OnboardingValues> = (values) => {
    // console.log('Form submitted successfully with data:', data);
    toast.promise(mutateAsync(values), {
      loading: 'Onboarding in progress...',
      success: () => {
        return 'Onboarding successful! Redirecting...';
      },
      error: (error) => {
        return error?.message || 'Onboarding failed. Please try again.';
      },
      finally: () => {
        setTimeout(() => {
          router.push('/');
        }, 1000);
      },
    });

    return null;
  };

  return (
    <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit, onError)}>
      <FieldSet disabled={isPending} className='gap-4'>
        <Controller
          control={form.control}
          name='whereAreYouFrom'
          render={({ field, fieldState }) => (
            <Field
              className='group relative w-full'
              data-invalid={fieldState.invalid}
              aria-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor={'where-are-you-from'}
                className={cn(inputLabelClassName)}>
                Where are you from?
              </FieldLabel>
              <Input
                id={'where-are-you-from'}
                type='text'
                placeholder='ex: India'
                className='dark:bg-background'
                {...field}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && (
                <FieldError role='alert' errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name='whereDoYouWantToGo'
          render={({ field, fieldState }) => (
            <Field
              className='group relative w-full'
              data-invalid={fieldState.invalid}
              aria-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor={'where-are-you-going'}
                className={cn(inputLabelClassName)}>
                Where are you from?
              </FieldLabel>
              <Input
                id={'where-are-you-going'}
                type='text'
                placeholder='ex: Germany'
                className='dark:bg-background'
                {...field}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.error && (
                <FieldError role='alert' errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        <Button className='w-full' type='submit' disabled={isPending}>
          {isPending ? (
            <span className={'inline-flex items-center gap-2'}>
              Onboarding...
              <Spinner className='size-4' />
            </span>
          ) : (
            <span className={'inline-flex items-center gap-2'}>
              Complete your signup <PartyPopper className='size-5' />
            </span>
          )}
        </Button>
      </FieldSet>
    </form>
  );
}
