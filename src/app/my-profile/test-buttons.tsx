"use client";

import { Button } from "@/components/ui/button";
import {
  useAcceptSwap,
  useRejectSwap,
  useGetSwap,
} from "@/features/swap/hooks/use-swap";
import { TRPCClientError } from "@trpc/client";
import { toast } from "sonner";

export default function TestButtons() {
  const { mutateAsync: acceptSwapAsync, isPending: isAcceptPending } =
    useAcceptSwap();
  const { mutateAsync: rejectSwapAsync, isPending: isRejectPending } =
    useRejectSwap();
  const { data: swapRequest } = useGetSwap();

  function handleAcceptSwap() {
    toast.promise(
      acceptSwapAsync({
        swapId: swapRequest.swapId,
        bookingId: swapRequest.bookingId,
      }),
      {
        loading: "Processing Swap Request",
        success: "Swap Request Accepted",
        error: (err) => {
          if (err instanceof TRPCClientError) {
            return err.message;
          }
          return err.message || "Failed to accept swap request";
        },
        description: "Please wait for the swap request to be processed",
        descriptionClassName: "text-[10px]",
      },
    );
  }

  function handleRejectSwap() {
    toast.promise(
      rejectSwapAsync({
        swapId: swapRequest.swapId,
      }),
      {
        loading: "Processing Swap Reject Request",
        success: "Swap Request Rejected",
        error: (err) => {
          if (err instanceof TRPCClientError) {
            return err.message;
          }
          return err.message || "Failed to reject swap request";
        },
        description: "Please wait for the swap request to be processed",
        descriptionClassName: "text-[10px]",
      },
    );
  }

  return (
    <div>
      <Button
        type="submit"
        disabled={isAcceptPending}
        onClick={handleAcceptSwap}
      >
        Test Accpet Swap Request
      </Button>
      <Button
        type="submit"
        disabled={isRejectPending}
        onClick={handleRejectSwap}
      >
        Test Reject Swap Request
      </Button>
    </div>
  );
}
