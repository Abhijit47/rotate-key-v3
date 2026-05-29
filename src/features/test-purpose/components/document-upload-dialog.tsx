'use client';

import { UploadCloudIcon, XIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

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
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useUserPropertyDocumentUpload } from '@/features/auth/hooks/use-auth';
import { useSession } from '@/lib/auth-client';
import { TRPCClientError } from '@trpc/client';

type DocumentUploadAlertDialogProps = {
  isOpen: boolean;
  onHandleClose: () => void;
};

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

export default function DocumentUploadAlertDialog({
  isOpen,
  onHandleClose,
}: DocumentUploadAlertDialogProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [url, setUrl] = useState<string | undefined>(undefined);
  const { refetch } = useSession();

  const { mutateAsync, isPending } = useUserPropertyDocumentUpload();

  const onFileValidate = useCallback(
    (file: File): string | null => {
      // Validate max files
      if (files.length >= 2) {
        return 'You can only upload up to 2 files';
      }

      // Validate file type (only pdf)
      if (!file.type.startsWith(ACCEPT_FILE_TYPE)) {
        return 'Only image files are allowed';
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

    if (files.length === 0) {
      toast.info('No file was uploaded');
      return;
    }

    const base64 = await fileToBase64(files[0]);

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

  return (
    <AlertDialog open={isOpen}>
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
            onValueChange={setFiles}
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
              <AlertDialogAction type='submit' disabled={isPending}>
                {isPending ? 'Uploading...' : 'Upload Document'}
              </AlertDialogAction>
            )}

            {url !== undefined && (
              <AlertDialogAction
                type='button'
                onClick={() => {
                  if (url) {
                    toast.success('Document upload complete! Thank you.');
                    onHandleClose();
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
