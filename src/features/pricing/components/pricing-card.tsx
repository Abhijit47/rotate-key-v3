'use client';

import NumberFlow from '@number-flow/react';
import { ArrowUpRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

import { Button, buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { plans } from '@/constants/price-plan';
import Link from 'next/link';
import { useCheckout } from '../hooks/use-checkout';

const TRANSITION = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

function getFilteredPlans(billingCycle: 'month' | 'year') {
  if (billingCycle === 'month') {
    return plans.filter(
      (plan) =>
        plan.recurringInterval === 'month' || plan.recurringInterval === null,
    );
  } else {
    return plans.filter(
      (plan) =>
        plan.recurringInterval === 'year' || plan.recurringInterval === null,
    );
  }
}

// 1. Map the locale to the expected currency code in your data
const localeToCurrency = {
  'en-IN': 'inr',
  'en-US': 'usd',
  'en-GB': 'gbp',
  'de-DE': 'eur',
  'fr-FR': 'eur',
} as Record<string, string>;

function PricingCard() {
  const [billingCycle, setBillingCycle] = useState<'month' | 'year'>('month');
  const [selectedPlan, setSelectedPlan] = useState('basic');

  const { isCheckoutLoading, checkout } = useCheckout();

  const browserLanguage =
    typeof window !== 'undefined' ? navigator.language : 'en-US';

  // 2. Determine the target currency (fallback to 'usd' if unknown)
  const targetCurrency = localeToCurrency[browserLanguage] || 'usd';

  return (
    <div className='w-full flex flex-col gap-6 bg-background shadow-sm transition-colors duration-300 not-prose'>
      <div className='flex flex-col gap-4'>
        <div className='bg-muted p-1 h-10 w-full rounded-xl ring-1 ring-border flex'>
          <button
            onClick={() => setBillingCycle('month')}
            className={`flex-1 h-full rounded-lg text-base font-medium  relative transition-colors duration-300 ${
              billingCycle === 'month'
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}>
            {billingCycle === 'month' && (
              <motion.div
                layoutId='tab-bg'
                className='absolute inset-0 bg-background rounded-lg shadow-sm ring-1 ring-border'
                transition={TRANSITION}
              />
            )}
            <span className='relative z-10'>Monthly</span>
          </button>
          <button
            onClick={() => setBillingCycle('year')}
            className={`flex-1 h-full rounded-lg text-base font-medium relative transition-colors duration-300 flex items-center justify-center gap-2 ${
              billingCycle === 'year'
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}>
            {billingCycle === 'year' && (
              <motion.div
                layoutId='tab-bg'
                className='absolute inset-0 bg-background rounded-lg shadow-sm ring-1 ring-border'
                transition={TRANSITION}
              />
            )}
            <span className='relative z-10'>Yearly</span>
            <span className='relative z-10 bg-primary text-xs font-black px-1.5 py-0.5 rounded-full uppercase text-primary-foreground tracking-tight whitespace-nowrap'>
              20% OFF
            </span>
          </button>
        </div>
      </div>

      <div className='flex flex-col gap-3'>
        {getFilteredPlans(billingCycle).map((plan) => {
          const isSelected = selectedPlan === plan.id;

          // 3. Find the matching price object in your array
          const selectedPrice = plan.prices.find(
            (p) =>
              p.priceCurrency.toLowerCase() === targetCurrency.toLowerCase(),
          );

          // 4. Store the result
          const filteredPrice = selectedPrice ? selectedPrice : plan.prices[0]; // Fallback to the first price if no match found

          const planName = plan.name.split('-')[0]; // Extract the base plan name (e.g., "Pro" from "Pro-Monthly")

          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className='relative cursor-pointer'>
              <div
                className={`relative rounded-xl bg-card border border-foreground/10 transition-colors duration-300 ${
                  isSelected ? 'z-10 border-primary border-2' : ''
                }`}>
                <div className='p-5'>
                  <div className='flex justify-between items-start'>
                    <div className='flex gap-4'>
                      <div className='mt-1 shrink-0'>
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                            isSelected
                              ? 'border-primary'
                              : 'border-muted-foreground/15'
                          }`}>
                          <AnimatePresence mode='wait' initial={false}>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className='w-4 h-4 rounded-full bg-primary'
                                transition={{
                                  type: 'spring',
                                  stiffness: 300,
                                  damping: 25,
                                  duration: 0.2,
                                }}
                              />
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      <div>
                        <h3 className='text-sm font-medium text-foreground leading-tight'>
                          {/* remove - */}
                          {plan.name.split('-')[0]}
                        </h3>
                        <p className='text-xs text-muted-foreground lowercase'>
                          {plan.description}
                        </p>
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='text-xl font-medium text-foreground'>
                        <NumberFlow
                          value={filteredPrice.priceAmount / 100}
                          format={{
                            style: 'currency',
                            currency:
                              filteredPrice.priceCurrency.toLocaleUpperCase(),
                          }}
                          suffix={billingCycle === 'month' ? '/mo' : '/yr'}
                        />
                      </div>
                      <div className='text-xs text-muted-foreground/60 flex items-center justify-end gap-1 '>
                        {billingCycle === 'month' ? 'Monthly' : 'Yearly'}
                      </div>
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {isSelected && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: 0.4,
                          ease: [0.32, 0.72, 0, 1],
                        }}
                        className='overflow-hidden w-full'>
                        <div className='pt-4 flex flex-col gap-6'>
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: 0.1,
                              duration: 0.3,
                            }}
                            className='flex items-center gap-3 text-sm text-foreground/80 justify-center'>
                            <Link
                              href='/pricing'
                              className={buttonVariants({
                                variant: 'link',
                                size: 'xs',
                              })}>
                              Know more about benefits
                              <ArrowUpRight className='size-4 text-muted-foreground' />
                            </Link>
                          </motion.div>
                          {/* <div className='flex flex-col gap-3.5'>
                            {plan.benefits.map((feature, idx) => (
                              <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  delay: idx * 0.05,
                                  duration: 0.3,
                                }}
                                key={idx}
                                className='flex items-center gap-3 text-sm text-foreground/80 '>
                                <CheckIcon className='size-6 text-muted-foreground' />
                                {feature.description}
                              </motion.div>
                            ))}
                          </div> */}

                          {/* <div className='h-px bg-muted' /> */}
                          <Separator />

                          <div className='w-full'>
                            <Button
                              className={'w-full'}
                              onClick={() => checkout(plan.id)}
                              disabled={isCheckoutLoading}>
                              Upgrade to {planName}
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PricingCard;
