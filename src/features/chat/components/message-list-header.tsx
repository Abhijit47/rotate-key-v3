import { SwapDialog } from "@/features/swap/components/swap-modal";
import { UnSwapDialog } from "@/features/swap/components/un-swap-modal";

export default function MessageListHeader() {
  return (
    <div
      className={
        'h-16 bg-primary/30 backdrop-blur-lg rounded-bl-xl rounded-br-xl w-full flex items-center justify-center gap-2 px-2'
      }>
      <SwapDialog />
      <UnSwapDialog />
    </div>
  );
}
