import { MenuIcon } from 'lucide-react';
import Link from 'next/link';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { navlinks } from '@/constants';
import { LazyUserButton } from '@/features/common/components/lazy-common';
import LocaleToggler from '@/features/common/components/locale-toggler';
import ThemeToggler from '@/features/common/components/theme-toggler';

export default function MobileNavigation() {
  return (
    <div className='flex lg:hidden flex-wrap gap-2'>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant='outline' size={'icon'} className={'rounded-full'}>
            <MenuIcon />
          </Button>
        </SheetTrigger>
        <SheetContent
          side={'right'}
          className='data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh] data-[state=open]:zoom-in-100! data-[state=open]:slide-in-from-right-20 data-[state=open]:duration-600'>
          <SheetHeader>
            <SheetTitle className={'sr-only'}>Menu</SheetTitle>
            <SheetDescription className={'sr-only'}>
              Mobile navigation menu
            </SheetDescription>
          </SheetHeader>
          <div className='no-scrollbar overflow-y-auto px-4'>
            <ul className={'flex flex-col items-start gap-2'}>
              {navlinks.map((link) => (
                <li key={link.name} className={'w-full'}>
                  <Link
                    href={link.href}
                    className={buttonVariants({
                      variant: 'ghost',
                      className: 'w-full! justify-start!',
                    })}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <SheetFooter>
            <ul className={'flex items-center gap-2'}>
              <li>
                <ThemeToggler />
              </li>
              <li>
                <LocaleToggler />
              </li>
              <LazyUserButton />
            </ul>
            {/* <Button type='submit'>Save changes</Button>
            <SheetClose asChild>
              <Button variant='outline'>Cancel</Button>
            </SheetClose> */}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
