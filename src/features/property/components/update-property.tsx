'use client';

import {
  SubmitErrorHandler,
  SubmitHandler,
  useFormContext,
} from 'react-hook-form';
import { toast } from 'sonner';

import { CardContent } from '@/components/ui/card';
import { FieldSet } from '@/components/ui/field';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { usePropertyContext } from '@/contexts/property-context';
import { WizardValues } from '@/lib/validators/property-schemas';
import { useParams } from 'next/navigation';
import { useUpdateProperty } from '../hooks/use-property';
import FormErrorDrawer from './form-error-drawer';
import PropertyFormFooter from './form-footer';
import PropertyFormHeader from './form-header';
import RenderFormSteps from './render-form-steps';
// import { LazyDevtool } from './steps';

const isDev = process.env.NODE_ENV !== 'development';

export default function UpdateProperty() {
  const { isLoading, onNextStep, onToggleErrorDrawer } = usePropertyContext();
  const form = useFormContext<WizardValues>();
  const params = useParams();
  // const router = useRouter();

  const { mutateAsync, isPending } = useUpdateProperty();

  const onError: SubmitErrorHandler<WizardValues> = (errors) => {
    console.log('UpdateForm errors:', JSON.stringify(errors, null, 2));
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
    // toast('updating values:', {
    //   description: (
    //     <pre className='font-mono mt-2 text-wrap p-4 rounded-md w-[320px] h-72 overflow-y-auto'>
    //       <code className={'font-serif'}>
    //         {JSON.stringify(values, null, 2)}
    //       </code>
    //     </pre>
    //   ),
    //   // position: 'bottom-right',
    //   // classNames: {
    //   //   content: 'flex flex-col gap-2',
    //   // },
    //   // style: {
    //   //   '--border-radius': 'calc(var(--radius)  + 4px)',
    //   // } as React.CSSProperties,
    // });

    if (!params?.id) {
      toast.error('Property ID is missing. Cannot update property.');
      return;
    }

    const updatedValues = {
      propertyId: params.id as string,
      ...values,
    };

    toast.promise(mutateAsync(updatedValues), {
      loading: 'Updating property...',
      success: () => {
        // setTimeout(() => {
        //   router.push('/my-properties');
        // }, 1000);
        return 'Property updated successfully';
      },
      error: (err) => {
        return err.message || 'Failed to update property';
      },
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
            id={`form-rhf-property-${params.id}`}
            onSubmit={form.handleSubmit(onSubmit, onError)}>
            <FieldSet className='gap-3' disabled={isLoading || isPending}>
              <RenderFormSteps />
            </FieldSet>
          </form>
        </CardContent>
      </ScrollArea>

      {/* <LazyDevtool control={form.control as any} /> */}

      <PropertyFormFooter />
    </>
  );
}
