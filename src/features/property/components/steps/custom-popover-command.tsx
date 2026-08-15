'use client';

import { ChevronsUpDownIcon } from 'lucide-react';
import { useState } from 'react';
import { Controller, ControllerProps } from 'react-hook-form';

import { Button } from '@/components/ui/button';
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
import { Field, FieldLabel } from '@/components/ui/field';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { PropertyType } from '@/constants/property-assets';
import { cn } from '@/lib/utils';
import type { WizardValues } from '@/lib/validators/property-schemas';

type CustomPopoverCommmandItem =
  | 'propertyAmenities'
  | 'propertyAccessibilities'
  | 'propertyRules';

type CustomPopoverCommandProps = {
  items: PropertyType[];
  itemsLength?: string[];
  label?: string;
  name: CustomPopoverCommmandItem;
  control: ControllerProps<
    Pick<WizardValues, CustomPopoverCommmandItem>,
    CustomPopoverCommmandItem
  >['control'];
  isInvalid: boolean;
};

export default function CustomPopoverCommand(props: CustomPopoverCommandProps) {
  const [searchItem, setSearchItem] = useState('');

  return (
    <Popover>
      <PopoverTrigger
        asChild
        name={props.name}
        id={props.name}
        aria-invalid={props.isInvalid}>
        <Button
          id={props.name}
          variant='outline'
          className={cn(
            'w-full justify-between font-normal text-ellipsis overflow-hidden',
          )}>
          {props.itemsLength?.length ? (
            <span className={'capitalize text-xs sm:text-sm line-clamp-1'}>
              {props.itemsLength.length} selected
            </span>
          ) : (
            <>
              <span>Select {props.label ?? 'items'}</span>
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
            placeholder={`Search ${props.label ?? 'items'}...`}
            value={searchItem}
            onValueChange={(value) => setSearchItem(value)}
          />
          <CommandList className={'w-full px-2'}>
            <CommandEmpty>No results found.</CommandEmpty>
            {props.items.map((item) => (
              <CommandGroup key={item.id} heading={item.categoryName}>
                <Separator decorative />
                {item.categoryTypes.map((type) => (
                  <Controller
                    key={type.id}
                    control={props.control}
                    name={props.name}
                    render={({ field }) => {
                      return (
                        <CommandItem asChild>
                          <Field
                            orientation={'horizontal'}
                            // className='flex flex-row items-start space-x-2 space-y-1 py-2'
                            className='py-1'>
                            <Checkbox
                              id={`${props.label ?? 'items'}-${item.id}`}
                              checked={field.value?.includes(
                                type.name.toLocaleLowerCase(),
                              )}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...field.value,
                                      type.name.toLocaleLowerCase(),
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) =>
                                          value !==
                                          type.name.toLocaleLowerCase(),
                                      ),
                                    );
                              }}
                            />
                            <FieldLabel
                              htmlFor={`${props.label ?? 'items'}-${item.id}`}
                              className='text-sm font-normal'
                              data-invalid={props.isInvalid}
                              aria-invalid={props.isInvalid}>
                              {item.categoryName}
                              {<type.icon />}
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
  );
}

/*
usage:

<CustomPopoverComboBox
  items={propertyAmenities}
  isInvalid={fieldState.invalid}
  itemsLength={watchedAmenities?.length}
  label={'amenities'}
  name={field.name}
  control={form.control as any}
/>

*/
