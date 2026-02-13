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
import { signIn } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconBrandFacebook, IconBrandGoogle } from '@tabler/icons-react';
import Link from 'next/link';
import { useTransition } from 'react';
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const loginSchema = z.object({
  email: z.email('Provide correct email id').min(1, 'Email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  rememberMe: z.boolean(),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<'form'>) {
  const [isSignInPending, startSignInTransition] = useTransition();

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
    });
  };

  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      {...props}
      onSubmit={form.handleSubmit(onSubmit, onError)}>
      <FieldSet disabled={isSignInPending}>
        <FieldGroup>
          <div className='flex flex-col items-center gap-1 text-center'>
            <h1 className='text-2xl font-bold'>Login to your account</h1>
            <p className='text-muted-foreground text-sm text-balance'>
              Enter your email below to login to your account
            </p>
          </div>
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
                    href='#'
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
          <FieldSeparator>Or continue with</FieldSeparator>
          <Field>
            <Button variant='outline' type='button' disabled={isSignInPending}>
              <IconBrandGoogle className='mr-2 size-4' />
              Sign up with Google
            </Button>
            <Button variant='outline' type='button' disabled={isSignInPending}>
              <IconBrandFacebook className='mr-2 size-4' />
              Sign up with Facebook
            </Button>
            <FieldDescription className='text-center'>
              Don&apos;t have an account?{' '}
              <Link href='/sign-up' className='underline underline-offset-4'>
                Sign up
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
