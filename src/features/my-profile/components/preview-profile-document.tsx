import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Options } from 'react-pdf/dist/shared/types.js';
import { DownloadCloud, XCircleIcon } from 'lucide-react';
import { toast } from 'sonner';

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
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { env } from '@/env';
import { ClientSession } from '@/lib/auth-client';

const BASE_URL = env.NEXT_PUBLIC_BETTER_AUTH_URL;
const WORKER_URL = new URL('/pdf-js/pdf.worker.mjs', BASE_URL);

type PreviewProfileDocumentDialogProps = {
  confidentialInformation: Pick<
    ClientSession['user'],
    | 'yearOfBirth'
    | 'contactNumber'
    | 'email'
    | 'profileVerificationDocument'
    | 'isProfileDocumentVerified'
  >;
};

export default function PreviewProfileDocumentDialog(
  props: PreviewProfileDocumentDialogProps,
) {
  const [progress, setProgress] = useState<number>(0);
  const { confidentialInformation } = props;
  const [isDownloading, startTransition] = useTransition();

  const options = useMemo<Options>(
    () => ({
      docBaseUrl: 'http://localhost:3000',
      cMapUrl: `/pdf-js/cmaps/`,
      // wasmUrl: `/pdf-js/wasm/`,
    }),
    [],
  );

  // Configure worker only on client-side
  useEffect(() => {
    if (typeof window === 'undefined') return;
    pdfjs.GlobalWorkerOptions.workerSrc = WORKER_URL.toString();
    // pdfjs.GlobalWorkerOptions.workerSrc = `/pdf-js/pdf.worker.mjs`;
  }, []);

  const fallback = '/pdf-js/compressed.tracemonkey-pldi-09.pdf';
  const PDF_URL = !confidentialInformation?.profileVerificationDocument?.length
    ? fallback
    : confidentialInformation.profileVerificationDocument;

  const isDocument = Boolean(
    confidentialInformation.profileVerificationDocument,
  );

  function handleDownload() {
    if (
      confidentialInformation?.profileVerificationDocument?.length &&
      confidentialInformation.profileVerificationDocument.length > 1
    ) {
      const cloudUrl = confidentialInformation.profileVerificationDocument;
      startTransition(async () => {
        try {
          const response = await fetch(cloudUrl);
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'Ascent_Wealth_Brochure.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.error('Download failed:', error);
        }
      });
    }
  }

  const isPending = isDownloading || isDocument;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' className='w-full' size={'sm'}>
          View your document
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:min-w-125 w-full'>
        <DialogHeader>
          <DialogTitle>Preview profile document</DialogTitle>
          <DialogDescription>
            Here is your uploaded document preview.
          </DialogDescription>
        </DialogHeader>

        <div className='border-2 border-dashed border-border rounded-lg p-2'>
          <Document
            file={PDF_URL}
            onLoadProgress={({ loaded, total }) => {
              // console.log('onLoadProgress', (loaded / total) * 100);
              setProgress((loaded / total) * 100);
            }}
            onLoadError={(err) => {
              // console.log('onLoadError', err);
              toast.error('Something went wrong to load the document', {
                description: err.message,
              });
            }}
            onLoadSuccess={(doc) => {
              // console.log('onLoadSuccess', doc);
              toast.info('Document successfully loadded', {
                description: doc.numPages,
              });
            }}
            onSourceError={(err: Error) => {
              // console.log('onSourceError', err);
              toast.error('Document source not retrieved!', {
                description: err.message,
              });
            }}
            onSourceSuccess={() => {
              toast.info('Document source retrieved!');
            }}
            // options={options}
            error={<p>Something went wrong</p>}
            noData={<p>No document found</p>}
            loading={
              <Skeleton className='w-100! h-125! mx-auto animate-pulse' />
            }
            className={'w-100! h-125! mx-auto rounded-lg!'}
          >
            {progress <= 0 ? (
              <Progress value={progress} className='w-full' />
            ) : (
              <Page
                className={'w-100! h-125! mx-auto rounded-lg!'}
                error={<p>Something went wrong to load page</p>}
                // noData={
                //   <Skeleton className='w-100! h-125! mx-auto animate-pulse' />
                // }
                // canvasBackground='transparent'
                noData={<p>No page found</p>}
                loading={
                  <Skeleton className='w-100! h-125! mx-auto animate-pulse' />
                }
                renderTextLayer={true}
              />
            )}
          </Document>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type='button' variant='outline' disabled={isPending}>
              Cancel <XCircleIcon className='size-4' />
            </Button>
          </DialogClose>
          <Button type='button' disabled={isPending} onClick={handleDownload}>
            {isPending ? (
              <span className='inline-flex items-center gap-2'>
                Downloading... <Spinner className='size-4' />
              </span>
            ) : (
              <span className='inline-flex items-center gap-2'>
                Download <DownloadCloud className='size-4' />
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
