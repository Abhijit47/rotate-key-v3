import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { authClient } from '@/lib/auth-client';

export function useCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  function handleCheckout(planId: string) {
    setIsLoading(true);
    toast.promise(
      authClient.checkout({
        products: [planId],
        fetchOptions: {
          onError: ({ error }) => {
            throw error;
          },
        },
      }),
      {
        loading: 'Redirecting to checkout...',
        success: ({ data }) => {
          console.log({ data });
          setIsLoading(false);
          return 'Redirected to checkout successfully!';
        },
        error: (err) => {
          // console.log(err);
          if (err.status === 401) {
            toast.error('Please login to checkout.');
            router.push('/login');
          }
          setIsLoading(false);
          return 'Failed to redirect to checkout.';
        },
      },
    );
  }

  return {
    isCheckoutLoading: isLoading,
    checkout: handleCheckout,
  };
}
