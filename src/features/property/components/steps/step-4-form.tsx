import { Fragment } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';

import { propertyAccomodations } from '@/constants/property-assets';
import { type WizardValues } from '@/lib/validators/property-schemas';

export default function Step4Form() {
  const form =
    useFormContext<
      Pick<
        WizardValues,
        | 'propertyBedRooms'
        | 'propertyBathRooms'
        | 'numberOfBeds'
        | 'numberOfGuests'
        | 'propertyAccomodationType'
      >
    >();

  const watchedBedroom = useWatch({
    name: 'propertyBedRooms',
    control: form.control,
    compute: (val) => {
      if (val?.length > 0) return val;
      return undefined;
    },
  });
  const watchedBathroom = useWatch({
    name: 'propertyBathRooms',
    control: form.control,
    compute: (val) => {
      if (val?.length > 0) return val;
      return undefined;
    },
  });
  const watchedBeds = useWatch({
    name: 'numberOfBeds',
    control: form.control,
    compute: (val) => {
      if (val?.length > 0) return val;
      return undefined;
    },
  });
  const watchedGuests = useWatch({
    name: 'numberOfGuests',
    control: form.control,
    compute: (val) => {
      if (val?.length > 0) return val;
      return undefined;
    },
  });

  return (
    <div className={'space-y-4'}>
      <Controller
        name='propertyBedRooms'
        control={form.control}
        render={({ field, fieldState }) => (
          <Field
            data-invalid={fieldState.invalid}
            aria-invalid={fieldState.invalid}>
            <FieldContent className={'relative'}>
              <FieldLabel htmlFor={field.name}>
                How many bedrooms do you have ?
              </FieldLabel>
              {fieldState.invalid ? (
                <FieldError errors={[fieldState.error]} />
              ) : (
                <FieldDescription className={'text-xs'}>
                  Specify the number of bedrooms available in your property.
                </FieldDescription>
              )}
              <FieldDescription className={'text-xs absolute right-0 top-0'}>
                {!watchedBedroom?.length ? '0 room' : `${watchedBedroom} rooms`}
              </FieldDescription>
            </FieldContent>
            <Slider
              id={field.name}
              name={field.name}
              value={[Number(field.value) || 0]}
              onValueChange={(value) => field.onChange(String(value[0]))}
              aria-invalid={fieldState.invalid}
              data-invalid={fieldState.invalid}
              max={10}
              step={1}
              min={0}
              className='w-full'
            />
          </Field>
        )}
      />

      <Controller
        name='propertyBathRooms'
        control={form.control}
        render={({ field, fieldState }) => (
          <Field
            data-invalid={fieldState.invalid}
            aria-invalid={fieldState.invalid}>
            <FieldContent className={'relative'}>
              <FieldLabel htmlFor={field.name}>
                How many bathrooms do you have ?
              </FieldLabel>
              {fieldState.invalid ? (
                <FieldError errors={[fieldState.error]} />
              ) : (
                <FieldDescription className={'text-xs'}>
                  Specify the number of bathrooms available in your property.
                </FieldDescription>
              )}
              <FieldDescription className={'text-xs absolute right-0 top-0'}>
                {!watchedBathroom?.length
                  ? '0 bathroom'
                  : `${watchedBathroom} bathrooms`}
              </FieldDescription>
              <Slider
                id={field.name}
                name={field.name}
                value={[Number(field.value) || 0]}
                onValueChange={(value) => field.onChange(String(value[0]))}
                aria-invalid={fieldState.invalid}
                data-invalid={fieldState.invalid}
                max={10}
                step={1}
                min={0}
                className='w-full'
              />
            </FieldContent>
          </Field>
        )}
      />

      <Controller
        name='numberOfBeds'
        control={form.control}
        render={({ field, fieldState }) => (
          <Field
            data-invalid={fieldState.invalid}
            aria-invalid={fieldState.invalid}>
            <FieldContent className={'relative'}>
              <FieldLabel htmlFor={field.name}>
                How many beds do you have ?
              </FieldLabel>
              {fieldState.invalid ? (
                <FieldError errors={[fieldState.error]} />
              ) : (
                <FieldDescription className={'text-xs'}>
                  Specify the number of beds available in your property.
                </FieldDescription>
              )}
              <FieldDescription className={'text-xs absolute right-0 top-0'}>
                {!watchedBeds?.length ? '0 beds' : `${watchedBeds} beds`}
              </FieldDescription>
              <Slider
                id={field.name}
                name={field.name}
                value={[Number(field.value) || 0]}
                onValueChange={(value) => field.onChange(String(value[0]))}
                aria-invalid={fieldState.invalid}
                data-invalid={fieldState.invalid}
                max={10}
                step={1}
                min={0}
                className='w-full'
              />
            </FieldContent>
          </Field>
        )}
      />

      <Controller
        name='numberOfGuests'
        control={form.control}
        render={({ field, fieldState }) => (
          <Field
            data-invalid={fieldState.invalid}
            aria-invalid={fieldState.invalid}>
            <FieldContent className={'relative'}>
              <FieldLabel htmlFor={field.name}>
                How many guests can stay in your property ?
              </FieldLabel>
              {fieldState.invalid ? (
                <FieldError errors={[fieldState.error]} />
              ) : (
                <FieldDescription className={'text-xs'}>
                  Specify the maximum number of guests that can stay in your
                  property.
                </FieldDescription>
              )}
              <FieldDescription className={'text-xs absolute right-0 top-0'}>
                {!watchedGuests?.length
                  ? '0 guests'
                  : `${watchedGuests} guests`}
              </FieldDescription>
              <Slider
                id={field.name}
                name={field.name}
                value={[Number(field.value) || 0]}
                onValueChange={(value) => field.onChange(String(value[0]))}
                aria-invalid={fieldState.invalid}
                data-invalid={fieldState.invalid}
                max={10}
                step={1}
                min={0}
                className='w-full'
              />
            </FieldContent>
          </Field>
        )}
      />

      <Controller
        name='propertyAccomodationType'
        control={form.control}
        render={({ field, fieldState }) => (
          <FieldSet data-invalid={fieldState.invalid}>
            <FieldLegend>Accomodation type</FieldLegend>
            <FieldDescription>
              <span>
                <small className='italic font-normal text-muted-foreground'>
                  (Select an accomodation type.)
                </small>
              </span>
            </FieldDescription>
            <RadioGroup
              name={field.name}
              value={field.value}
              onValueChange={field.onChange}
              aria-invalid={fieldState.invalid}
              className={'grid-cols-[repeat(auto-fit,minmax(220px,1fr))]'}>
              {propertyAccomodations.map((items) => {
                return (
                  <Fragment key={items.id}>
                    {items.categoryTypes.map((type) => {
                      return (
                        <FieldLabel
                          key={type.id}
                          htmlFor={`accomodation-${type.id}`}>
                          <Field
                            orientation={'horizontal'}
                            data-invalid={fieldState.invalid}
                            aria-invalid={fieldState.invalid}>
                            <RadioGroupItem
                              id={`accomodation-${type.id}`}
                              value={type.name.toLocaleLowerCase()}
                              aria-invalid={fieldState.invalid}
                            />
                            <FieldContent>
                              <FieldDescription>
                                {/* <CircleCheck className='absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-6 w-6 text-primary fill-primary-500 stroke-white group-data-[state=unchecked]:hidden' /> */}
                                {/* <type.icon className='mb-2.5 text-muted-foreground size-4' /> */}
                                <span className='font-semibold tracking-tight'>
                                  {type.name}
                                </span>
                              </FieldDescription>
                              <p className='text-xs'>{type.description}</p>
                            </FieldContent>
                          </Field>
                        </FieldLabel>
                      );
                    })}
                  </Fragment>
                );
              })}
            </RadioGroup>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </FieldSet>
        )}
      />
    </div>
  );
}
