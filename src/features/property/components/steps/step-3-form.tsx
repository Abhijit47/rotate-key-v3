import { useTheme } from 'next-themes';
import { Fragment } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { Badge } from '@/components/ui/badge';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  propertyEnvironments,
  propertyOwnerships,
  propertyRentalPeriods,
  propertySurroundings,
  propertySwapings,
  propertyTypes,
} from '@/constants/property-assets';
import { type WizardValues } from '@/lib/validators/property-schemas';

export default function Step3Form() {
  const form =
    useFormContext<
      Pick<
        WizardValues,
        | 'propertyType'
        | 'propertyOwnership'
        | 'propertySwaping'
        | 'propertyRentalTypes'
        | 'propertySurrounding'
        | 'propertyEnvironment'
      >
    >();
  const { systemTheme } = useTheme();

  const watchedType = useWatch({
    name: 'propertyType',
    control: form.control,
    compute: (val) => {
      if (val?.length > 0) return val;
      return undefined;
    },
  });

  const watchedOwnership = useWatch({
    name: 'propertyOwnership',
    control: form.control,
    compute: (val) => {
      if (val?.length > 0) return val;
      return undefined;
    },
  });

  const watchedSwaping = useWatch({
    name: 'propertySwaping',
    control: form.control,
    compute: (val) => {
      if (val?.length > 0) return val;
      return undefined;
    },
  });

  const watchedRental = useWatch({
    name: 'propertyRentalTypes',
    control: form.control,
    compute: (val) => {
      if (val?.length > 0) return val;
      return undefined;
    },
  });

  const watchedSurrounding = useWatch({
    name: 'propertySurrounding',
    control: form.control,
    compute: (val) => {
      if (val?.length > 0) return val;
      return undefined;
    },
  });

  const watchedEnvironment = useWatch({
    name: 'propertyEnvironment',
    control: form.control,
    compute: (val) => {
      if (val?.length > 0) return val;
      return undefined;
    },
  });
  return (
    <>
      <Controller
        name='propertyType'
        control={form.control}
        render={({ field, fieldState }) => (
          <Field
            className='gap-1'
            data-invalid={fieldState.invalid}
            aria-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              <span>Property type</span>
              <small className='italic font-normal text-muted-foreground'>
                (Select the type of property)
              </small>
            </FieldLabel>
            <Select
              name={field.name}
              value={field.name}
              onValueChange={field.onChange}>
              <SelectTrigger className='w-full'>
                {watchedType ? (
                  <span className={'capitalize'}>{watchedType}</span>
                ) : (
                  <SelectValue placeholder='Select a property type' />
                )}
              </SelectTrigger>

              <SelectContent position='popper'>
                {propertyTypes.map((type) => (
                  <SelectGroup key={type.id}>
                    <SelectLabel>
                      <Badge
                        variant={
                          systemTheme === 'dark' ? 'secondary' : 'default'
                        }>
                        {type.categoryName}
                      </Badge>
                    </SelectLabel>
                    <Separator />
                    {type.categoryTypes.map((propertyType) => (
                      <SelectItem
                        key={propertyType.id}
                        value={propertyType.name.toLowerCase()}>
                        <span>
                          <propertyType.icon className='mr-2 h-4 w-4' />
                        </span>
                        {propertyType.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name='propertyOwnership'
        control={form.control}
        render={({ field, fieldState }) => (
          <Field
            className='gap-1'
            data-invalid={fieldState.invalid}
            aria-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              <span>Ownership type</span>
              <small className='italic font-normal text-muted-foreground'>
                (Select the ownership type)
              </small>
            </FieldLabel>
            <Select
              name={field.name}
              value={field.value}
              onValueChange={field.onChange}>
              <SelectTrigger
                className='w-full'
                id={field.name}
                aria-invalid={fieldState.invalid}>
                {watchedOwnership ? (
                  <span className={'capitalize'}>{watchedOwnership}</span>
                ) : (
                  <SelectValue placeholder='Select a ownership type' />
                )}
              </SelectTrigger>

              <SelectContent position='popper'>
                {propertyOwnerships.map((ownership) => (
                  <SelectGroup key={ownership.id}>
                    <SelectLabel>
                      <Badge
                        variant={
                          systemTheme === 'dark' ? 'secondary' : 'default'
                        }>
                        {ownership.categoryName}
                      </Badge>
                    </SelectLabel>
                    <Separator className={'my-1'} />
                    {ownership.categoryTypes.map((type) => (
                      <SelectItem key={type.id} value={type.name.toLowerCase()}>
                        <span>
                          <type.icon className='mr-2 h-4 w-4' />
                        </span>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name='propertySwaping'
        control={form.control}
        render={({ field, fieldState }) => (
          <Field
            className='gap-1'
            data-invalid={fieldState.invalid}
            aria-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              <span>Swapping type</span>
              <small className='italic font-normal text-muted-foreground'>
                (Select the swapping type)
              </small>
            </FieldLabel>

            <Select
              name={field.name}
              value={field.value}
              onValueChange={field.onChange}>
              <SelectTrigger
                className='w-full'
                id={field.name}
                aria-invalid={fieldState.invalid}>
                {watchedSwaping ? (
                  <span className={'capitalize'}>{watchedSwaping}</span>
                ) : (
                  <SelectValue placeholder='Select a property type' />
                )}
              </SelectTrigger>
              <SelectContent position='popper'>
                {propertySwapings.map((swap) => (
                  <SelectGroup key={swap.id}>
                    <SelectLabel>
                      <Badge
                        variant={
                          systemTheme === 'dark' ? 'secondary' : 'default'
                        }>
                        {swap.categoryName}
                      </Badge>
                    </SelectLabel>
                    <Separator />
                    {swap.categoryTypes.map((swapping) => (
                      <SelectItem
                        key={swapping.id}
                        value={swapping.name.toLowerCase()}>
                        <span>
                          <swapping.icon className='mr-2 h-4 w-4' />
                        </span>
                        {swapping.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
            {/* <FieldDescription>
                    Tell us more about yourself. This will be used to help us
                    personalize your experience.
                  </FieldDescription> */}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name={'propertyRentalTypes'}
        control={form.control}
        render={({ field, fieldState }) => (
          <Field
            className='gap-1'
            data-invalid={fieldState.invalid}
            aria-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              <span>Rent period</span>
              <small className='italic font-normal text-muted-foreground'>
                (Select the rental type)
              </small>
            </FieldLabel>

            <Select
              name={field.name}
              value={field.value}
              onValueChange={field.onChange}>
              <SelectTrigger
                className='w-full'
                id={field.value}
                aria-invalid={fieldState.invalid}>
                {watchedRental ? (
                  <span className={'capitalize'}>{watchedRental}</span>
                ) : (
                  <SelectValue placeholder='Select a property type' />
                )}
              </SelectTrigger>

              <SelectContent position='popper'>
                {propertyRentalPeriods.map((period) => {
                  return (
                    <Fragment key={period.id}>
                      {period.categoryTypes.map((rentalType) => (
                        <SelectGroup key={rentalType.id}>
                          <Separator />
                          <SelectLabel>
                            <Badge
                              variant={
                                systemTheme === 'dark' ? 'secondary' : 'default'
                              }>
                              {rentalType.name}
                            </Badge>
                          </SelectLabel>
                          <Separator />
                          {rentalType.rentType.map((type) => (
                            <SelectItem
                              key={type.id}
                              value={type.name.toLowerCase()}>
                              <span className={'text-sm font-medium block'}>
                                {type.name}
                              </span>
                              <span className={'block text-xs font-normal'}>
                                ({type.description})
                              </span>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ))}
                    </Fragment>
                  );
                })}
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name='propertySurrounding'
        control={form.control}
        render={({ field, fieldState }) => (
          <Field
            className='gap-1'
            data-invalid={fieldState.invalid}
            aria-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              <span>Surrounding type</span>
              <small className='italic font-normal text-muted-foreground'>
                (Select the surrounding type)
              </small>
            </FieldLabel>
            <Select
              name={field.name}
              value={field.name}
              onValueChange={field.onChange}>
              <SelectTrigger
                className='w-full'
                id={field.name}
                aria-invalid={fieldState.invalid}>
                {watchedSurrounding ? (
                  <span className={'capitalize'}>{watchedSurrounding}</span>
                ) : (
                  <SelectValue placeholder='Select a surrounding type' />
                )}
              </SelectTrigger>

              <SelectContent position='popper'>
                {propertySurroundings.map((surrounding) => (
                  <SelectGroup key={surrounding.id}>
                    <SelectLabel>
                      <Badge
                        variant={
                          systemTheme === 'dark' ? 'secondary' : 'default'
                        }>
                        {surrounding.categoryName}
                      </Badge>
                    </SelectLabel>
                    <Separator />

                    {surrounding.categoryTypes.map((surroundingType) => (
                      <SelectItem
                        key={surroundingType.id}
                        value={surroundingType.name.toLowerCase()}>
                        <span>
                          <surroundingType.icon className='mr-2 h-4 w-4' />
                        </span>
                        {surroundingType.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name='propertyEnvironment'
        control={form.control}
        render={({ field, fieldState }) => (
          <Field
            className='gap-1'
            data-invalid={fieldState.invalid}
            aria-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              <span>Environment type</span>
              <small className='italic font-normal text-muted-foreground'>
                (Select the environment type)
              </small>
            </FieldLabel>

            <Select
              name={field.name}
              value={field.value}
              onValueChange={field.onChange}>
              <SelectTrigger
                className='w-full'
                id={field.name}
                aria-invalid={fieldState.invalid}>
                {watchedEnvironment ? (
                  <span className={'capitalize'}>{watchedEnvironment}</span>
                ) : (
                  <SelectValue placeholder='Select a environment type' />
                )}
              </SelectTrigger>

              <SelectContent position='popper'>
                {propertyEnvironments.map((environment) => (
                  <SelectGroup key={environment.id}>
                    <SelectLabel>
                      <Badge
                        variant={
                          systemTheme === 'dark' ? 'secondary' : 'default'
                        }>
                        {environment.categoryName}
                      </Badge>
                    </SelectLabel>
                    <Separator />

                    {environment.categoryTypes.map((environmentType) => (
                      <SelectItem
                        key={environmentType.id}
                        value={environmentType.name.toLowerCase()}>
                        <span>
                          <environmentType.icon className='mr-2 h-4 w-4' />
                        </span>
                        {environmentType.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </>
  );
}
