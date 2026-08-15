'use client';

import { Combobox as ComboboxPrimitive } from '@base-ui/react';
import { useEffect, useState } from 'react';

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from '@/components/ui/combobox';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

export const CustomComboboxInput = ({
  className,
  children,
  disabled = false,
  showTrigger = true,
  flag,
  isInvalid = false,
  ...props
}: ComboboxPrimitive.Input.Props & {
  showTrigger?: boolean;
  flag?: string;
  isInvalid?: boolean;
}) => {
  return (
    <InputGroup className={cn('w-auto', className)}>
      {flag && (
        <InputGroupAddon>
          <img src={flag} alt='Country flag' className='w-5 h-4' />
        </InputGroupAddon>
      )}
      <ComboboxPrimitive.Input
        render={
          <InputGroupInput
            disabled={disabled}
            aria-invalid={isInvalid}
            id={props.id}
          />
        }
        {...props}
      />
      <InputGroupAddon align='inline-end'>
        {showTrigger && (
          <InputGroupButton
            size='icon-xs'
            variant='ghost'
            asChild
            data-slot='input-group-button'
            className='data-pressed:bg-transparent'
            disabled={disabled}>
            <ComboboxTrigger id={props.id} />
          </InputGroupButton>
        )}
      </InputGroupAddon>
      {children}
    </InputGroup>
  );
};

type ValueProps = { id: number; name: string; flag?: string; iso2?: string };

export type CustomComboboxProps<T> = {
  items: T[];
  value: ValueProps;
  onValueChange: (v: ValueProps) => void;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  isInvalid?: boolean;
};

export const CustomCombobox = <T extends ValueProps>(
  props: CustomComboboxProps<T>,
) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filteredItems, setFilteredItems] = useState(props.items);

  const debouncedSearch = useDebounce(inputValue, 150);

  // Sync value from props to state when the selected value changes
  useEffect(() => {
    setInputValue(props.value.name);
  }, [props.value.name]);

  useEffect(() => {
    if (debouncedSearch.trim() === '' || debouncedSearch === props.value.name) {
      setFilteredItems(props.items);
      setIsLoading(false);
    } else {
      const searchTerm = debouncedSearch.toLowerCase();

      const filtered = props.items.filter((state) =>
        state.name.toLowerCase().includes(searchTerm),
      );

      setFilteredItems(filtered);
      setIsLoading(false);
    }
  }, [debouncedSearch, props.items, props.value.name]);

  return (
    <Combobox
      items={filteredItems}
      value={props.value.name}
      onValueChange={(e) => {
        const selectedItem = filteredItems.find((item) => item.name === e);
        if (!selectedItem) return;
        const newValue: ValueProps = {
          id: Number(selectedItem.id),
          name: selectedItem.name,
          flag: selectedItem.flag,
          iso2: selectedItem.iso2,
        };
        props.onValueChange(newValue);
      }}
      inputValue={debouncedSearch}
      onInputValueChange={(val) => {
        setInputValue(val);
      }}
      disabled={props.disabled || isLoading}>
      <CustomComboboxInput
        id={props.label || 'items'}
        placeholder={props.placeholder ?? 'Select items'}
        flag={inputValue === props.value.name ? props.value.flag : undefined}
        isInvalid={props.isInvalid}
      />
      <ComboboxContent>
        <ComboboxEmpty>No {props.label || 'items'} found.</ComboboxEmpty>
        <ComboboxList>
          {(item: T) => {
            return (
              <ComboboxItem
                key={item.id}
                value={item.name}
                className='flex items-center gap-2'>
                {item.flag ? (
                  <img
                    src={item.flag}
                    alt={`${item.name} flag`}
                    className='w-5 h-4'
                  />
                ) : null}
                <span className='flex flex-col'>
                  <span className='font-medium'>{item.name}</span>
                </span>
              </ComboboxItem>
            );
          }}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};
