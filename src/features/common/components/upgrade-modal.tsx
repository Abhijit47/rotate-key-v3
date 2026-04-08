'use client';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import PricingCard from '@/features/pricing/components/pricing-card';

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UpgradeModal({
  open,
  onOpenChange,
}: UpgradeModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Upgrade to Pro</AlertDialogTitle>
          <AlertDialogDescription>
            <span className={'text-xs block'}>
              You need to upgrade your plan to Pro to create more properties.
              Upgrade now to unlock unlimited properties and access premium
              features!
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <PricingCard />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {/* <AlertDialogAction asChild>
            <Link href='/pricing' prefetch>
              Upgrade your plan
            </Link>
          </AlertDialogAction> */}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
