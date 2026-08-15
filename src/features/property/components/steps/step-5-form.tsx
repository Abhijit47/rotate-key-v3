import { Controller, useFormContext } from 'react-hook-form';

import { MultiSelect } from '@/components/extends/multi-select';
import { PhoneInput } from '@/components/extends/phone-input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { hostLanguages } from '@/constants/property-assets';

import { type WizardValues } from '@/lib/validators/property-schemas';

const languages = hostLanguages.map((lang) => {
  return {
    label: lang.language,
    value: lang.language,
    flag: lang.flag,
  };
});

export default function Step5Form() {
  const form =
    useFormContext<
      Pick<
        WizardValues,
        | 'propertyOwnerName'
        | 'propertyOwnerEmail'
        | 'propertyOwnerPhone'
        | 'hostKnownLanguages'
      >
    >();

  return (
    <div className={'grid grid-cols-1 md:grid-cols-2 gap-4'}>
      <Controller
        name='propertyOwnerName'
        control={form.control}
        render={({ field, fieldState }) => (
          <Field
            className='gap-1'
            data-invalid={fieldState.invalid}
            aria-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              <span>Full name</span>
              <small className='italic font-normal text-muted-foreground'>
                (Mention the name of the owner.)
              </small>
            </FieldLabel>
            <Input
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder='John'
              autoComplete='name'
              {...field}
            />
            {/* <FieldDescription>
                    This is your public display name. Must be between 3 and 10
                    characters. Must only contain letters, numbers, and underscores.
                  </FieldDescription> */}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name='propertyOwnerEmail'
        control={form.control}
        render={({ field, fieldState }) => (
          <Field
            className='gap-1'
            data-invalid={fieldState.invalid}
            aria-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              <span>Email</span>
              <small className='italic font-normal text-muted-foreground'>
                (Mention the email of the owner.)
              </small>
            </FieldLabel>
            <Input
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder='someone@example.com'
              autoComplete='email'
              {...field}
            />
            {/* <FieldDescription>
                    This is your public display name. Must be between 3 and 10
                    characters. Must only contain letters, numbers, and underscores.
                  </FieldDescription> */}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name='propertyOwnerPhone'
        control={form.control}
        render={({ field, fieldState }) => (
          <Field
            className='gap-1'
            data-invalid={fieldState.invalid}
            aria-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              <span>Phone Number</span>
              <small className='italic font-normal text-muted-foreground'>
                (Mention the phone number of the owner.)
              </small>
            </FieldLabel>

            <PhoneInput
              international
              defaultCountry='IN'
              placeholder='Enter a phone number'
              {...field}
              value={field?.value?.length ? field.value : ''}
              aria-invalid={fieldState.invalid}
            />

            {fieldState.invalid && (
              <FieldError className='text-xs' errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />

      <Controller
        name='hostKnownLanguages'
        control={form.control}
        render={({ field, fieldState }) => (
          <Field
            className='gap-1'
            data-invalid={fieldState.invalid}
            aria-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              <span>Select your preferred languages</span>
              <small className='italic font-normal text-muted-foreground'>
                (Mention the languages your host know.)
              </small>
            </FieldLabel>
            <MultiSelect
              aria-invalid={fieldState.invalid}
              id={field.name}
              commandClassName='max-w-sm capitalize'
              className='capitalize'
              options={languages}
              onValueChange={field.onChange}
              defaultValue={field.value}
              placeholder='Choose languages'
              variant='inverted'
              animation={0}
              maxCount={3}
            />
            {/* <FieldDescription>
              This is your public display name. Must be between 3 and 10
              characters. Must only contain letters, numbers, and underscores.
            </FieldDescription> */}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </div>
  );
}
