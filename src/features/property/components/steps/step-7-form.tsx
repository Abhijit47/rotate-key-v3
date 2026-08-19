import { ChevronsUpDownIcon } from 'lucide-react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { WizardValues } from '@/lib/validators/property-schemas';

import { propertyAccessibilities } from '@/constants/property-assets';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { AccessibilitiesLateral } from '@/constants/property-assets-types';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function Step7Form() {
  const [searchItem, setSearchItem] = useState('');
  const form = useFormContext<Pick<WizardValues, 'propertyAccessibilities'>>();

  const watchedAccessibilities = useWatch({
    name: 'propertyAccessibilities',
    control: form.control,
    compute: (val) => {
      if (val.length > 0) return val;
      return [];
    },
  });

  return (
    <div className={'grid grid-cols-1 md:grid-cols-2 gap-4'}>
      <Controller
        name='propertyAccessibilities'
        control={form.control}
        render={({ field, fieldState }) => (
          <Field
            className='gap-1'
            data-invalid={fieldState.invalid}
            aria-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              <span>Accessibilities</span>
              <small className='italic font-normal text-muted-foreground'>
                (Select some accessibilities.)
              </small>
            </FieldLabel>
            <Popover>
              <PopoverTrigger
                asChild
                name={field.name}
                id={field.name}
                aria-invalid={fieldState.invalid}>
                <Button
                  id={field.name}
                  variant='outline'
                  className={cn(
                    'w-full justify-between font-normal text-ellipsis overflow-hidden',
                  )}>
                  {watchedAccessibilities?.length ? (
                    <span
                      className={'capitalize text-xs sm:text-sm line-clamp-1'}>
                      {watchedAccessibilities.length} selected
                    </span>
                  ) : (
                    <>
                      <span>Select accessibilities</span>
                      <span>
                        <ChevronsUpDownIcon className='ml-auto h-4 w-4 opacity-50' />
                      </span>
                    </>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-full p-0' align='start'>
                <Command
                  shouldFilter={true}
                  filter={(value, search, keywords) => {
                    const extendValue =
                      value.toLocaleLowerCase() + ' ' + keywords?.join(' ');
                    if (extendValue.includes(search)) return 1;
                    return 0;
                  }}
                  loop={true}
                  className='rounded-lg border shadow-md min-w-auto sm:min-w-md md:min-w-lg'>
                  <CommandInput
                    placeholder='Search accessibilities...'
                    value={searchItem}
                    onValueChange={(value) => setSearchItem(value)}
                  />

                  <CommandList className={'w-full px-2'}>
                    <CommandEmpty>No accessibilities found.</CommandEmpty>
                    {propertyAccessibilities.map((accessibility) => (
                      <CommandGroup
                        key={accessibility.categoryName}
                        heading={accessibility.categoryName}>
                        <Separator decorative />
                        {accessibility.categoryTypes.map((item) => (
                          <Controller
                            key={item.id}
                            control={form.control}
                            name='propertyAccessibilities'
                            render={({ field }) => {
                              return (
                                <CommandItem asChild>
                                  <Field
                                    orientation={'horizontal'}
                                    className='py-1'>
                                    <Checkbox
                                      id={`accessibility-${item.id}`}
                                      checked={field.value?.includes(
                                        item.name.toLocaleLowerCase() as AccessibilitiesLateral,
                                      )}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              item.name.toLocaleLowerCase(),
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) =>
                                                  value !==
                                                  item.name.toLocaleLowerCase(),
                                              ),
                                            );
                                      }}
                                    />
                                    <FieldLabel
                                      htmlFor={`accessibility-${item.id}`}
                                      className='text-sm font-normal'
                                      data-invalid={fieldState.invalid}
                                      aria-invalid={fieldState.invalid}>
                                      {item.name}
                                    </FieldLabel>
                                  </Field>
                                </CommandItem>
                              );
                            }}
                          />
                        ))}
                      </CommandGroup>
                    ))}
                    <CommandSeparator />
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Card>
        <CardHeader>
          <CardTitle>
            <span className='text-sm font-normal text-muted-foreground'>
              Select the accessibilities that are available in your property.
              This will help guests with specific needs to find your property
              more easily.
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {watchedAccessibilities.length > 0 ? (
            <div className='flex flex-wrap gap-2'>
              {watchedAccessibilities.map((accessibilitiy) => (
                <span
                  key={accessibilitiy}
                  className='bg-accent/50 text-accent-foreground px-2 py-1 rounded-md text-xs font-medium'>
                  {accessibilitiy}
                </span>
              ))}
            </div>
          ) : (
            <span className='text-sm font-normal text-muted-foreground'>
              No accessibilities selected.
            </span>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
