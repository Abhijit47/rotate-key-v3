'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { PartyPopper } from 'lucide-react';

const inputLabelClassName =
  'origin-start text-muted-foreground group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:text-foreground absolute top-1/2 block -translate-y-1/2 cursor-text px-2 text-sm transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium';

export default function OnboardingForm() {
  return (
    <form className='space-y-4' onSubmit={(e) => e.preventDefault()}>
      <div className='group relative w-full'>
        <Label
          htmlFor={'where-are-you-from'}
          className={cn(inputLabelClassName)}>
          <span className='bg-background inline-flex px-1'>
            Where are you from?
          </span>
        </Label>
        <Input
          id={'where-are-you-from'}
          type='text'
          placeholder=' '
          className='dark:bg-background'
        />
      </div>

      <div className='group relative w-full'>
        <Label
          htmlFor={'where-are-you-going'}
          className={cn(inputLabelClassName)}>
          <span className='bg-background inline-flex px-1'>
            Where do you want to go?
          </span>
        </Label>
        <Input
          id={'where-are-you-going'}
          type='text'
          placeholder=' '
          className='dark:bg-background'
        />
      </div>

      <Button className='w-full' type='submit'>
        Complete your signup <PartyPopper className='size-5' />
      </Button>
    </form>
  );
}
