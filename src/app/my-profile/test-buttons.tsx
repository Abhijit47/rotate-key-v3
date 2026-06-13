'use client';

import { Button } from '@/components/ui/button';
import {
  useAcceptSwap,
  useGetSwap,
  useRejectSwap,
} from '@/features/swap/hooks/use-swap';
import { TRPCClientError } from '@trpc/client';
import { toast } from 'sonner';

export default function TestButtons({ userId }: { userId: string }) {
  const { mutateAsync: acceptSwapAsync, isPending: isAcceptPending } =
    useAcceptSwap();
  const { mutateAsync: rejectSwapAsync, isPending: isRejectPending } =
    useRejectSwap();
  const { data: swapRequest } = useGetSwap();

  const hasSwapRequestForMe =
    (swapRequest.user1Id === userId || swapRequest.user2Id === userId) &&
    swapRequest.status === 'pending';

  function handleAcceptSwap() {
    toast.promise(
      acceptSwapAsync({
        swapId: swapRequest.swapId,
        bookingId: swapRequest.bookingId,
      }),
      {
        loading: 'Processing Swap Request',
        success: 'Swap Request Accepted',
        error: (err) => {
          if (err instanceof TRPCClientError) {
            return err.message;
          }
          return err.message || 'Failed to accept swap request';
        },
        description: 'Please wait for the swap request to be processed',
        descriptionClassName: 'text-[10px]',
      },
    );
  }

  function handleRejectSwap() {
    toast.promise(
      rejectSwapAsync({
        swapId: swapRequest.swapId,
      }),
      {
        loading: 'Processing Swap Reject Request',
        success: 'Swap Request Rejected',
        error: (err) => {
          if (err instanceof TRPCClientError) {
            return err.message;
          }
          return err.message || 'Failed to reject swap request';
        },
        description: 'Please wait for the swap request to be processed',
        descriptionClassName: 'text-[10px]',
      },
    );
  }

  return (
    <div>
      {hasSwapRequestForMe ? (
        <>
          <Button
            type='button'
            disabled={isAcceptPending}
            onClick={handleAcceptSwap}>
            Test Accept Swap Request
          </Button>
          <Button
            type='button'
            disabled={isRejectPending}
            onClick={handleRejectSwap}>
            Test Reject Swap Request
          </Button>
        </>
      ) : (
        <Button type='button'>No Swap Request Found</Button>
      )}
    </div>
  );
}
