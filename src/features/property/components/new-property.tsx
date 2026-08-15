'use client';

// import { DevTool } from '@hookform/devtools';
import type { SubmitErrorHandler, SubmitHandler } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';

import { CardContent } from '@/components/ui/card';
import { FieldSet } from '@/components/ui/field';
import { Separator } from '@/components/ui/separator';

import FormErrorDrawer from './form-error-drawer';
import PropertyFormFooter from './form-footer';
import PropertyFormHeader from './form-header';
import RenderFormSteps from './render-form-steps';

import { ScrollArea } from '@/components/ui/scroll-area';
import { usePropertyContext } from '@/contexts/property-context';
import { type WizardValues } from '@/lib/validators/property-schemas';
import { LazyDevtool } from './steps';

const isDev = process.env.NODE_ENV === 'development';

export default function NewProperty() {
  const { isLoading, onNextStep, onToggleErrorDrawer } = usePropertyContext();
  const form = useFormContext<WizardValues>();

  const onError: SubmitErrorHandler<WizardValues> = (errors) => {
    console.log('Form errors:', JSON.stringify(errors, null, 2));
    // onToggleErrorDrawer();
    Object.entries(errors).forEach(([key, value]) => {
      // console.log(key, value);
      toast.error(`${key} - ${value?.message}`);
      return;
    });
    return;
  };

  const onSubmit: SubmitHandler<WizardValues> = (values) => {
    onNextStep();
    toast('You submitted the following values:', {
      description: (
        <pre className='font-mono mt-2 text-wrap p-4 rounded-md w-[320px] h-72 overflow-y-auto'>
          <code className={'font-serif'}>
            {JSON.stringify(values, null, 2)}
          </code>
        </pre>
      ),
      // position: 'bottom-right',
      // classNames: {
      //   content: 'flex flex-col gap-2',
      // },
      // style: {
      //   '--border-radius': 'calc(var(--radius)  + 4px)',
      // } as React.CSSProperties,
    });
  };

  return (
    <>
      <PropertyFormHeader />
      <Separator />
      <FormErrorDrawer />

      <ScrollArea className='h-[calc(100vh-8em)] w-full overflow-x-hidden'>
        <CardContent>
          <form
            id='form-rhf-property'
            onSubmit={form.handleSubmit(onSubmit, onError)}>
            <FieldSet className='gap-3' disabled={isLoading}>
              <RenderFormSteps />
            </FieldSet>
          </form>
        </CardContent>
      </ScrollArea>

      {isDev ? <LazyDevtool control={form.control as any} /> : null}

      <PropertyFormFooter />
    </>
  );
}
