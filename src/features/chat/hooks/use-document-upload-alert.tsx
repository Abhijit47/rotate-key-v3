import { useEffect, useMemo, useState } from 'react';
import { useChatContext } from 'stream-chat-react';

import { useCustomChatContext } from '@/contexts/chat-context';
import { useSession } from '@/lib/auth-client';

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
import { Field, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PREDEFINED_MESSAGE_TITLE = 'Uploaded Document';

export function useDocumentUploadAlert() {
  const { refetch } = useSession();
  const { client, channel } = useChatContext();

  const { user } = useCustomChatContext();

  const hasDocument = useMemo(() => {
    if (!client || !channel?.cid) return false;

    return channel?.state.messages.some((msg) => {
      const sentByCurrentUser = msg?.user?.id === client.userID;
      const hasDocumentAttachment = msg.attachments?.some(
        (att) =>
          att.type === 'file' &&
          !!att.asset_url &&
          att.title === PREDEFINED_MESSAGE_TITLE,
      );
      return sentByCurrentUser && hasDocumentAttachment;
    });
  }, [channel?.state.messages, client]);

  // const hasDocumentMessageFromCurrentUser = channel?.state.messages.some(
  //   (msg) => {
  //     const sentByCurrentUser = msg?.user?.id === client.userID;
  //     const hasDocumentAttachment = msg.attachments?.some(
  //       (att) =>
  //         att.type === 'file' &&
  //         !!att.asset_url &&
  //         att.title === PREDEFINED_MESSAGE_TITLE,
  //     );

  //     return sentByCurrentUser && hasDocumentAttachment;
  //   },
  // );

  const userId = user.id;
  const storageKey = userId ? `document-upload:${userId}` : null;

  const shouldTrigger = user.isPropertyDocumentUploaded && hasDocument;
  console.log('shouldTrigger:', shouldTrigger);

  const [isOpen, setIsOpen] = useState(shouldTrigger);

  const dismissed = useMemo(() => {
    if (!storageKey) return false;
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(storageKey) === 'dismissed';
  }, [storageKey]);

  useEffect(() => {
    if (!shouldTrigger && !dismissed) setIsOpen(true);
  }, [shouldTrigger, dismissed]);

  async function handleClose() {
    if (!storageKey) return;
    if (typeof window === 'undefined') return;

    await refetch({
      query: {
        disableCookieCache: true,
      },
    });

    window.localStorage.setItem(storageKey, 'dismissed');
    setIsOpen(false);
  }

  const handleOpenChange = (open: boolean) => {
    if (open) setIsOpen(true);
    else void handleClose();
  };

  return {
    documentAlertModal: (
      <DocumentUploadDialogDemo
        isOpenDialog={isOpen}
        onOpenDocumentDialog={handleOpenChange}
      />
    ),
    isOpenDialog: isOpen,
    onOpenDocumentDialog: handleOpenChange,
  };
}

type DocumentUploadDialogDemoProps = {
  isOpenDialog: boolean;
  onOpenDocumentDialog: (open: boolean) => void;
};

export function DocumentUploadDialogDemo({
  isOpenDialog,
  onOpenDocumentDialog,
}: DocumentUploadDialogDemoProps) {
  // const { isOpenDialog, onOpenDocumentDialog } = useDocumentUploadAlert();

  return (
    <Dialog open={isOpenDialog} onOpenChange={onOpenDocumentDialog}>
      <form>
        <DialogTrigger asChild>
          <Button variant='outline'>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-sm'>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor='name-1'>Name</Label>
              <Input id='name-1' name='name' defaultValue='Pedro Duarte' />
            </Field>
            <Field>
              <Label htmlFor='username-1'>Username</Label>
              <Input id='username-1' name='username' defaultValue='@peduarte' />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='outline'>Cancel</Button>
            </DialogClose>
            <Button type='submit'>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
