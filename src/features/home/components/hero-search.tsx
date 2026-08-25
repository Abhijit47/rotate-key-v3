'use client';

import {
  ArrowDownIcon,
  ArrowUpIcon,
  SearchIcon,
  Undo2Icon,
} from 'lucide-react';
import Form from 'next/form';
import { useEffect, useState } from 'react';

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Kbd } from '@/components/ui/kbd';
import { propertyTypes } from '@/constants/property-assets';

export default function HeroSearch() {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.key === 'j' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);

    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <div>
      <Form action='/swapings'>
        <InputGroup className='ring-2 ring-primary'>
          <InputGroupInput
            placeholder='Search for your room type...'
            name='roomType'
            value={inputValue.toLowerCase()}
            readOnly
            className='cursor-pointer'
            onClick={() => setOpen(true)}
          />
          <InputGroupAddon>
            <SearchIcon className='text-muted-foreground' />
          </InputGroupAddon>
          <InputGroupAddon align='inline-end'>
            <InputGroupButton
              variant='default'
              type='submit'
              size='sm'
              disabled={inputValue.length < 1}>
              Search
              <Kbd className='ml-auto'>⌘J</Kbd>
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Form>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className='w-full max-w-lg!'>
        <Command>
          <CommandInput placeholder='Search for your room type...' />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {propertyTypes.map((grp, idx) => {
              const isLastGrpItem = idx !== propertyTypes.length - 1;

              return (
                <CommandGroup heading={grp.categoryName} key={grp.id}>
                  {/* loop through each cat-grp */}
                  {grp.categoryTypes.map((type, i) => {
                    return (
                      <CommandItem
                        key={type.id}
                        value={type.name}
                        onSelect={() => {
                          setInputValue(type.name);
                          setOpen(false);
                        }}>
                        <span>{<type.icon />}</span>
                        <span className='text-muted-foreground'>
                          {type.name}
                        </span>
                      </CommandItem>
                    );
                  })}
                  {/* show upto the last cat-grp before */}
                  {!!isLastGrpItem ? <CommandSeparator /> : null}
                </CommandGroup>
              );
            })}
          </CommandList>
          <CommandSeparator />

          {/* guides */}
          <div className='flex flex-wrap items-center gap-4 p-4 text-muted-foreground'>
            <div className='flex flex-1 items-center gap-2'>
              <kbd className='px-1 border rounded text-sm'>esc</kbd>
              <span>To close</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='flex justify-center items-center border rounded size-5'>
                <Undo2Icon className='size-4' />
              </div>
              <span>To Select</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='flex justify-center items-center border rounded size-5'>
                <ArrowUpIcon className='size-4' />
              </div>
              <div className='flex justify-center items-center border rounded size-5'>
                <ArrowDownIcon className='size-4' />
              </div>
              <span>To Navigate</span>
            </div>
          </div>
        </Command>
      </CommandDialog>
    </div>
  );
}
