'use client';

import locales from '@/i18n/locales';
import { changeLocaleAction } from '@/lib/actions';
import { Globe2Icon } from 'lucide-react';
import { Locale, useLocale } from 'next-intl';
import { useTransition } from 'react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export default function LocaleToggler() {
  const [isPending, startTransition] = useTransition();

  const locale = useLocale();

  function onSelectChange(nextLocale: Locale) {
    startTransition(async () => {
      await changeLocaleAction(nextLocale);
    });
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline'>
          <Globe2Icon className={'size-4'} />
          <span className={'sr-only'}>Select a locale</span>
          <span className='ml-1 text-muted-foreground uppercase'>{locale}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-fit'>
        <DropdownMenuLabel>Select a locale</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={(value) => {
            onSelectChange(value as Locale);
          }}>
          {locales.map((cur) => (
            <DropdownMenuRadioItem
              key={cur}
              value={cur}
              className={'uppercase'}
              disabled={isPending}>
              {cur}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
