'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { IconBrandFacebook, IconBrandGoogle } from '@tabler/icons-react';
import Link from 'next/link';
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { toast } from 'sonner';

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
// import { signIn } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { signupSchema, SignupValues } from '@/lib/validators/auth-schemas';
// import { TRPCClientError } from '@trpc/client';
import {
  useSignInWithFacebook,
  useSignInWithGoogle,
  useSignUpUser,
} from '../hooks/use-auth';

export default function SignupForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  // email/password
  const { mutateAsync: signUpWithEmail, isPending: isSignUpWithEmail } =
    useSignUpUser();
  // social-google
  const {
    mutateAsync: signInWithGoogle,
    isPending: isSignInWithGooglePending,
  } = useSignInWithGoogle();
  // social-facebook
  const {
    mutateAsync: signInWithFacebook,
    isPending: isSignInWithFacebookPending,
  } = useSignInWithFacebook();

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
      return;
    });
  };

  const onSubmit: SubmitHandler<SignupValues> = (values) => {
    toast.promise(signUpWithEmail(values), {
      loading: 'Creating Account...',
      success: ({ user }) => {
        const name = user?.name || 'User';
        form.reset();
        // shifted inside hook
        // if (!isSignUpWithEmail) {
        //   setTimeout(() => {
        //     router.push('/onboarding');
        //   }, 1500);
        // }
        return (
          <p className={'text-sm'}>
            Account created successfully! Welcome, <strong>{name}</strong>!
            Redirecting to onboarding...
          </p>
        );
      },
      error: (err) => {
        // const trpcSignUpError = new TRPCClientError(err);
        // if (trpcSignUpError.data?.code === 'BAD_REQUEST') {
        //   // expected error, account already exists, so we can guide them to the login page from hook
        //   form.reset();
        //   return trpcSignUpError.message;
        // }
        form.reset();
        const errorMessage =
          err.message === 'account exists'
            ? 'An account with this email already exists. Please sign in or use a different email.'
            : 'Failed to create account. Please try again.';
        // for unexpected errors, we can show a generic message but log the details for debugging
        return errorMessage;
      },
    });
  };

  function handleGoogleSignIn() {
    toast.promise(signInWithGoogle, {
      loading: 'Redirecting to Google...',
      success: () => {
        // console.log('Google sign-in response client:', data);
        // router.push(data.url as Route);
        return 'Redirected to Google for authentication';
      },
      error: (error) => {
        return (
          error?.message || 'Failed to redirect to Google. Please try again.'
        );
      },
    });
  }

  function handleFacebookSignIn() {
    toast.promise(signInWithFacebook, {
      loading: 'Redirecting to Facebook...',
      success: () => {
        // router.push(data.url as Route);
        return 'Redirected to Facebook for authentication';
      },
      error: (error) => {
        return (
          error?.message || 'Failed to redirect to Facebook. Please try again.'
        );
      },
    });
  }
  const disabledState =
    isSignUpWithEmail ||
    isSignInWithGooglePending ||
    isSignInWithFacebookPending;

  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      {...props}
      onSubmit={form.handleSubmit(onSubmit, onError)}>
      <FieldSet disabled={disabledState}>
        <FieldGroup className='gap-4'>
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
              <FieldGroup className={'gap-1'}>
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
                    <Link
                      href='#'
                      className='underline-offset-4 hover:underline'>
                      Privacy Policy
                    </Link>{' '}
                    and{' '}
                    <Link
                      href='#'
                      className='underline-offset-4 hover:underline'>
                      Terms of Service
                    </Link>
                  </FieldLabel>
                </Field>
                {fieldState.error && (
                  <FieldError role='alert' errors={[fieldState.error]} />
                )}
              </FieldGroup>
            )}
          />
          <Field>
            <Button type='submit' disabled={disabledState}>
              {isSignUpWithEmail ? (
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
            <Button
              variant='outline'
              type='button'
              disabled={disabledState}
              onClick={handleGoogleSignIn}>
              <IconBrandGoogle className='mr-2 size-4' />
              Continue with Google
            </Button>
            <Button
              variant='outline'
              type='button'
              disabled={disabledState}
              onClick={handleFacebookSignIn}>
              <IconBrandFacebook className='mr-2 size-4' />
              Continue with Facebook
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
