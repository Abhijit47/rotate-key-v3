'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { IconBrandFacebook, IconBrandGoogle } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// import { useState } from 'react';
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
import { Route } from 'next';
import {
  useSignInWithFacebook,
  useSignInWithGoogle,
  useSignUpUser,
} from '../hooks/use-auth';

export default function SignupForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  // const [isSignUpPending, setIsSignUpPending] = useState(false);
  // const [isPendingGoogleSignUp, setIsGoogleSignUp] = useState(false);
  // const [isPendingFacebookSignUp, setIsFacebookSignUp] = useState(false);

  const router = useRouter();

  const { mutateAsync: signUpWithEmail, isPending: isSignUpWithEmail } =
    useSignUpUser();
  const {
    mutateAsync: signInWithGoogle,
    isPending: isSignInWithGooglePending,
  } = useSignInWithGoogle();
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
    // setIsSignUpPending(true);
    // let signUpSucceeded = false;

    toast.promise(signUpWithEmail(values), {
      loading: 'Creating Account...',
      success: ({ user }) => {
        const name = user?.name || 'User';
        // signUpSucceeded = true;
        form.reset();
        return (
          <p className={'text-sm'}>
            Account created successfully! Welcome, <strong>{name}</strong>!
            Redirecting to onboarding...
          </p>
        );
      },
      error: (err) => err.message || 'Failed to create account',
      finally: () => {
        // setIsSignUpPending(false);
        if (!isSignUpWithEmail) {
          setTimeout(() => {
            router.push('/onboarding');
          }, 1500);
        }
      },
    });
  };

  function handleGoogleSignUp() {
    // setIsGoogleSignUp(true);
    toast.promise(
      // signIn.social({
      //   provider: 'google',
      //   callbackURL: `${window.location.origin}/`,
      //   newUserCallbackURL: `${window.location.origin}/onboarding`,
      //   errorCallbackURL: `${window.location.origin}/login?error=google_auth_failed`,
      //   requestSignUp: true,
      // }),
      signInWithGoogle,
      {
        loading: 'Redirecting to Google...',
        success: (data) => {
          console.log('Google sign-in response client:', data);
          router.push(data.url as Route);
          return 'Redirected to Google for authentication';
        },
        error: (error) => {
          return (
            error?.message || 'Failed to redirect to Google. Please try again.'
          );
        },
        // finally: () => {
        //   setIsGoogleSignUp(false);
        // },
      },
    );
  }

  function handleFacebookSignUp() {
    // setIsFacebookSignUp(true);
    toast.promise(
      // signIn.social({
      //   provider: 'facebook',
      //   callbackURL: `${window.location.origin}/`,
      //   newUserCallbackURL: `${window.location.origin}/onboarding`,
      //   errorCallbackURL: `${window.location.origin}/login?error=facebook_auth_failed`,
      //   requestSignUp: true,
      // }),
      signInWithFacebook,
      {
        loading: 'Redirecting to Facebook...',
        success: (data) => {
          router.push(data.url as Route);
          return 'Redirected to Facebook for authentication';
        },
        error: (error) => {
          return (
            error?.message ||
            'Failed to redirect to Facebook. Please try again.'
          );
        },
        // finally: () => {
        //   setIsFacebookSignUp(false);
        // },
      },
    );
  }

  // const disabledState =
  //   isPendingGoogleSignUp || isPendingFacebookSignUp || isSignUpPending;

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
              onClick={handleGoogleSignUp}>
              <IconBrandGoogle className='mr-2 size-4' />
              Sign up with Google
            </Button>
            <Button
              variant='outline'
              type='button'
              disabled={disabledState}
              onClick={handleFacebookSignUp}>
              <IconBrandFacebook className='mr-2 size-4' />
              Sign up with Facebook
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
