'use client';

import { AlertCircleIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ErrorBoundary, getErrorMessage } from 'react-error-boundary';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

type ProfileErrorBoundaryProps = {
  children: React.ReactNode;
  fallBackText?: string;
};

export function ProfileErrorBoundary(props: ProfileErrorBoundaryProps) {
  const { children, fallBackText } = props;
  const router = useRouter();

  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <div className='flex justify-center items-center w-full h-dvh'>
          <Alert variant='destructive' className='mx-auto max-w-lg'>
            <AlertCircleIcon />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {fallBackText || 'Something went wrong.'}
            </AlertDescription>

            <AlertDescription>
              <pre className='font-sans text-sm'>{getErrorMessage(error)}</pre>
            </AlertDescription>

            <div className='w-full'>
              <Button variant='outline' onClick={resetErrorBoundary}>
                Try again
              </Button>
            </div>
          </Alert>
        </div>
        // <div role="alert">
        //   <p className="text-destructive text-sm">
        //     {fallBackText || "Something went wrong:"}
        //   </p>
        //   <pre className="font-sans text-sm">{getErrorMessage(error)}</pre>
        //   <Button variant="outline" onClick={resetErrorBoundary}>
        //     Try again
        //   </Button>
        // </div>
      )}
      onError={(error, info) => {
        // Log the error to your error reporting service
        console.error('Profile Error:', error);
      }}
      onReset={() => {
        // Reset any state that may have caused the error
        router.refresh();
      }}>
      {/* Components protected by this boundary */}
      {children}
    </ErrorBoundary>
  );
}
