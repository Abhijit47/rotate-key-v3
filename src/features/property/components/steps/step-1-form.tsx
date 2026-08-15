import { CheckCircle2Icon, XCircleIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import CascadingInputs from './location-cascade-inputs';

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';

import { validatePostalCode } from '@/lib/helpers/property-helpers';
import { type WizardValues } from '@/lib/validators/property-schemas';

type Fields =
  | 'region'
  | 'country'
  | 'state'
  | 'city'
  | 'zipcode'
  | 'streetAddress';

type PickedWizardValues = Pick<WizardValues, Fields>;

export default function Step1Form() {
  const [isZipcodeValid, setIsZipcodeValid] = useState<boolean>(false);
  const form = useFormContext<PickedWizardValues>();

  const watchedCountry = useWatch({
    name: 'country',
    control: form.control,
    compute: (val) => {
      if (val) return val;
      return null;
    },
  });

  const watchedCity = useWatch({
    name: 'city',
    control: form.control,
    compute: (val) => {
      if (val) return val;
      return null;
    },
  });

  const watchedStreetAddress = useWatch({
    name: 'streetAddress',
    control: form.control,
    compute: (val) => {
      if (val.length === 0) return false;
      return true;
    },
  });

  const watchedZipcode = useWatch({
    name: 'zipcode',
    control: form.control,
    compute: (val) => {
      if (val) return val;
      return null;
    },
  });

  useEffect(() => {
    if (watchedCountry && watchedZipcode) {
      const countryISO = watchedCountry.iso2;

      if (!countryISO) return;

      if (!validatePostalCode(watchedZipcode, countryISO)) {
        // console.log(
        //   "fail-status:",
        //   validatePostalCode(watchedZipcode, countryISO),
        // );
        setIsZipcodeValid(false);
        form.setError('zipcode', {
          message: `Invalid zipcode for ${watchedCountry.name}`,
        });
      } else {
        // console.log(
        //   "pass-status:",
        //   validatePostalCode(watchedZipcode, countryISO),
        // );
        setIsZipcodeValid(true);
        form.clearErrors('zipcode');
      }
    }
  }, [watchedZipcode, watchedCountry]);

  return (
    <FieldGroup className='gap-3'>
      <div className={'grid grid-cols-1 md:grid-cols-2 gap-4'}>
        <CascadingInputs />

        <Controller
          name='streetAddress'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              className='gap-1'
              data-invalid={fieldState.invalid}
              aria-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Street Address</FieldLabel>
              <FieldDescription>
                <small className='font-normal text-muted-foreground italic'>
                  (Provide street address)
                </small>
              </FieldDescription>
              <Input
                id={field.name}
                placeholder='Ex. 42/1 elm st.'
                {...field}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name='zipcode'
          control={form.control}
          // disabled={!countryIso || !isCityAvailable || !isStateAvailable}
          render={({ field, fieldState }) => (
            <Field
              className='gap-1.5'
              aria-invalid={fieldState.invalid}
              data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>
                  Zipcode / Postal Code
                </FieldLabel>
                <FieldDescription>
                  <small className='font-normal text-muted-foreground italic'>
                    (Provide postal code)
                  </small>
                </FieldDescription>

                <div className='relative'>
                  <Input
                    type='text'
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    className='disabled:cursor-not-allowed'
                    placeholder='Enter your postal code'
                    autoComplete='postal-code'
                    {...field}
                    // disabled={!countryIso || !isCityAvailable || !isStateAvailable}
                  />
                  {!isZipcodeValid ? (
                    <XCircleIcon className='top-2.5 right-2.5 absolute stroke-destructive size-4' />
                  ) : (
                    <CheckCircle2Icon className='top-2.5 right-2.5 absolute stroke-primary size-4' />
                  )}
                </div>
              </FieldContent>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
    </FieldGroup>
  );
}
