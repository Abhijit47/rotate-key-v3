'use client';

// import { CustomerState } from '@polar-sh/sdk/models/components/customerstate.js';
import { AlertCircle } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { plans } from '@/constants/price-plan';
import PricingCard from '@/features/pricing/components/pricing-card';
import { useCustomerInfo } from '../hooks/use-customer-info';
import { TrialExpiryCard } from './trial-expiry-card';

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // customerState: CustomerState | undefined;
  // customerStateError: CustomerStateError | undefined;
}

export default function UpgradeModal(props: UpgradeModalProps) {
  const { open, onOpenChange } = props;

  const { customerState, customerError, isCustomerLoading } = useCustomerInfo();

  const trialEndDate = customerState?.activeSubscriptions?.[0]?.trialEnd;
  // const benefits =
  //   customerState?.grantedBenefits.map((b) => {
  //     return plans.map(
  //       (plan) =>
  //         plan.benefits.find((benefit) => benefit.id === b.benefitId)
  //           ?.description || '',
  //     )[0];
  //   }) || [];

  // const benefits =
  //   customerState?.grantedBenefits
  //     .map(
  //       (b) =>
  //         plans
  //           .flatMap((plan) => plan.benefits)
  //           .find((benefit) => benefit.id === b.benefitId)?.description,
  //     )
  //     .filter((description): description is string => Boolean(description)) ??
  //   [];

  const benefits =
    customerState?.grantedBenefits.flatMap((grantedBenefit) => {
      const description = plans
        .find((plan) =>
          plan.benefits.some(
            (benefit) => benefit.id === grantedBenefit.benefitId,
          ),
        )
        ?.benefits.find(
          (benefit) => benefit.id === grantedBenefit.benefitId,
        )?.description;
      return description ? [description] : [];
    }) || [];

  const productId = customerState?.activeSubscriptions?.[0]?.productId;
  const planName = productId
    ? plans.find((plan) => productId.includes(plan.id))?.name
    : undefined;

  // const planName = plans.find((plan) =>
  //   customerState?.activeSubscriptions?.[0]?.productId.includes(plan.id),
  // )?.name;
  const title = planName ? `Current plan: ${planName}` : '';

  if (isCustomerLoading) {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className={'flex items-center gap-2'}>
              <AlertCircle className={'size-4'} />
              Upgrade your plan
            </AlertDialogTitle>
            <AlertDialogDescription></AlertDialogDescription>
          </AlertDialogHeader>
          <Separator />
          <div className={'p-4 text-center space-y-4'}>
            <span className={'text-sm text-muted-foreground'}>
              Loading your subscription information...
            </span>
            <Skeleton className={'w-full h-24 mt-4'} />
            <Skeleton className={'w-full h-24 mt-4'} />
            <Skeleton className={'w-full h-24 mt-4'} />
            <Skeleton className={'w-full h-24 mt-4'} />
          </div>
          <Separator />
          <AlertDialogFooter>
            <AlertDialogCancel variant={'outline'} size={'sm'}>
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className={'flex items-center gap-2'}>
            <AlertCircle className={'size-4'} />
            Upgrade your plan
          </AlertDialogTitle>
          <AlertDialogDescription>
            {customerError ? (
              <span className={'text-xs block'}>
                {customerError.message ||
                  'An error occurred while fetching your subscription information. Please try again later.'}
              </span>
            ) : (
              <span className={'text-xs block'}>
                You need to upgrade your plan to create more properties. Upgrade
                now to unlock unlimited properties and access premium features!
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Separator />
        {customerState ? (
          <TrialExpiryCard
            title={title}
            trialEndDate={trialEndDate!}
            onUpgrade={() => {
              console.log('Upgrade clicked');
            }}
            features={benefits}
            className='w-full max-w-md mx-auto'
          />
        ) : (
          <div>
            <PricingCard />
          </div>
        )}
        <Separator />

        <AlertDialogFooter>
          <AlertDialogCancel variant={'outline'} size={'sm'}>
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
