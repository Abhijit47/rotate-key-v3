'use client';

import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TRPCClientError } from '@trpc/client';
import { CheckCircle2, PlusCircleIcon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  useAddFriend,
  useAllUsers,
  useRemoveFriend,
} from '../hooks/use-test-purpose';

import { useSession } from '@/lib/auth-client';
import { useDocumentUploadAlert } from '../../common/hooks/use-document-upload-alert';

export default function UserTestCard() {
  const { mutateAsync: add, isPending: isAddPending } = useAddFriend();
  const { mutateAsync: remove, isPending: isRemovePending } = useRemoveFriend();
  const { data: users } = useAllUsers();
  const { refetch } = useSession();

  const { documentAlertModal } = useDocumentUploadAlert();

  const router = useRouter();

  function handleAddFriend(ownerId: string) {
    toast.promise(add({ ownerId }), {
      loading: 'Adding friend...',
      success: () => {
        router.push(`/chat`);
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
      duration: 5000,
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
      duration: 5000,
    });
  }

  return (
    <>
      <div>
        <Button
          onClick={async () => {
            await refetch({
              query: {
                disableCookieCache: true,
              },
            });
          }}>
          Session Refresh
        </Button>
      </div>

      <div className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'}>
        {/* TODO: Will invoke in proper place as of now stay here */}
        {documentAlertModal}
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>
                <p>{user.email}</p>
              </CardDescription>
            </CardHeader>

            <CardContent>
              <ButtonGroup>
                <Button
                  variant={'secondary'}
                  size={'xs'}
                  onClick={() => handleAddFriend(user.id)}
                  disabled={isAddPending || user.isMatched}>
                  {user.isMatched ? (
                    <CheckCircle2 className={'size-4'} />
                  ) : (
                    <PlusCircleIcon className={'size-4'} />
                  )}

                  {user.isMatched ? 'Already Friend' : 'Add Friend'}
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
            </CardContent>

            <CardFooter>
              {user.isMatched ? (
                <Button
                  variant={!user.isMatched ? 'outline' : 'secondary'}
                  disabled={!user.isMatched}
                  asChild
                  className={'w-full'}>
                  <Link href='/test-chat'>Go to Chat</Link>
                </Button>
              ) : (
                <Button
                  variant={!user.isMatched ? 'outline' : 'secondary'}
                  disabled={!user.isMatched}
                  className={'w-full disabled:cursor-not-allowed'}>
                  Chat Unavailable
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
