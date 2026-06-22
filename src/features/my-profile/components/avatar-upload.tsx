import { IconFileUpload, IconTrashX } from '@tabler/icons-react';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useState,
  useEffect,
} from 'react';
import { toast } from 'sonner';
import { UploadCloudIcon, XCircleIcon } from 'lucide-react';
import Image from 'next/image';
import { TRPCClientError } from '@trpc/client';

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
import { Field, FieldLabel } from '@/components/ui/field';
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
  PROFILE_AVATAR_ACCEPT_FILE_SIZE,
  PROFILE_AVATAR_ACCEPT_FILE_TYPE,
} from '@/lib/validators/profile-schemas';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ClientSession } from '@/lib/auth-client';
import { useAvatarUpload } from '@/features/users/hooks/use-user';

type AvatarUploadProps = {
  personalInformation: Pick<
    ClientSession['user'],
    | 'name'
    | 'firstName'
    | 'lastName'
    | 'image'
    | 'spokenLanguages'
    | 'country'
    | 'aboutMe'
  >;
};

// Create blob URL from File object
function createImageBlobUrl(file: File): string {
  return URL.createObjectURL(file);
}

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

export function AvatarUpload(props: AvatarUploadProps) {
  const { personalInformation } = props;
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();

  const fallback = personalInformation?.image?.length
    ? personalInformation.image
    : `/api/avatar?${personalInformation.name}`;

  return (
    <div className={'flex items-center justify-center gap-6'}>
      <div className={'size-28'}>
        <Avatar className={'w-full h-full rounded-full'}>
          <AvatarImage
            src={previewUrl ?? fallback}
            className={'w-full h-full rounded-full '}
          />
          <AvatarFallback>{personalInformation.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>

      <div className={'flex flex-col gap-2'}>
        <AvatarUploadDialog
          previewUrl={previewUrl}
          onPreviewUrl={setPreviewUrl}
        />
        <Button
          variant='destructive'
          size={'sm'}
          type='button'
          onClick={() => {
            if (previewUrl) {
              URL.revokeObjectURL(previewUrl);
            }
          }}
        >
          <IconTrashX className='size-4' />
          Remove
        </Button>
      </div>
    </div>
  );
}

type AvatarUploadDialogProps = {
  previewUrl: string | undefined;
  onPreviewUrl: Dispatch<SetStateAction<string | undefined>>;
};

export function AvatarUploadDialog(props: AvatarUploadDialogProps) {
  const { previewUrl, onPreviewUrl } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<File[] | undefined>();

  const { mutateAsync, isPending } = useAvatarUpload();

  const onFileValidate = useCallback(
    (file: File): string | null => {
      // Validate max files
      if (files !== undefined && files.length > 1) {
        return 'You can only upload up to 1 file';
      }

      // Validate file type (only images)
      if (!PROFILE_AVATAR_ACCEPT_FILE_TYPE.includes(file.type)) {
        return 'Only Image files are allowed';
      }

      // Validate file size (max 2MB)
      if (file.size > PROFILE_AVATAR_ACCEPT_FILE_SIZE) {
        return `File size must be less than ${PROFILE_AVATAR_ACCEPT_FILE_SIZE / (1024 * 1024)}MB`;
      }

      return null;
    },
    [files],
  );

  const onFileReject = useCallback(
    (file: File, message: string) => {
      toast.error(message, {
        description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...${file.type}` : file.name}" has been rejected`,
      });
      return;
    },
    [files],
  );

  useEffect(() => {
    if (files?.length) {
      const blobUrl = createImageBlobUrl(files[0]);
      onPreviewUrl(blobUrl);
    }
  }, [files]);

  function removePreviewUrl() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      onPreviewUrl(undefined);
    }
    return;
  }

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
      description: 'Please wait we are uploading your avatar',
      descriptionClassName: 'text-[10px]',
      loading: 'Processing...',
      success: () => {
        onPreviewUrl(undefined);
        removePreviewUrl();
        setIsOpen(false);
        return 'Avatar Uploaded successfully';
      },
      error: (err) => {
        if (err instanceof TRPCClientError) {
          return err.message;
        }
        return 'Failed to upload your avatar.';
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
        <Button variant='outline' size={'sm'} type='button'>
          <IconFileUpload className='size-4' />
          Edit or Upload
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:min-w-36 w-full'>
        <DialogHeader>
          <DialogTitle>Edit avatar</DialogTitle>
          <DialogDescription>
            Make changes to your profile avatar here. Click save when
            you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <Field className='gap-2'>
          <FieldLabel htmlFor='upload-avatar'>
            Upload Avatar <span className={'text-xs'}>(profile avatar)</span>
          </FieldLabel>
          <FileUpload
            id='upload-avatar'
            value={files}
            onValueChange={setFiles}
            onFileValidate={onFileValidate}
            onFileReject={onFileReject}
            // onUpload={onUpload}
            accept={'image/*'}
            maxFiles={1}
            maxSize={PROFILE_AVATAR_ACCEPT_FILE_SIZE}
            className='w-full'
            multiple={false}
          >
            {!previewUrl ? (
              <FileUploadDropzone>
                <div className='flex flex-col items-center gap-1'>
                  <div className='flex items-center justify-center rounded-full border p-2.5'>
                    <UploadCloudIcon className='size-6 text-muted-foreground' />
                  </div>
                  <p className='font-medium text-sm'>Drag & drop file here</p>
                  <p className='text-muted-foreground text-xs'>
                    Or click to browse (max 1 file)
                  </p>
                </div>
                <FileUploadTrigger asChild>
                  <Button variant='outline' size='sm' className='mt-2 w-fit'>
                    Browse files
                  </Button>
                </FileUploadTrigger>
              </FileUploadDropzone>
            ) : (
              <div className='w-full h-full border-2 border-dashed border-border'>
                <div className='size-28 mx-auto'>
                  <Image
                    src={previewUrl}
                    alt='preview-avatar'
                    height={300}
                    width={300}
                    className='w-full h-full'
                  />
                </div>
              </div>
            )}

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
                        onClick={removePreviewUrl}
                      >
                        <XCircleIcon />
                      </Button>
                    </FileUploadItemDelete>
                  </FileUploadItem>
                ))}
            </FileUploadList>
          </FileUpload>
        </Field>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant='outline'
              type='button'
              disabled={isPending}
              onClick={removePreviewUrl}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button type='button' onClick={handleUpload} disabled={isPending}>
            {isPending ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
