'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Plan, plans } from '@/constants/price-plan';
import { useCustomerInfo } from '@/features/common/hooks/use-customer-info';
import { cn } from '@/lib/utils';

export interface UpdatePlanDialogProps {
  triggerText: string;
  onPlanChange: (planId: string) => void;
  className?: string;
  title?: string;
}

const easing = [0.4, 0, 0.2, 1] as const;

const localeToCurrency = {
  'en-IN': 'inr',
  'en-US': 'usd',
  'en-GB': 'gbp',
  'de-DE': 'eur',
  'fr-FR': 'eur',
} as Record<string, string>;

export function UpdatePlanDialog(props: UpdatePlanDialogProps) {
  const { triggerText, title, className, onPlanChange } = props;

  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | undefined>(
    undefined,
  );
  const [frequency, setFrequency] = useState<'month' | 'year'>('month');
  const [isOpen, setIsOpen] = useState(false);

  const { subscriptions, isCustomerLoading } = useCustomerInfo();

  const browserLanguage =
    typeof window !== 'undefined' ? navigator.language : 'en-US';

  const filteredPlan = isYearly
    ? plans.filter((plan) => plan.recurringInterval === 'year')
    : plans.filter((plan) => plan.recurringInterval === 'month');

  const getCurrentPrice = useCallback(
    (plan: Plan) => {
      const preferredCurrency = localeToCurrency[browserLanguage] || 'usd';
      const matchingPlan = plans.find(
        (p) =>
          p.recurringInterval === (isYearly ? 'year' : 'month') &&
          p.id === plan.id,
      );
      const price =
        matchingPlan?.prices.find(
          (p) => p.priceCurrency === preferredCurrency,
        ) ?? matchingPlan?.prices[0];

      // const price = plans.find(
      //   (p) =>
      //     p.recurringInterval === (isYearly ? 'year' : 'month') &&
      //     p.id === plan.id,
      // )?.prices[0];

      return price
        ? `${(price.priceAmount / 100).toFixed(2)} ${price.priceCurrency}`
        : 'N/A';

      // return price ? `${price.priceCurrency}${price.priceAmount}` : 'N/A';
    },
    [isYearly, browserLanguage],
  );

  const handlePlanChange = useCallback((planId: string) => {
    // setSelectedPlan((prev) => (prev === planId ? undefined : planId));
    setSelectedPlan(planId);
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSelectedPlan(undefined);
    }
  }, []);

  if (isCustomerLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button>{triggerText || 'Update Plan'}</Button>
        </DialogTrigger>
        <DialogContent
          className={cn(
            'flex flex-col gap-3 sm:gap-4 max-h-[95vh] sm:max-h-[90vh] text-foreground',
            'w-[calc(100vw-2rem)] max-w-2xl sm:w-full',
            'p-4 sm:p-6',
            className,
          )}
          // style={themeStyles}
        >
          <DialogTitle className='font-semibold text-lg sm:text-xl'>
            {title || 'Upgrade Plan'}
          </DialogTitle>
          <DialogDescription>Loading customer information...</DialogDescription>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>{triggerText || 'Update Plan'}</Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          'flex flex-col gap-3 sm:gap-4 max-h-[95vh] sm:max-h-[90vh] text-foreground',
          'w-[calc(100vw-2rem)] max-w-2xl sm:w-full',
          'p-4 sm:p-6',
          className,
        )}>
        <DialogHeader className=''>
          <DialogTitle className='font-semibold text-lg sm:text-xl'>
            {title || 'Upgrade Plan'}
          </DialogTitle>

          <DialogDescription className='text-xs'>
            Toggle between monthly and yearly billing cycles to view available
            plans, then select a plan to upgrade your subscription.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <ToggleGroup
          spacing={2}
          variant='outline'
          type='single'
          size={'sm'}
          value={frequency}
          onValueChange={(value) => {
            setFrequency(value as 'month' | 'year');
            setIsYearly(value === 'year');
          }}
          className={'w-full'}>
          <ToggleGroupItem value='month' aria-label='Toggle monthly'>
            Monthly
          </ToggleGroupItem>
          <ToggleGroupItem value='year' aria-label='Toggle yearly'>
            Yearly
          </ToggleGroupItem>
        </ToggleGroup>

        <Separator />
        {/* <div className='flex items-center gap-1.5 sm:gap-2 text-sm'>
          <Toggle
            size='sm'
            pressed={!isYearly}
            onPressedChange={(pressed) => setIsYearly(!pressed)}
            className='px-3 sm:px-4 h-9 sm:h-10 text-xs sm:text-sm'>
            Monthly
          </Toggle>
          <Toggle
            size='sm'
            pressed={isYearly}
            onPressedChange={(pressed) => setIsYearly(pressed)}
            className='px-3 sm:px-4 h-9 sm:h-10 text-xs sm:text-sm'>
            Yearly
          </Toggle>
        </div> */}
        <div
          className='flex-1 [&::-webkit-scrollbar-thumb]:bg-muted [&::-webkit-scrollbar-track]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 -mx-4 sm:-mx-6 px-4 sm:px-6 [&::-webkit-scrollbar-thumb]:border-2 [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar]:w-2 min-h-0 overflow-x-hidden overflow-y-auto'
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'hsl(var(--muted)) transparent',
          }}>
          {filteredPlan.length === 0 ? (
            <div className='flex justify-center items-center py-12 text-center'>
              <p className='text-muted-foreground text-sm'>
                No plans available
              </p>
            </div>
          ) : (
            <RadioGroup value={selectedPlan} onValueChange={handlePlanChange}>
              <div className='space-y-2.5 sm:space-y-3 pr-0.5 pb-2'>
                {filteredPlan.map((plan, index) => (
                  <motion.div
                    key={plan.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      layout: { duration: 0.3, ease: easing },
                      opacity: {
                        delay: index * 0.05,
                        duration: 0.3,
                        ease: easing,
                      },
                      y: { delay: index * 0.05, duration: 0.3, ease: easing },
                    }}
                    onClick={() => handlePlanChange(plan.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handlePlanChange(plan.id);
                      }
                    }}
                    role='button'
                    tabIndex={0}
                    aria-pressed={selectedPlan === plan.id}
                    className={cn(
                      'relative border rounded-lg sm:rounded-xl overflow-hidden transition-all duration-200 cursor-pointer',
                      'focus-visible:ring-primary touch-manipulation focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                      selectedPlan === plan.id
                        ? 'border-primary from-muted/60 to-muted/30 bg-linear-to-br shadow-sm'
                        : 'border-border hover:border-primary/50',
                    )}>
                    <motion.div layout='position' className='p-3 sm:p-4'>
                      <div className='flex justify-between items-start gap-2 sm:gap-3'>
                        <div className='flex flex-1 gap-2 sm:gap-3 min-w-0'>
                          <RadioGroupItem
                            value={plan.id}
                            id={plan.id}
                            className='mt-0.5 sm:mt-1 pointer-events-none shrink-0'
                          />
                          <div className='flex-1 min-w-0'>
                            <div className='flex flex-wrap items-center gap-1.5 sm:gap-2'>
                              <Label
                                htmlFor={plan.id}
                                className='sm:font-medium font-semibold text-sm sm:text-base leading-tight cursor-pointer'>
                                {plan.name}
                              </Label>
                              {plan.popular && (
                                <Badge
                                  variant='secondary'
                                  className='px-1.5 sm:px-2 py-0 sm:py-0.5 h-5 sm:h-auto text-[10px] sm:text-xs shrink-0'>
                                  Most Popular
                                </Badge>
                              )}
                            </div>
                            <p className='mt-1 text-[11px] text-muted-foreground sm:text-xs leading-relaxed'>
                              {plan.description}
                            </p>
                            {plan.benefits.length > 0 && (
                              <div className='pt-2 sm:pt-3'>
                                <div className='flex flex-wrap gap-1.5 sm:gap-2'>
                                  {plan.benefits.map(
                                    (feature, featureIndex) => (
                                      <div
                                        key={featureIndex}
                                        className='flex items-center gap-1.5 sm:gap-2 bg-muted/20 px-2 py-1 border border-border/30 rounded-md sm:rounded-lg shrink-0'>
                                        <div className='bg-primary rounded-full w-1 sm:w-1.5 h-1 sm:h-1.5 shrink-0' />
                                        <span className='text-[10px] text-muted-foreground sm:text-xs leading-none whitespace-nowrap'>
                                          {feature.description}
                                        </span>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className='min-w-15 sm:min-w-20 text-right shrink-0'>
                          <div className='sm:font-semibold font-bold text-base sm:text-xl leading-tight'>
                            {/* {parseFloat(getCurrentPrice(plan)) >= 0
                              ? `${plan.currency}${getCurrentPrice(plan)}`
                              : getCurrentPrice(plan)} */}
                            {getCurrentPrice(plan)}
                          </div>
                          <div className='mt-0.5 text-[10px] text-muted-foreground sm:text-xs'>
                            /{isYearly ? 'year' : 'month'}
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <AnimatePresence initial={false}>
                      {selectedPlan === plan.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{
                            height: 'auto',
                            opacity: 1,
                            transition: {
                              height: { duration: 0.3, ease: easing },
                              opacity: {
                                duration: 0.25,
                                delay: 0.05,
                                ease: easing,
                              },
                            },
                          }}
                          exit={{
                            height: 0,
                            opacity: 0,
                            transition: {
                              height: { duration: 0.25, ease: easing },
                              opacity: { duration: 0.15, ease: easing },
                            },
                          }}
                          className='overflow-hidden'>
                          <motion.div
                            initial={{ y: -8 }}
                            animate={{
                              y: 0,
                              transition: {
                                duration: 0.25,
                                delay: 0.05,
                                ease: easing,
                              },
                            }}
                            exit={{ y: -8 }}
                            className='px-3 sm:px-4 pb-3 sm:pb-4'>
                            <Button
                              className='w-full font-medium text-sm sm:text-base touch-manipulation'
                              disabled={
                                selectedPlan === subscriptions[0]?.product?.id
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                onPlanChange(plan.id);
                                handleOpenChange(false);
                              }}>
                              {selectedPlan === subscriptions[0]?.product?.id
                                ? 'Current Plan'
                                : 'Upgrade'}
                            </Button>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </RadioGroup>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
