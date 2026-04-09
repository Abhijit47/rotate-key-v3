'use client';
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
import { plans } from '@/constants/price-plan';
import { cn } from '@/lib/utils';
import NumberFlow from '@number-flow/react';
import { IconBolt, IconShield, IconStar } from '@tabler/icons-react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useCheckout } from '../hooks/use-checkout';

function RenderIcon({ planName }: { planName: string }) {
  switch (planName) {
    case 'Free':
      return <IconStar className='h-4 w-4' />;
    case 'Basic':
      return <IconBolt className='h-4 w-4' />;
    case 'Pro':
      return <IconShield className='h-4 w-4' />;
    default:
      return null;
  }
}

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

export default function SimplePricing() {
  const [billingCycle, setBillingCycle] = useState<'month' | 'year'>('month');

  const { isCheckoutLoading, checkout } = useCheckout();

  // during render, we can determine the user's locale and map it to the corresponding currency code
  // if problem then useEffect to set it after mount
  const browserLanguage =
    typeof window !== 'undefined' ? navigator.language : 'en-US';

  // 2. Determine the target currency (fallback to 'usd' if unknown)
  const targetCurrency = localeToCurrency[browserLanguage] || 'usd';

  return (
    <div className='not-prose relative flex w-full flex-col gap-16 overflow-hidden px-4 py-24 text-center sm:px-8'>
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='bg-primary/10 absolute -top-[10%] left-[50%] h-[40%] w-[60%] -translate-x-1/2 rounded-full blur-3xl' />
        <div className='bg-primary/5 absolute -right-[10%] -bottom-[10%] h-[40%] w-[40%] rounded-full blur-3xl' />
        <div className='bg-primary/5 absolute -bottom-[10%] -left-[10%] h-[40%] w-[40%] rounded-full blur-3xl' />
      </div>

      <div className='flex flex-col items-center justify-center gap-8'>
        <div className='flex flex-col items-center space-y-2'>
          <Badge
            variant='outline'
            className='border-primary/20 bg-primary/5 mb-4 rounded-full px-4 py-1 text-sm font-medium'>
            <Sparkles className='text-primary mr-1 h-3.5 w-3.5 animate-pulse' />
            Pricing Plans
          </Badge>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='from-foreground to-foreground/30 bg-linear-to-b bg-clip-text text-4xl font-bold text-transparent sm:text-5xl'>
            Pick the perfect plan for your needs
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className='text-muted-foreground max-w-md pt-2 text-lg'>
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
            className='bg-muted/30 inline-block rounded-full p-1 shadow-sm'>
            <TabsList className='bg-transparent'>
              <TabsTrigger
                value='month'
                className='data-[state=active]:bg-background rounded-full transition-all duration-300 data-[state=active]:shadow-sm'>
                Monthly
              </TabsTrigger>
              <TabsTrigger
                value='year'
                className='data-[state=active]:bg-background rounded-full transition-all duration-300 data-[state=active]:shadow-sm'>
                Yearly
                <Badge
                  variant='secondary'
                  className='bg-primary/10 text-primary hover:bg-primary/15 ml-2'>
                  20% off
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        <div className='mt-8 grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-3'>
          {getFilteredPlans(billingCycle).map((plan, index) => {
            // 3. Find the matching price object in your array
            const selectedPrice = plan.prices.find(
              (p) =>
                p.priceCurrency.toLowerCase() === targetCurrency.toLowerCase(),
            );

            // 4. Store the result
            const filteredPrice = selectedPrice
              ? selectedPrice
              : plan.prices[0]; // Fallback to the first price if no match found

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
                    'bg-secondary/20 relative h-full w-full text-left transition-all duration-300 hover:shadow-lg',
                    plan.popular
                      ? 'ring-primary/50 dark:shadow-primary/10 shadow-md ring-2'
                      : 'hover:border-primary/30',
                    plan.popular &&
                      'from-primary/3 bg-linear-to-b to-transparent',
                  )}>
                  {plan.popular && (
                    <div className='absolute -top-3 right-0 left-0 mx-auto w-fit'>
                      <Badge className='bg-primary text-primary-foreground rounded-full px-4 py-1 shadow-sm'>
                        <Sparkles className='mr-1 h-3.5 w-3.5' />
                        Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className={cn('pb-4', plan.popular && 'pt-8')}>
                    <div className='flex items-center gap-2'>
                      <div
                        className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-full',
                          plan.popular
                            ? 'bg-primary/10 text-primary'
                            : 'bg-secondary text-foreground',
                        )}>
                        {/* <plan.icon className='h-4 w-4' /> */}
                        <RenderIcon planName={planName} />
                      </div>
                      <CardTitle
                        className={cn(
                          'text-xl font-bold',
                          plan.popular && 'text-primary',
                        )}>
                        {planName}
                      </CardTitle>
                    </div>
                    <CardDescription className='mt-3 space-y-2'>
                      <p className='text-sm'>{plan.description}</p>
                      <div className='pt-2'>
                        <div className='flex items-baseline'>
                          <NumberFlow
                            className={cn(
                              'text-3xl font-bold',
                              plan.popular ? 'text-primary' : 'text-foreground',
                            )}
                            format={{
                              style: 'currency',
                              currency:
                                filteredPrice.priceCurrency.toUpperCase(),
                              maximumFractionDigits: 0,
                            }}
                            value={filteredPrice.priceAmount / 100}
                          />
                          <span className='text-muted-foreground ml-1 text-sm'>
                            /month, billed{' '}
                            {billingCycle === 'year' ? 'annually' : 'monthly'}
                          </span>
                        </div>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='grid gap-3 pb-6'>
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
                              'flex h-5 w-5 items-center justify-center rounded-full',
                              plan.popular
                                ? 'bg-primary/10 text-primary'
                                : 'bg-secondary text-secondary-foreground',
                            )}>
                            <Check className='h-3.5 w-3.5' />
                          </div>
                          <span
                            className={
                              plan.popular
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
                      variant={plan.popular ? 'default' : 'outline'}
                      className={cn(
                        'w-full font-medium transition-all duration-300',
                        plan.popular
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
                          <ArrowRight className='ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1' />
                        </span>
                      )}
                    </Button>
                  </CardFooter>

                  {/* Subtle gradient effects */}
                  {plan.popular ? (
                    <>
                      <div className='from-primary/5 pointer-events-none absolute right-0 bottom-0 left-0 h-1/2 rounded-b-lg bg-linear-to-t to-transparent' />
                      <div className='border-primary/20 pointer-events-none absolute inset-0 rounded-lg border' />
                    </>
                  ) : (
                    <div className='hover:border-primary/10 pointer-events-none absolute inset-0 rounded-lg border border-transparent opacity-0 transition-opacity duration-300 hover:opacity-100' />
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
