import DocumentUploadAlertDialog from '@/features/test-purpose/components/document-upload-dialog';
import { useSession } from '@/lib/auth-client';
import { useEffect, useMemo, useState } from 'react';

export function useDocumentUploadAlert() {
  const { data, isPending, isRefetching, refetch } = useSession();
  const userId = data?.user?.id ?? null;

  const storageKey = userId ? `document-upload:${userId}` : null;

  const shouldPrompt =
    !!data &&
    !isPending &&
    !isRefetching &&
    !data.user?.isPropertyDocumentUploaded;

  const [isOpen, setIsOpen] = useState(shouldPrompt);
  const dismissed = useMemo(() => {
    if (!storageKey) return false;
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(storageKey) === 'dismissed';
  }, [storageKey]);

  console.log(
    'isPropertyDocumentUploaded',
    data?.user.isPropertyDocumentUploaded,
  );

  useEffect(() => {
    if (shouldPrompt && !dismissed) setIsOpen(true);
  }, [shouldPrompt]);

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
