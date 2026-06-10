'use client';

import { TRPCClientError } from '@trpc/client';
import { UploadCloudIcon, XIcon } from 'lucide-react';
import { MouseEvent, useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useChatContext } from 'stream-chat-react';

import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from '@/components/extends/file-upload';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useCustomChatContext } from '@/contexts/chat-context';
import { useUserPropertyDocumentUpload } from '@/features/auth/hooks/use-auth';

const ACCEPT_FILE_TYPE = 'application/pdf';

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        resolve(result.split(',')[1] ?? '');
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () =>
      reject(reader.error ?? new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });

export default function DocumentUploadAlertDialog() {
  const [files, setFiles] = useState<File[]>([]);
  // const { data } = useSession();
  const { isOpenDocumentDialog, onOpenDocumentDialog, onClose, user } =
    useCustomChatContext();

  const [url, setUrl] = useState<string | null | undefined>(
    user.propertyDocument,
  );

  const { client, channel } = useChatContext();

  const { mutateAsync, isPending } = useUserPropertyDocumentUpload();

  const onFileValidate = useCallback(
    (file: File): string | null => {
      // Validate max files
      if (files.length >= 1) {
        return 'You can only upload 1 file';
      }

      // Validate file type (only pdf)
      if (file.type !== ACCEPT_FILE_TYPE) {
        return 'Only PDF files are allowed';
      }

      // Validate file size (max 5MB)
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB
      if (file.size > MAX_SIZE) {
        return `File size must be less than ${MAX_SIZE / (1024 * 1024)}MB`;
      }

      return null;
    },
    [files],
  );

  const onFileReject = useCallback((file: File, message: string) => {
    toast.error(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    });
  }, []);

  async function handleUpload(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();

    console.log('files:', files);
    if (files.length === 0) {
      toast.warning('No file was there to upload!');
      onOpenDocumentDialog(true);
      return;
    }

    let base64: string;
    try {
      base64 = await fileToBase64(files[0]);
    } catch {
      toast.error('Failed to read the selected file. Please try again.');
      return;
    }

    // const base64 = await fileToBase64(files[0]);

    const document = {
      base64,
      name: files[0].name,
      type: files[0].type,
      size: files[0].size,
      lastModified: files[0].lastModified,
    };

    toast.promise(mutateAsync({ pdfDocument: document }), {
      loading: 'Uploading document...',
      description:
        'Sit back and relax while we upload your document. This may take a moment.',
      descriptionClassName: 'text-[10px]',
      success: (data) => {
        setUrl(data?.url);
        onOpenDocumentDialog(true);
        return 'Document uploaded successfully!';
      },
      error: (err) => {
        if (err instanceof TRPCClientError) {
          return err.message;
        }
        return 'An unexpected error occurred during upload';
      },
    });
  }

  async function handleContinue(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    if (url) {
      const res = await channel?.sendMessage({
        text: `${user.fullName ?? 'User'} uploaded a document: ${url}`,
        attachments: [
          {
            type: 'file',
            asset_url: url,
            title: 'Property Document',
            thumb_url: url,
          },
        ],
        mentioned_channel: true,
        // mentioned_users: [], // oposite user_ID need to be mention here.
      });
      console.log('Message sent with document link:', res);
      setFiles([]);
      setUrl(undefined);
      onClose();
    } else {
      toast.error('Please enter a valid file URL.');
    }
  }

  const hasDocumentMessageFromCurrentUser = channel?.state.messages.some(
    (msg) => {
      const sentByCurrentUser = msg?.user?.id === client.userID;
      const hasDocumentAttachment = msg.attachments?.some(
        (att) =>
          att.type === 'file' &&
          !!att.asset_url &&
          att.title === 'Property Document',
      );

      return sentByCurrentUser && hasDocumentAttachment;
    },
  );

  return (
    <AlertDialog
      open={!isOpenDocumentDialog && !hasDocumentMessageFromCurrentUser}
      // open={isOpenDocumentDialog && !hasDocumentMessageFromCurrentUser}
      onOpenChange={onOpenDocumentDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Please upload your property document
          </AlertDialogTitle>
          <AlertDialogDescription className={'text-xs'}>
            We require a property document to verify your ownership. Please
            upload a clear image of your property document. This information
            will be kept confidential and used solely for verification purposes.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Field>
          <FieldLabel htmlFor='uploaded-document-url'>
            Uploaded Document URL
          </FieldLabel>
          <Input
            id='uploaded-document-url'
            type='url'
            placeholder='https://example.com/your-uploaded-document.pdf'
            value={url ?? ''}
            readOnly
          />
          <FieldDescription>
            Your uploaded document URL will appear here after successful upload
          </FieldDescription>
        </Field>

        <form className={'space-y-4'} onSubmit={handleUpload}>
          <FileUpload
            value={files}
            onValueChange={(e: File[]) => {
              // console.log("e:", e);
              setFiles(e);
            }}
            onFileValidate={onFileValidate}
            onFileReject={onFileReject}
            accept={ACCEPT_FILE_TYPE}
            maxFiles={1}
            className='w-full max-w-md mx-auto'
            multiple={false}>
            <FileUploadDropzone>
              <div className='flex flex-col items-center gap-1 text-center'>
                <div className='flex items-center justify-center rounded-full border p-2.5'>
                  <UploadCloudIcon className='size-6 text-muted-foreground' />
                </div>
                <p className='font-medium text-sm'>Drag & drop files here</p>
                <p className='text-muted-foreground text-xs'>
                  Or click to browse (max 1 files). PDF Only.
                </p>
              </div>
              <FileUploadTrigger asChild>
                <Button variant='outline' size='sm' className='mt-2 w-fit'>
                  Browse files
                </Button>
              </FileUploadTrigger>
            </FileUploadDropzone>
            <FileUploadList>
              {files.map((file, index) => (
                <FileUploadItem key={index} value={file} className='flex-col'>
                  <div className='flex w-full items-center gap-2'>
                    <FileUploadItemPreview />
                    <FileUploadItemMetadata />
                    <FileUploadItemDelete asChild>
                      <Button variant='ghost' size='icon' className='size-7'>
                        <XIcon />
                      </Button>
                    </FileUploadItemDelete>
                  </div>
                </FileUploadItem>
              ))}
            </FileUploadList>
          </FileUpload>
          <AlertDialogFooter>
            {url === undefined && (
              <>
                <AlertDialogCancel type='button' disabled={isPending}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction type='submit' disabled={isPending}>
                  {isPending ? 'Uploading...' : 'Upload Document'}
                </AlertDialogAction>
              </>
            )}
            <AlertDialogCancel type='button' disabled={isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction type='submit' disabled={isPending}>
              {isPending ? 'Uploading...' : 'Upload Document'}
            </AlertDialogAction>

            {/* {url !== undefined && url?.length > 0 ? <></>:null} */}

            {url !== undefined && (
              <AlertDialogAction
                type='button'
                onClick={(ev) => {
                  if (url) {
                    toast.success('Document upload complete! Thank you.');
                    handleContinue(ev);
                  } else {
                    toast.error('Please upload a document before continuing.');
                  }
                }}>
                Continue
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
