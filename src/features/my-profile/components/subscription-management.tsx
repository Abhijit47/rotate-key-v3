'use client';

import { Calendar, CreditCard } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useCustomerInfo } from '@/features/common/hooks/use-customer-info';
import { cn } from '@/lib/utils';
import { CancelSubscriptionDialog } from './cancel-subscription-dialog';
import { UpdatePlanDialog } from './update-plan-dialog';

export function SubscriptionManagement() {
  const {
    customerState,
    benefits,
    subscriptions,
    isCustomerLoading,
    // customerError,
    // benefitError,
    // subscriptionsError,
  } = useCustomerInfo();

  if (isCustomerLoading) {
    return (
      <div
        className={cn(
          'w-full text-left',
          // className
        )}>
        <Card className='shadow-lg'>
          <CardHeader className='px-4 pb-4 sm:px-6 sm:pb-6'>
            <CardTitle className='flex items-center gap-2 text-lg sm:gap-3 sm:text-xl'>
              <div className='bg-primary/10 ring-primary/20 rounded-lg p-1.5 ring-1 sm:p-2'>
                <CreditCard className='text-primary h-4 w-4 sm:h-5 sm:w-5' />
              </div>
              Current Subscription
            </CardTitle>
            <CardDescription className='text-sm sm:text-base'>
              Manage your billing and subscription settings
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6 px-4 sm:space-y-8 sm:px-6'>
            <div className={'p-4 text-center space-y-4'}>
              <span className={'text-sm text-muted-foreground'}>
                Loading your subscription information...
              </span>
              <Skeleton className={'w-full h-24 mt-4'} />
              <Skeleton className={'w-full h-24 mt-4'} />
              <Skeleton className={'w-full h-24 mt-4'} />
              <Skeleton className={'w-full h-24 mt-4'} />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'w-full text-left',
        // className
      )}>
      <Card className='shadow-lg'>
        <CardHeader className='px-4 pb-4 sm:px-6 sm:pb-6'>
          <CardTitle className='flex items-center gap-2 text-lg sm:gap-3 sm:text-xl'>
            <div className='bg-primary/10 ring-primary/20 rounded-lg p-1.5 ring-1 sm:p-2'>
              <CreditCard className='text-primary h-4 w-4 sm:h-5 sm:w-5' />
            </div>
            Current Subscription
          </CardTitle>
          <CardDescription className='text-sm sm:text-base'>
            Manage your billing and subscription settings
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-6 px-4 sm:space-y-8 sm:px-6'>
          {/* Current Plan Details with highlighted styling */}
          <div className='from-muted/30 via-muted/20 to-muted/30 border-border/50 relative overflow-hidden rounded-xl border bg-linear-to-r p-3 sm:p-4'>
            <div className='relative'>
              <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-0'>
                <div className='w-full'>
                  <div className='mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3'>
                    <div className='flex items-center gap-2'>
                      <h3 className='text-lg font-semibold sm:text-xl'>
                        {subscriptions[0]?.product?.name} Plan
                      </h3>
                    </div>
                    <div className='flex flex-wrap items-center gap-2'>
                      <Badge
                        variant={
                          customerState?.activeSubscriptions[0].status ===
                          'active'
                            ? 'default'
                            : 'outline'
                        }
                        className='bg-primary/90 hover:bg-primary border-0 text-xs font-medium shadow-sm sm:text-sm'>
                        {customerState?.type === `monthly`
                          ? `${customerState?.activeSubscriptions[0].currency}${customerState?.activeSubscriptions[0].amount}/month`
                          : customerState?.activeSubscriptions[0]
                                .recurringInterval === `month`
                            ? `${customerState?.activeSubscriptions[0].amount}/year`
                            : `${customerState?.activeSubscriptions[0].amount}`}
                      </Badge>
                      <Badge
                        variant='outline'
                        className='border-border/60 bg-background/50 text-xs shadow-sm backdrop-blur-sm sm:text-sm capitalize'>
                        {subscriptions[0]?.status}
                      </Badge>
                    </div>
                  </div>
                  <div className='relative'>
                    <p className='text-muted-foreground relative z-10 text-xs sm:text-sm'>
                      {subscriptions[0]?.product?.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator className='via-border my-4 bg-linear-to-r from-transparent to-transparent sm:my-6' />

          <div className='space-y-3 sm:space-y-4'>
            <h4 className='flex items-center gap-2 text-base font-medium sm:text-lg'>
              <div className='bg-muted ring-border/50 rounded-md p-1 ring-1 sm:p-1.5'>
                <Calendar className='h-3 w-3 sm:h-4 sm:w-4' />
              </div>
              Billing Information
            </h4>
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6'>
              <div className='group from-muted to-background/10 border-border/30 hover:border-border/60 rounded-lg border bg-linear-to-b p-2.5 transition-all duration-200 sm:p-3 md:bg-linear-to-tl'>
                <span className='text-muted-foreground mb-1 block text-xs sm:text-sm'>
                  Next billing date
                </span>
                <div className='group-hover:text-primary text-sm font-medium transition-colors duration-200 sm:text-base'>
                  {customerState?.activeSubscriptions[0].currentPeriodEnd.toLocaleDateString(
                    undefined,
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    },
                  )}
                </div>
              </div>
              <div className='group from-muted to-background/10 border-border/30 hover:border-border/60 rounded-lg border bg-linear-to-b p-2.5 transition-all duration-200 sm:p-3 md:bg-linear-to-tr'>
                <span className='text-muted-foreground mb-1 block text-xs sm:text-sm'>
                  Payment method
                </span>
                <div className='group-hover:text-primary text-sm font-medium transition-colors duration-200 sm:text-base'>
                  {/* {currentPlan.paymentMethod} */}
                  N/A
                </div>
              </div>
            </div>
          </div>

          <Separator className='via-border my-4 bg-linear-to-r from-transparent to-transparent sm:my-6' />

          <div className='flex flex-col gap-3 sm:flex-row'>
            <UpdatePlanDialog
              className='mx-0 shadow-lg transition-all duration-200 hover:shadow-xl'
              // customerState={customerState}
              // currentPlan={subscriptions[0]}
              onPlanChange={(planId) => {
                console.log(planId);
              }}
              triggerText='Update Plan'
            />

            <CancelSubscriptionDialog
              title="We're sorry to see you go..."
              description={`Before you cancel, we hope you'll consider upgrading to a ${subscriptions[0]?.product?.name} plan again.`}
              triggerButtonText='Cancel Subscription'
              leftPanelImageUrl='https://framerusercontent.com/images/GWE8vop9hubsuh3uWWn0vyuxEg.webp'
              warningTitle='You will lose access to your account'
              warningText='If you cancel your subscription, you will lose access to your account and all your data will be deleted.'
              keepButtonText={`Keep My ${subscriptions[0]?.product?.name} Plan`}
              continueButtonText='Continue with Cancellation'
              finalTitle='Final Step - Confirm Cancellation'
              finalSubtitle='This action will immediately cancel your subscription'
              finalWarningText="You'll lose access to all Pro features and your data will be permanently deleted after 30 days."
              goBackButtonText='Wait, Go Back'
              confirmButtonText='Yes, Cancel My Subscription'
              onCancel={async (planId) => {
                console.log('Cancelling subscription for plan:', planId);
                return new Promise((resolve) => {
                  setTimeout(() => {
                    resolve(void 0);
                  }, 1000);
                });
              }}
              onKeepSubscription={async (planId) => {
                console.log('Keeping subscription for plan:', planId);
              }}
              onDialogClose={() => {
                console.log('Dialog closed');
              }}
              className='max-w-4xl'
              customerState={customerState}
              benefits={benefits}
              subscriptions={subscriptions}
            />
          </div>

          <div className='pt-4 sm:pt-6'>
            <h4 className='mb-3 text-base font-medium sm:mb-4 sm:text-lg'>
              Current Plan Features
            </h4>
            <div className='flex flex-wrap gap-2 sm:gap-3'>
              {benefits.length === 0 ? (
                <p>No benefits found for this plan.</p>
              ) : (
                <>
                  {benefits.map((feature) => (
                    <div
                      key={feature.id}
                      className='group border-border/80 hover:border-primary/30 hover:bg-primary/5 flex items-center gap-2 rounded-lg border p-2 transition-all duration-200 sm:p-2'>
                      <div className='bg-primary group-hover:bg-primary h-1 w-1 shrink-0 rounded-full transition-all duration-200 group-hover:scale-125 sm:h-1.5 sm:w-1.5'></div>
                      <span className='text-muted-foreground group-hover:text-foreground text-xs transition-colors duration-200 sm:text-sm'>
                        {feature.benefit.description}
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
