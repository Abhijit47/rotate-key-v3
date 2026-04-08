import { authClient } from '@/lib/auth-client';
import { useState } from 'react';
import { toast } from 'sonner';

export function useCheckout() {
  const [isLoading, setIsLoading] = useState(false);

  function handleCheckout(planId: string) {
    setIsLoading(true);
    toast.promise(
      authClient.checkout({
        products: [planId],
      }),
      {
        loading: 'Redirecting to checkout...',
        success: () => {
          setIsLoading(false);
          return 'Redirected to checkout successfully!';
        },
        error: 'Failed to redirect to checkout.',
      },
    );
  }

  return {
    isCheckoutLoading: isLoading,
    checkout: handleCheckout,
  };
}
