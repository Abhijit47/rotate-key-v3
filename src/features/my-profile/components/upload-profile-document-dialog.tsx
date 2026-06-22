'use client';

import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { UploadCloudIcon, XCircleIcon } from 'lucide-react';
import { TRPCClientError } from '@trpc/client';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
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
  PROFILE_VERIFICATION_DOCUMENT_ACCEPT_FILE_SIZE,
  PROFILE_VERIFICATION_DOCUMENT_ACCEPT_FILE_TYPE,
  type ConfidentialInformationClientValues,
} from '@/lib/validators/profile-schemas';
import { useProfileDocumentUpload } from '@/features/users/hooks/use-user';

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
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
}

export default function UploadProfileDocumentDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<File[] | undefined>();
  const { mutateAsync, isPending } = useProfileDocumentUpload();
  const router = useRouter();

  const form =
    useFormContext<
      Pick<
        ConfidentialInformationClientValues,
        'profileDocument' | 'isUploaded'
      >
    >();

  async function handleUpload() {
    if (!files) return;

    let base64: string;
    try {
      base64 = await fileToBase64(files[0]);
    } catch {
      toast.error('Failed to read the selected file. Please try again.');
      return;
    }

    const rawFile = {
      base64,
      name: files[0].name,
      type: files[0].type,
      size: files[0].size,
    };

    toast.promise(mutateAsync({ rawFile }), {
      description: 'Please wait we are uploading your document',
      descriptionClassName: 'text-[10px]',
      loading: 'Processing...',
      success: () => {
        setIsOpen(false);
        setFiles(undefined);
        router.refresh();
        return 'Document Uploaded successfully';
      },
      error: (err) => {
        if (err instanceof TRPCClientError) {
          return err.message;
        }
        return 'Failed to upload your document.';
      },
    });
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(prev) => {
        if (!isPending) {
          setIsOpen(prev);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant='outline' size={'sm'}>
          Upload Profile Document
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:min-w-[420px] w-full'>
        <DialogHeader>
          <DialogTitle>Upload Profile Document</DialogTitle>
          <DialogDescription>
            Here you can upload your profile document, for verification.
          </DialogDescription>
        </DialogHeader>

        <UploadProfileDocument files={files} onFileChange={setFiles} />

        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant='outline' disabled={isPending}>
              Cancel
            </Button>
          </DialogClose>
          <Button type='button' onClick={handleUpload} disabled={isPending}>
            {isPending ? 'Uploading...' : 'Upload Document'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type UploadProfileDocumentProps = {
  files: File[] | undefined;
  onFileChange: Dispatch<SetStateAction<File[] | undefined>>;
};

export function UploadProfileDocument(props: UploadProfileDocumentProps) {
  const { files, onFileChange } = props;

  const onFileValidate = useCallback(
    (file: File): string | null => {
      // Validate max files
      if (files !== undefined && files.length > 1) {
        return 'You can only upload up to 1 files';
      }

      // Validate file type (only images)
      if (file.type !== PROFILE_VERIFICATION_DOCUMENT_ACCEPT_FILE_TYPE) {
        return 'Only PDF file allowed';
      }

      // Validate file size (max 2MB)
      if (file.size > PROFILE_VERIFICATION_DOCUMENT_ACCEPT_FILE_SIZE) {
        return `File size must be less than ${PROFILE_VERIFICATION_DOCUMENT_ACCEPT_FILE_SIZE / (1024 * 1024)}MB`;
      }

      return null;
    },
    [files],
  );

  const onFileReject = useCallback(
    (file: File, message: string) => {
      toast(message, {
        description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
      });
      return;
    },
    [files],
  );

  return (
    <Field className='gap-2'>
      <FieldLabel htmlFor='upload-document'>
        Upload Document{' '}
        <span className={'text-xs'}>(for profile verification)</span>
      </FieldLabel>

      <FileUpload
        id='upload-document'
        value={files}
        onValueChange={onFileChange}
        onFileValidate={onFileValidate}
        onFileReject={onFileReject}
        // onUpload={onUpload}
        accept={PROFILE_VERIFICATION_DOCUMENT_ACCEPT_FILE_TYPE}
        maxFiles={1}
        maxSize={PROFILE_VERIFICATION_DOCUMENT_ACCEPT_FILE_SIZE}
        className='w-full'
        multiple={false}
      >
        <FileUploadDropzone>
          <div className='flex flex-col items-center gap-1'>
            <div className='flex items-center justify-center rounded-full border p-2.5'>
              <UploadCloudIcon className='size-6 text-muted-foreground' />
            </div>
            <p className='font-medium text-sm'>Drag & drop files here</p>
            <p className='text-muted-foreground text-xs'>
              Or click to browse (max 1 files)
            </p>
          </div>
          <FileUploadTrigger asChild>
            <Button variant='outline' size='sm' className='mt-2 w-fit'>
              Browse files
            </Button>
          </FileUploadTrigger>
        </FileUploadDropzone>
        <FileUploadList>
          {files &&
            files.map((file) => (
              <FileUploadItem key={file.name} value={file}>
                <FileUploadItemPreview />
                <FileUploadItemMetadata />
                <FileUploadItemDelete asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='size-7'
                    onClick={() => onFileChange(undefined)}
                  >
                    <XCircleIcon />
                  </Button>
                </FileUploadItemDelete>
              </FileUploadItem>
            ))}
        </FileUploadList>
      </FileUpload>
    </Field>
  );
}
