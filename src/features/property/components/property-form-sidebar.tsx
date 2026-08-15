'use client';

import { PanelLeftIcon, PanelRightIcon } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { usePropertyContext } from '@/contexts/property-context';
import { useMediaQuery } from '@/hooks/use-media-query';
import { type WizardValues } from '@/lib/validators/property-schemas';

export default function PropertyFormSidebar() {
  const {
    isSidebarOpen,
    toggleSidebar,
    propertySteps,
    onStepChange,
    isCurrentStep,
    isIntroStep,
    isLastStep,
    onPrevStep,
    isLoading,
    // nextStep,
    // onNextStep,
    clearDraft,
  } = usePropertyContext();

  const form = useFormContext<WizardValues>();

  // const isMobile = useIsMobile();
  const isDesktop = useMediaQuery({ query: `max-width: 1280px` });

  return (
    <aside
      className={cn(
        'bg-background border-2 border-border border-r transition-all delay-100 relative',
        // 'data-open:zoom-in-100! data-open:slide-in-from-left-20 data-open:duration-600',
        isDesktop
          ? isSidebarOpen
            ? 'absolute left-0 top-0 h-full max-w-60 z-10 shadow-md block'
            : 'hidden'
          : 'relative col-span-3 block',
        'p-2 lg:p-4 space-y-4',
      )}>
      <div className='xl:hidden block w-full h-6'>
        <div className='top-0 right-0 absolute'>
          <PropertySidebarCloseButton />
        </div>
      </div>

      <div className='flex flex-wrap justify-start lg:justify-between lg:items-center gap-1'>
        <Button
          type='button'
          size={'xs'}
          variant={'destructive'}
          disabled={isIntroStep}
          onClick={() => form.reset()}
          className={'w-full'}>
          Reset form
        </Button>
        <Button
          type='button'
          size={'xs'}
          variant={'outline'}
          disabled={isIntroStep}
          onClick={() => clearDraft()}
          className={'w-full'}>
          Clear Draft
        </Button>
        <Button
          type='button'
          size={'xs'}
          variant={'secondary'}
          disabled={isIntroStep}
          onClick={() => onStepChange(0)}
          className={'w-full'}>
          Reset Step
        </Button>
      </div>

      {/* Overlay */}
      <PropertySidebarOverlay />

      <div className='flex flex-col gap-3 z-10'>
        {propertySteps.map((item, idx) => {
          return (
            <Button
              key={item.id}
              size={!!isDesktop ? 'sm' : 'lg'}
              type='button'
              variant={!isCurrentStep(item.id) ? 'outline' : 'default'}
              className='justify-between'
              // onClick={isLastStep ? () => onStepChange(idx + 1) : nextStep}
              onClick={
                isLastStep
                  ? () => onPrevStep()
                  : () => {
                      onStepChange(item.id);
                      // onNextStep();
                    }
              }
              disabled={isLoading || isIntroStep}>
              {item.title}
            </Button>
          );
        })}
      </div>
    </aside>
  );
}

export function PropertySidebarOverlay() {
  const { isSidebarOpen, toggleSidebar } = usePropertyContext();
  return (
    <div
      className={cn(
        'fixed inset-0 bg-black/50 -z-10 transition-opacity delay-150 duration-150 backdrop-blur-xs cursor-pointer',
        isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
      )}
      onClick={() => toggleSidebar()}
    />
  );
}

export function PropertySidebarCloseButton() {
  const { toggleSidebar } = usePropertyContext();

  return (
    <Button
      type='button'
      size='icon-sm'
      variant={'default'}
      // className='xl:hidden top-0 right-0 absolute'
      onClick={() => toggleSidebar()}>
      <PanelLeftIcon className='size-4' />
    </Button>
  );
}

export function PropertySidebarOpenButton() {
  const { isSidebarOpen, toggleSidebar } = usePropertyContext();
  return (
    <Button
      type='button'
      size='icon-sm'
      variant={'outline'}
      className={cn(
        'xl:hidden top-2.5 right-2 absolute',
        isSidebarOpen && 'hidden',
      )}
      onClick={() => toggleSidebar()}>
      <PanelRightIcon className='size-4' />
    </Button>
  );
}
