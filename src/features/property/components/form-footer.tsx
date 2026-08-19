import { IconTrashX } from '@tabler/icons-react';
import {
  CheckCircle2Icon,
  ChevronLeftCircle,
  ChevronRightCircle,
  EditIcon,
} from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { Field } from '@/components/ui/field';

import { Progress } from '@/components/ui/progress';
import { Spinner } from '@/components/ui/spinner';
import { usePropertyContext } from '@/contexts/property-context';
import { type WizardValues } from '@/lib/validators/property-schemas';
import { useParams } from 'next/navigation';

export default function PropertyFormFooter() {
  const params = useParams();

  const {
    isLastStep,
    isIntroStep,
    isFirstStep,
    onPrevStep,
    onNextStep,
    isLoading,
    progress,
  } = usePropertyContext();

  const form = useFormContext<WizardValues>();

  if (isIntroStep) return null;

  return (
    <CardFooter className='mt-auto border-t flex flex-col gap-1 pt-0'>
      <Progress value={progress} className={'w-full'} />
      {isLastStep ? (
        <Field orientation='horizontal' className='justify-between'>
          <Button type='button' variant='outline' onClick={() => form.reset()}>
            <IconTrashX className={'size-4'} />
            Reset
          </Button>
          <Button
            type='submit'
            form={
              params?.id
                ? `form-rhf-property-${params.id}`
                : 'form-rhf-property'
            }>
            {params?.id ? (
              <span className='inline-flex items-center gap-2'>
                Update Property
                <EditIcon className={'size-4'} />
              </span>
            ) : (
              <span className='inline-flex items-center gap-2'>
                Create Property <CheckCircle2Icon className={'size-4'} />
              </span>
            )}
          </Button>
        </Field>
      ) : (
        <Field orientation='horizontal' className='justify-between'>
          <Button
            type='button'
            variant={'secondary'}
            onClick={onPrevStep}
            disabled={isFirstStep}>
            <span className='inline-flex items-center gap-2'>
              <ChevronLeftCircle className={'size-4'} /> Prev
            </span>
          </Button>
          <Button
            type='button'
            onClick={() => {
              onNextStep();
            }}
            disabled={isLoading}>
            {isLoading ? (
              <span className='inline-flex items-center gap-2'>
                Validating <Spinner className={'size-4'} />
              </span>
            ) : (
              <span className='inline-flex items-center gap-2'>
                Next <ChevronRightCircle className={'size-4'} />
              </span>
            )}
          </Button>
        </Field>
      )}
    </CardFooter>
  );
}
