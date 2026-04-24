'use client';

import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TRPCClientError } from '@trpc/client';
import { PlusCircleIcon, Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAddFriend, useAllUsers, useRemoveFriend } from '../hooks/use-chat';

export default function UserCard() {
  const { mutateAsync: add, isPending: isAddPending } = useAddFriend();
  const { mutateAsync: remove, isPending: isRemovePending } = useRemoveFriend();
  const { data: users } = useAllUsers();

  const router = useRouter();

  function handleAddFriend(ownerId: string) {
    toast.promise(add({ ownerId }), {
      loading: 'Adding friend...',
      success: () => {
        router.push(`/chat/${ownerId}`);
        return 'Friend added successfully!';
      },
      error: (err) => {
        if (err instanceof TRPCClientError) {
          console.error({ err });
          return err.message;
        } else {
          return 'Failed to add friend. Please try again.';
        }
      },
    });
  }

  function handleRemoveFriend(ownerId: string) {
    toast.promise(remove({ ownerId }), {
      loading: 'Removing friend...',
      success: 'Friend removed successfully!',
      error: (err) => {
        if (err instanceof TRPCClientError) {
          console.error({ err });
          return err.message;
        }
        return 'Failed to remove friend. Please try again.';
      },
    });
  }

  return (
    <div className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'}>
      {users.map((user) => (
        <Card key={user.id}>
          <CardHeader>
            <CardTitle>{user.name}</CardTitle>
            <CardDescription>
              <p>{user.email}</p>
            </CardDescription>
            <CardAction>
              <ButtonGroup>
                <Button
                  variant={'secondary'}
                  size={'xs'}
                  onClick={() => handleAddFriend(user.id)}
                  disabled={isAddPending}>
                  <PlusCircleIcon className={'size-4'} />
                  Connect
                </Button>
                <Button
                  variant={'destructive'}
                  size={'xs'}
                  onClick={() => handleRemoveFriend(user.id)}
                  disabled={isRemovePending}>
                  <Trash2Icon className={'size-4'} />
                  Remove
                </Button>
              </ButtonGroup>
            </CardAction>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
