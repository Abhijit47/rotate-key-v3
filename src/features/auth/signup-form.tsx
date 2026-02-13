'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { signUp } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconBrandFacebook, IconBrandGoogle } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const signupSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Full name must be at least 2 characters long')
      .max(100, 'Full name must be less than 100 characters long'),
    email: z.email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z
      .string()
      .min(8, 'Confirm password must be at least 8 characters long'),
    privacyAndTerms: z.boolean().refine((value) => value === true, {
      message: 'You must accept the privacy policy and terms of service',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignupValues = z.infer<typeof signupSchema>;

export default function SignupForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const [isSignUpPending, setIsSignUpTransition] = useState(false);

  const router = useRouter();

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      privacyAndTerms: false,
    },
    mode: 'onChange',
  });

  const onError: SubmitErrorHandler<SignupValues> = (errors) => {
    Object.entries(errors).forEach(([fieldName, error]) => {
      if (error) {
        toast.error(error.message, {
          description: `Error in ${fieldName}`,
          descriptionClassName: 'text-[10px] text-balance',
        });
      }
    });
  };

  const onSubmit: SubmitHandler<SignupValues> = (values) => {
    setIsSignUpTransition(true);
    toast.promise(
      signUp.email({
        email: values.email,
        password: values.password,
        name: values.fullName,
        callbackURL: `${window.location.origin}/onboarding`,
      }),
      {
        loading: 'Creating Account...',
        success: ({ data }) => {
          const name = data?.user?.name || 'User';
          form.reset();
          router.push('/onboarding');
          return (
            <p className={'text-sm'}>
              Account created successfully! Welcome, <strong>{name}</strong>!
              Redirecting to onboarding...
            </p>
          );
        },
        error: (err) => err.message || 'Failed to create account',
        finally: () => {
          setIsSignUpTransition(false);
        },
      },
    );
  };

  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      {...props}
      onSubmit={form.handleSubmit(onSubmit, onError)}>
      <FieldSet disabled={isSignUpPending}>
        <FieldGroup className={'gap-2'}>
          <div className='flex flex-col items-center gap-1 text-center'>
            <h1 className='text-2xl font-bold'>Create your account</h1>
            <p className='text-muted-foreground text-sm text-balance'>
              Fill in the form below to create your account
            </p>
          </div>
          <Controller
            name='fullName'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                aria-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='name'>Full Name</FieldLabel>
                <Input
                  id='name'
                  type='text'
                  placeholder='John Doe'
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
            name='email'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                aria-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='email'>Email</FieldLabel>
                <Input
                  id='email'
                  type='email'
                  placeholder='m@example.com'
                  {...field}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error ? (
                  <FieldError role='alert' errors={[fieldState.error]} />
                ) : (
                  <FieldDescription>
                    We&apos;ll use this to contact you. We will not share your
                    email with anyone else.
                  </FieldDescription>
                )}
              </Field>
            )}
          />

          <Controller
            name='password'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                aria-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='password'>Password</FieldLabel>
                <Input
                  id='password'
                  type='password'
                  placeholder='********'
                  {...field}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error ? (
                  <FieldError role='alert' errors={[fieldState.error]} />
                ) : (
                  <FieldDescription>
                    Must be at least 8 characters long.
                  </FieldDescription>
                )}
              </Field>
            )}
          />

          <Controller
            name='confirmPassword'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                aria-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='confirm-password'>
                  Confirm Password
                </FieldLabel>
                <Input
                  id='confirm-password'
                  type='password'
                  {...field}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.error ? (
                  <FieldError role='alert' errors={[fieldState.error]} />
                ) : (
                  <FieldDescription>
                    Please confirm your password.
                  </FieldDescription>
                )}
              </Field>
            )}
          />

          <Controller
            name='privacyAndTerms'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                orientation='horizontal'
                data-invalid={fieldState.invalid}
                aria-invalid={fieldState.invalid}>
                <Checkbox
                  id='privacyAndTerms'
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                  aria-invalid={fieldState.invalid}
                />
                <FieldLabel htmlFor='privacyAndTerms' className='font-normal'>
                  I agree to the{' '}
                  <Link href='#' className='underline-offset-4 hover:underline'>
                    Privacy Policy
                  </Link>{' '}
                  and{' '}
                  <Link href='#' className='underline-offset-4 hover:underline'>
                    Terms of Service
                  </Link>
                </FieldLabel>
                {fieldState.error && (
                  <FieldError role='alert' errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Field>
            <Button type='submit' disabled={isSignUpPending}>
              {isSignUpPending ? (
                <span className={'inline-flex items-center gap-2'}>
                  Creating Account...
                  <Spinner />
                </span>
              ) : (
                'Create Account'
              )}
            </Button>
          </Field>
          <FieldSeparator>Or continue with</FieldSeparator>
          <Field>
            <Button variant='outline' type='button' disabled={isSignUpPending}>
              <IconBrandGoogle className='mr-2 size-4' />
              Sign up with Google
            </Button>
            <Button variant='outline' type='button' disabled={isSignUpPending}>
              <IconBrandFacebook className='mr-2 size-4' />
              Sign up with Facebook
            </Button>
            <FieldDescription className='px-6 text-center'>
              Already have an account? <Link href='/login'>Sign in</Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
