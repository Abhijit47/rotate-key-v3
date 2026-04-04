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
import { cn } from '@/lib/utils';
import { loginSchema, LoginValues } from '@/lib/validators/auth-schemas';
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
import {
  useSignInEmail,
  useSignInWithFacebook,
  useSignInWithGoogle,
} from '../hooks/use-auth';

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  // email-password
  const { mutateAsync: signInWithEmail, isPending: isSignInWithEmail } =
    useSignInEmail();
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

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'codedevarmy@gmail.com',
      password: 'Admin@123',
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
    toast.promise(signInWithEmail(values), {
      loading: 'Logging in...',
      success: ({ user }) => {
        const name = user?.name || 'User';
        form.reset();
        return (
          <p className={'text-sm'}>
            Login successful! Welcome back, <strong>{name}</strong>!
            Redirecting...
          </p>
        );
      },
      error: (err) => {
        console.warn('Login error:', err);
        form.reset();
        // const errorMessage =
        //   err.message === 'account exists'
        //     ? 'An account with this email already exists. Please sign in or use a different email.'
        //     : 'Failed to create account. Please try again.';
        // for unexpected errors, we can show a generic message but log the details for debugging
        return err.message || 'An unexpected error occurred. Please try again.';
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

  // const disabledState =
  //   isPendingGoogleSignIn || isPendingFacebookSignIn || isSignInPending;

  const disabledState =
    isSignInWithEmail ||
    isSignInWithGooglePending ||
    isSignInWithFacebookPending;

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
            <Button type='submit' disabled={disabledState}>
              {disabledState ? (
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
                {disabledState ? (
                  <span className={'inline-flex items-center gap-2'}>
                    Logging in...
                    <Spinner />
                  </span>
                ) : (
                  <span className={'inline-flex items-center gap-2'}>
                    <IconBrandGoogle className='mr-2 size-4' />
                    Log in with Google
                  </span>
                )}
              </Button>
              <Button
                variant='outline'
                type='button'
                disabled={disabledState}
                onClick={handleFacebookSignIn}>
                {disabledState ? (
                  <span className={'inline-flex items-center gap-2'}>
                    Logging in...
                    <Spinner />
                  </span>
                ) : (
                  <span className={'inline-flex items-center gap-2'}>
                    <IconBrandFacebook className='mr-2 size-4' />
                    Log in with Facebook
                  </span>
                )}
              </Button>
            </Field>
          </FieldGroup>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
