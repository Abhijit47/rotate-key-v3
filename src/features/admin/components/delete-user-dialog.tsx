import { IconCircleX, IconUserX } from '@tabler/icons-react';

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
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { useDeleteUser } from '../hooks/use-admin';

export default function DeleteUserDialog({ userId }: { userId: string }) {
  const [isOpenDeleteUser, setIsOpenDeleteUser] = useState(false);
  const router = useRouter();
  const { mutateAsync, isPending } = useDeleteUser();
  const handleSubmit = (event: React.SubmitEvent) => {
    event.preventDefault();

    // const promise = new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     // Simulate success or failure randomly
    //     const isSuccess = Math.random() > 0.5;
    //     if (isSuccess) {
    //       resolve('User deleted successfully');
    //     } else {
    //       reject(new Error('Failed to delete user'));
    //     }
    //   }, 2000);
    // });

    toast.promise(mutateAsync({ id: userId }), {
      loading: 'Deleting user...',
      success: () => {
        setIsOpenDeleteUser(false);
        router.refresh();
        return 'User deleted successfully!';
      },
      error: 'Failed to delete user. Please try again.',
      description: 'This action cannot be undone.',
      descriptionClassName: 'text-[10px] text-balance',
    });
  };

  return (
    <Dialog open={isOpenDeleteUser} onOpenChange={setIsOpenDeleteUser}>
      <DialogTrigger asChild>
        <Button variant='destructive' size='sm' className='w-full'>
          Delete User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete user
            account and remove user data from our servers.
          </DialogDescription>
        </DialogHeader>
        <form className='space-y-4' onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor='userId'>User ID</FieldLabel>
              <Input id='userId' name='name' defaultValue={userId} readOnly />
            </Field>
          </FieldGroup>

          <Separator />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline' size='sm' disabled={isPending}>
                <span className={'inline-flex items-center gap-2'}>
                  <IconCircleX className={'size-4'} />
                  Cancel
                </span>
              </Button>
            </DialogClose>
            <Button
              type='submit'
              variant='destructive'
              size={'sm'}
              disabled={isPending}>
              {isPending ? (
                <span className={'inline-flex items-center gap-2'}>
                  <Spinner />
                  Deleting...
                </span>
              ) : (
                <span className={'inline-flex items-center gap-2'}>
                  <IconUserX className={'size-4'} />
                  Delete User
                </span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
