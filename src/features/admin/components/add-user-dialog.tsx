'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { IconCircleX, IconUserPlus } from '@tabler/icons-react';
import { useState } from 'react';
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
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
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { roles } from '@/constants/db-constants';
import {
  createUserSchema,
  CreateUserValues,
} from '@/lib/validators/admin-schemas';
import { useRouter } from 'next/navigation';
import { useCreateUser } from '../hooks/use-admin';

export default function AddUserModal() {
  const [isOpenAddUser, setIsOpenAddUser] = useState(false);
  const router = useRouter();
  const form = useForm<CreateUserValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'user',
    },
    mode: 'onChange',
  });

  const { mutateAsync, isPending } = useCreateUser();

  const onError: SubmitErrorHandler<CreateUserValues> = (errors) => {
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

  const onSubmit: SubmitHandler<CreateUserValues> = (data) => {
    toast.promise(mutateAsync(data), {
      loading: 'Creating user...',
      success: () => {
        setIsOpenAddUser(false);
        router.refresh();
        return 'User created successfully!';
      },
      error: 'Failed to create user.',
      finally: () => form.reset(),
      description: 'This may take a few seconds.',
      descriptionClassName: 'text-[10px] text-balance',
    });
  };

  return (
    <Dialog open={isOpenAddUser} onOpenChange={setIsOpenAddUser}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
          <IconUserPlus className={'size-4'} />
          <span className='hidden lg:inline'>Add User</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Add a new user</DialogTitle>
          <DialogDescription>
            Fill out the form below to add a new user to the platform.
          </DialogDescription>
        </DialogHeader>
        <form
          className='space-y-4'
          onSubmit={form.handleSubmit(onSubmit, onError)}>
          <FieldGroup className={'gap-3'}>
            <Controller
              name='name'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  aria-invalid={fieldState.invalid}>
                  <Label htmlFor='name'>Name</Label>
                  <Input
                    id='name'
                    placeholder='Pedro Duarte'
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
                    placeholder='someone@gmail.com'
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
                  <Label htmlFor='password'>Password</Label>
                  <Input
                    id='password'
                    type='password'
                    placeholder='********'
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
              name='role'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  aria-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='role'>Role</FieldLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    defaultValue={field.value}>
                    <SelectTrigger
                      className='w-full'
                      id='role'
                      data-invalid={fieldState.invalid}
                      aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder='Select a role' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Choose a role</SelectLabel>
                        {roles.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {fieldState.error && (
                    <FieldError role='alert' errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <Separator />
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant='outline'
                size='sm'
                onClick={() => form.reset()}
                disabled={isPending}>
                <IconCircleX className={'size-4'} />
                Cancel
              </Button>
            </DialogClose>
            <Button type='submit' size={'sm'} disabled={isPending}>
              {isPending ? (
                <span className={'inline-flex items-center gap-2'}>
                  <Spinner /> Adding...
                </span>
              ) : (
                <span className={'inline-flex items-center gap-2'}>
                  <IconUserPlus className={'size-4'} />
                  Add User
                </span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
