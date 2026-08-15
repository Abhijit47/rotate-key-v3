import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { Badge } from '@/components/ui/badge';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { propertyAreaUnits } from '@/constants/property-assets';
import { type WizardValues } from '@/lib/validators/property-schemas';

export default function Step2Form() {
  const form =
    useFormContext<
      Pick<
        WizardValues,
        'propertyArea' | 'propertyAreaUnit' | 'propertyDescription'
      >
    >();

  const watchedPropertyDescription = useWatch({
    name: 'propertyDescription',
    control: form.control,
    compute: (val) => {
      if (val.length > 0) return val.length;
      return 0;
    },
  });

  return (
    <FieldGroup className='gap-3'>
      <div className='gap-4 grid grid-cols-1 md:grid-cols-2'>
        <Controller
          name='propertyArea'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              className='gap-2'
              data-invalid={fieldState.invalid}
              aria-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Area of property</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                placeholder='Ex. 1000'
                // the pattern will be implicitly wrapped with ^(?: and )$, such that the match is required against the entire input value, i.e., ^(?:<pattern>)$ ex. min 100, 1000 something more
                pattern={`^\d{10,}$`}
                type='number'
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name='propertyAreaUnit'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              className='gap-2'
              data-invalid={fieldState.invalid}
              aria-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Unit of property</FieldLabel>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}>
                <SelectTrigger
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  className='w-full uppercase'>
                  <SelectValue placeholder='Select' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Choose a unit</SelectLabel>
                    <SelectSeparator />
                    {propertyAreaUnits.map((language) => (
                      <SelectItem
                        key={language.value}
                        value={language.value}
                        className='uppercase'>
                        {language.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
      <Controller
        name='propertyDescription'
        control={form.control}
        render={({ field, fieldState }) => (
          <Field
            className='gap-2'
            data-invalid={fieldState.invalid}
            aria-invalid={fieldState.invalid}>
            <FieldLabel
              htmlFor={field.name}
              className={'flex items-center justify-between'}>
              Property Description
            </FieldLabel>
            <FieldDescription className='flex justify-between items-center'>
              <small className='font-normal text-muted-foreground italic'>
                (max 3000 characters)
              </small>
              <Badge variant={'outline'}>{watchedPropertyDescription}</Badge>
            </FieldDescription>
            <Textarea
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder='Ex. This is a beautiful room with all the amenities you need.'
              {...field}
              className={'min-h-48'}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </FieldGroup>
  );
}
