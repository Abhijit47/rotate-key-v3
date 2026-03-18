'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { signIn } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { loginSchema, LoginValues } from '@/lib/validators/auth-schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconBrandFacebook, IconBrandGoogle } from '@tabler/icons-react';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { toast } from 'sonner';

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const [isSignInPending, startSignInTransition] = useTransition();
  const [isPendingGoogleSignIn, setIsGoogleSignIn] = useState(false);
  const [isPendingFacebookSignIn, setIsFacebookSignIn] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    mode: 'onChange',
  });

  const onError: SubmitErrorHandler<LoginValues> = (errors) => {
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

  const onSubmit: SubmitHandler<LoginValues> = (values) => {
    // console.log('Form submitted successfully with data:', data);
    startSignInTransition(async () => {
      try {
        const result = await signIn.email({
          email: values.email,
          password: values.password,
          rememberMe: values.rememberMe,
          callbackURL: `${window.location.origin}/`,
        });
        if (result.error) {
          toast.error(result.error.message, {
            duration: 3000,
          });
          return;
        }
        toast.success('Login successful! Redirecting...', {
          duration: 3000,
        });
        form.reset();
      } catch (error) {
        console.error('Login error:', error);
        toast.error('An unexpected error occurred. Please try again.', {
          duration: 3000,
        });
      }
    });
  };

  function handleGoogleSignIn() {
    setIsGoogleSignIn(true);
    toast.promise(
      signIn.social({
        provider: 'google',
        callbackURL: `${window.location.origin}/`,
        newUserCallbackURL: `${window.location.origin}/onboarding`,
        errorCallbackURL: `${window.location.origin}/login?error=google_auth_failed`,
        requestSignUp: true,
      }),
      {
        loading: 'Redirecting to Google...',
        success: () => {
          return 'Redirected to Google for authentication';
        },
        error: (error) => {
          return (
            error?.message || 'Failed to redirect to Google. Please try again.'
          );
        },
        finally: () => {
          setIsGoogleSignIn(false);
        },
      },
    );
  }

  function handleFacebookSignIn() {
    setIsFacebookSignIn(true);
    toast.promise(
      signIn.social({
        provider: 'facebook',
        callbackURL: `${window.location.origin}/`,
        newUserCallbackURL: `${window.location.origin}/onboarding`,
        errorCallbackURL: `${window.location.origin}/login?error=facebook_auth_failed`,
        requestSignUp: true,
      }),
      {
        loading: 'Redirecting to Facebook...',
        success: () => {
          return 'Redirected to Facebook for authentication';
        },
        error: (error) => {
          return (
            error?.message ||
            'Failed to redirect to Facebook. Please try again.'
          );
        },
        finally: () => {
          setIsFacebookSignIn(false);
        },
      },
    );
  }

  const disabledState =
    isPendingGoogleSignIn || isPendingFacebookSignIn || isSignInPending;

  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      {...props}
      onSubmit={form.handleSubmit(onSubmit, onError)}>
      <FieldSet disabled={disabledState}>
        <FieldGroup className={'gap-3'}>
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
                {fieldState.error && (
                  <FieldError role='alert' errors={[fieldState.error]} />
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
                <div className='flex items-center'>
                  <FieldLabel htmlFor='password'>Password</FieldLabel>
                  <Link
                    href='/forgot-password'
                    className='ml-auto text-sm underline-offset-4 hover:underline'>
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id='password'
                  type='password'
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
            name='rememberMe'
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                orientation='horizontal'
                data-invalid={fieldState.invalid}
                aria-invalid={fieldState.invalid}>
                <Checkbox
                  id='rememberMe'
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                  aria-invalid={fieldState.invalid}
                />
                <FieldLabel htmlFor='rememberMe' className='font-normal'>
                  Remember me
                </FieldLabel>
                {fieldState.error && (
                  <FieldError role='alert' errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Field>
            <Button type='submit' disabled={isSignInPending}>
              {isSignInPending ? (
                <span className={'inline-flex items-center gap-2'}>
                  Logging in...
                  <Spinner />
                </span>
              ) : (
                'Login'
              )}
            </Button>
          </Field>

          <FieldGroup>
            <FieldSeparator>Or continue with</FieldSeparator>

            <Field>
              <Button
                variant='outline'
                type='button'
                disabled={disabledState}
                onClick={handleGoogleSignIn}>
                <IconBrandGoogle className='mr-2 size-4' />
                Log in with Google
              </Button>
              <Button
                variant='outline'
                type='button'
                disabled={disabledState}
                onClick={handleFacebookSignIn}>
                <IconBrandFacebook className='mr-2 size-4' />
                Log in with Facebook
              </Button>
            </Field>
          </FieldGroup>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
