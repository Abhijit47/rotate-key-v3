'use client';

import NumberFlow from '@number-flow/react';
import { IconBolt, IconShield, IconStar } from '@tabler/icons-react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useCheckout } from '../hooks/use-checkout';

import { Product } from '@polar-sh/sdk/models/components/product.js';
import { ProductPriceFixed } from '@polar-sh/sdk/models/components/productpricefixed.js';

function RenderIcon({ planName }: { planName: string }) {
  switch (planName) {
    case 'Free':
      return <IconStar className='w-4 h-4' />;
    case 'Basic':
      return <IconBolt className='w-4 h-4' />;
    case 'Pro':
      return <IconShield className='w-4 h-4' />;
    default:
      return null;
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

export default function SimplePricing({ plans }: { plans: Product[] }) {
  const [billingCycle, setBillingCycle] = useState<'month' | 'year'>('month');

  const { isCheckoutLoading, checkout } = useCheckout();

  // during render, we can determine the user's locale and map it to the corresponding currency code
  // if problem then useEffect to set it after mount
  const browserLanguage =
    typeof window !== 'undefined' ? navigator.language : 'en-US';

  // 2. Determine the target currency (fallback to 'usd' if unknown)
  const targetCurrency = localeToCurrency[browserLanguage] || 'usd';

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

  return (
    <div className='relative flex flex-col gap-16 px-4 sm:px-8 py-24 w-full overflow-hidden text-center not-prose'>
      <div className='-z-10 absolute inset-0 overflow-hidden'>
        <div className='top-[-10%] left-[50%] absolute bg-primary/10 blur-3xl rounded-full w-[60%] h-[40%] -translate-x-1/2' />
        <div className='right-[-10%] bottom-[-10%] absolute bg-primary/5 blur-3xl rounded-full w-[40%] h-[40%]' />
        <div className='bottom-[-10%] left-[-10%] absolute bg-primary/5 blur-3xl rounded-full w-[40%] h-[40%]' />
      </div>

      <div className='flex flex-col justify-center items-center gap-8'>
        <div className='flex flex-col items-center space-y-2'>
          <Badge
            variant='outline'
            className='bg-primary/5 mb-4 px-4 py-1 border-primary/20 rounded-full font-medium text-sm'>
            <Sparkles className='mr-1 w-3.5 h-3.5 text-primary animate-pulse' />
            Pricing Plans
          </Badge>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='bg-clip-text bg-linear-to-b from-primary to-primary/30 font-bold text-transparent text-4xl sm:text-5xl'>
            Pick the perfect plan for your needs
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className='pt-2 max-w-md text-muted-foreground text-lg'>
            Simple, transparent pricing that scales with your business. No
            hidden fees, no surprises.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}>
          <Tabs
            defaultValue={billingCycle}
            onValueChange={(value) =>
              setBillingCycle(value as 'month' | 'year')
            }
            className='inline-block bg-muted/30 shadow-sm p-1 rounded-full'>
            <TabsList className='bg-transparent'>
              <TabsTrigger
                value='month'
                className='data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-full transition-all duration-300'>
                Monthly
              </TabsTrigger>
              <TabsTrigger
                value='year'
                className='data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-full transition-all duration-300'>
                Yearly
                <Badge
                  variant='secondary'
                  className='bg-primary/10 hover:bg-primary/15 ml-2 text-primary'>
                  20% off
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        <div className='gap-6 grid grid-cols-1 md:grid-cols-3 mt-8 w-full max-w-6xl'>
          {getFilteredPlans(billingCycle).map((plan, index) => {
            // 3. Find the matching price object in your array
            const selectedPrice = plan.prices.find(
              (p) =>
                p.priceCurrency.toLowerCase() === targetCurrency.toLowerCase(),
            );

            // 4. Store the result
            const filteredPrice = selectedPrice
              ? (selectedPrice as ProductPriceFixed)
              : (plan.prices[0] as ProductPriceFixed); // Fallback to the first price if no match found

            const planName = plan.name.split('-')[0]; // Extract the base plan name (e.g., "Pro" from "Pro-Monthly")

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className='flex'>
                <Card
                  className={cn(
                    'relative bg-secondary/20 hover:shadow-lg w-full h-full text-left transition-all duration-300',
                    plan.metadata?.popular
                      ? 'ring-primary/50 dark:shadow-primary/10 shadow-md ring-2'
                      : 'hover:border-primary/30',
                    plan.metadata?.popular &&
                      'from-primary/3 bg-linear-to-b to-transparent',
                  )}>
                  {plan.metadata?.popular && (
                    <div className='-top-3 right-0 left-0 absolute mx-auto w-fit'>
                      <Badge className='bg-primary shadow-sm px-4 py-1 rounded-full text-primary-foreground'>
                        <Sparkles className='mr-1 w-3.5 h-3.5' />
                        Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader
                    className={cn('pb-4', plan.metadata?.popular && 'pt-8')}>
                    <div className='flex items-center gap-2'>
                      <div
                        className={cn(
                          'flex justify-center items-center rounded-full w-8 h-8',
                          plan.metadata?.popular
                            ? 'bg-primary/10 text-primary'
                            : 'bg-secondary text-foreground',
                        )}>
                        {/* <plan.icon className='w-4 h-4' /> */}
                        <RenderIcon planName={planName} />
                      </div>
                      <CardTitle
                        className={cn(
                          'font-bold text-xl',
                          plan.metadata?.popular && 'text-primary',
                        )}>
                        {planName}
                      </CardTitle>
                    </div>
                    <CardDescription className='space-y-2 mt-3'>
                      <p className='text-sm'>{plan.description}</p>
                      <div className='pt-2'>
                        <div className='flex items-baseline'>
                          <NumberFlow
                            className={cn(
                              'font-bold text-3xl',
                              plan.metadata?.popular
                                ? 'text-primary'
                                : 'text-foreground',
                            )}
                            format={{
                              style: 'currency',
                              currency:
                                filteredPrice.priceCurrency.toUpperCase(),
                              maximumFractionDigits: 0,
                            }}
                            value={filteredPrice.priceAmount / 100}
                          />

                          <span className='ml-1 text-muted-foreground text-sm'>
                            /month, billed{' '}
                            {billingCycle === 'year' ? 'annually' : 'monthly'}
                          </span>
                        </div>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='gap-3 grid pb-6'>
                    {plan.benefits.map((feature, index) => {
                      // filter by planName.toLowerCase() and feature.metadata.tier.toLowerCase() === planName.toLowerCase()
                      // pro: unlimited
                      //free: 3;
                      //basic: 5;

                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: 0.5 + index * 0.05,
                          }}
                          className='flex items-center gap-2 text-sm'>
                          <div
                            className={cn(
                              'flex justify-center items-center rounded-full w-5 h-5',
                              plan.metadata?.popular
                                ? 'bg-primary/10 text-primary'
                                : 'bg-secondary text-secondary-foreground',
                            )}>
                            <Check className='w-3.5 h-3.5' />
                          </div>
                          <span
                            className={
                              plan.metadata?.popular
                                ? 'text-foreground'
                                : 'text-muted-foreground'
                            }>
                            {feature.description}
                          </span>
                        </motion.div>
                      );
                    })}
                  </CardContent>
                  <CardFooter className={'mt-auto'}>
                    <Button
                      disabled={isCheckoutLoading}
                      onClick={() => checkout(plan.id)}
                      variant={plan.metadata?.popular ? 'default' : 'outline'}
                      className={cn(
                        'w-full font-medium transition-all duration-300',
                        plan.metadata?.popular
                          ? 'bg-primary hover:bg-primary/90 hover:shadow-primary/20 hover:shadow-md'
                          : 'hover:border-primary/30 hover:bg-primary/5 hover:text-primary',
                      )}>
                      {isCheckoutLoading ? (
                        <span className={'inline-flex items-center gap-2'}>
                          Processing...
                          <Spinner />
                        </span>
                      ) : (
                        <span className={'inline-flex items-center gap-2'}>
                          {planName}
                          <ArrowRight className='ml-2 w-4 h-4 transition-transform group-hover:translate-x-1 duration-300' />
                        </span>
                      )}
                    </Button>
                  </CardFooter>

                  {/* Subtle gradient effects */}
                  {plan.metadata?.popular ? (
                    <>
                      <div className='right-0 bottom-0 left-0 absolute bg-linear-to-t from-primary/5 to-transparent rounded-b-lg h-1/2 pointer-events-none' />
                      <div className='absolute inset-0 border border-primary/20 rounded-lg pointer-events-none' />
                    </>
                  ) : (
                    <div className='absolute inset-0 opacity-0 hover:opacity-100 border border-transparent hover:border-primary/10 rounded-lg transition-opacity duration-300 pointer-events-none' />
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
