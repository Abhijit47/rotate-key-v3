import DocumentUploadAlertDialog from '@/features/test-purpose/components/document-upload-dialog';
import { useSession } from '@/lib/auth-client';
import { useState } from 'react';

export function useDocumentUploadAlert() {
  const { data, isPending, isRefetching, refetch } = useSession();
  const userId = data?.user?.id ?? null;
  const shouldPrompt =
    !!data &&
    !isPending &&
    !isRefetching &&
    !data?.user?.isPropertyDocumentUploaded;

  const [isOpen, setIsOpen] = useState(shouldPrompt);

  console.log(
    'isPropertyDocumentUploaded',
    data?.user.isPropertyDocumentUploaded,
  );

  const storageKey = userId ? `document-upload:${userId}` : null;

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

  return {
    documentAlertModal: (
      <DocumentUploadAlertDialog isOpen={isOpen} onHandleClose={handleClose} />
    ),
  };
}
