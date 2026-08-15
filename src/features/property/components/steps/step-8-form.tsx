import { ChevronsUpDownIcon } from 'lucide-react';
import { useState } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { propertyRules } from '@/constants/property-assets';
import { type WizardValues } from '@/lib/validators/property-schemas';

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
import { cn } from '@/lib/utils';

export default function Step8Form() {
  const [searchItem, setSearchItem] = useState('');
  const form = useFormContext<Pick<WizardValues, 'propertyRules'>>();

  const watchedRules = useWatch({
    name: 'propertyRules',
    control: form.control,
    compute: (val) => {
      if (val.length > 0) return val;
      return [];
    },
  });

  return (
    <div className={'grid grid-cols-1 md:grid-cols-2 gap-4'}>
      <Controller
        name='propertyRules'
        control={form.control}
        render={({ field, fieldState }) => (
          <Field
            className='gap-1'
            data-invalid={fieldState.invalid}
            aria-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              <span>Rules & Regulations</span>
              <small className='italic font-normal text-muted-foreground'>
                (Select some rules.)
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
                  {watchedRules?.length ? (
                    <span
                      className={'capitalize text-xs sm:text-sm line-clamp-1'}>
                      {watchedRules.length} selected
                    </span>
                  ) : (
                    <>
                      <span>Select Rules</span>
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
                    placeholder='Search rules...'
                    value={searchItem}
                    onValueChange={(value) => setSearchItem(value)}
                  />
                  <CommandList className={'w-full px-2'}>
                    <CommandEmpty>No rules found.</CommandEmpty>
                    {propertyRules.map((rule) => (
                      <CommandGroup key={rule.id} heading={rule.categoryName}>
                        <Separator decorative />
                        {rule.categoryTypes.map((item) => (
                          <Controller
                            key={item.id}
                            control={form.control}
                            name='propertyRules'
                            render={({ field }) => {
                              return (
                                <CommandItem asChild>
                                  <Field
                                    orientation={'horizontal'}
                                    className='py-1'>
                                    <Checkbox
                                      id={`rule-${item.id}`}
                                      checked={field.value?.includes(
                                        item.name.toLocaleLowerCase(),
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
                                      htmlFor={`rule-${item.id}`}
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
              Select the rules that apply to your property. These rules will be
              displayed to potential tenants and will help them understand the
              expectations for living in your property.
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {watchedRules.length > 0 ? (
            <div className='flex flex-wrap gap-2'>
              {watchedRules.map((rules) => (
                <span
                  key={rules}
                  className='bg-accent/50 text-accent-foreground px-2 py-1 rounded-md text-xs font-medium'>
                  {rules}
                </span>
              ))}
            </div>
          ) : (
            <span className='text-sm font-normal text-muted-foreground'>
              No rules selected.
            </span>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
