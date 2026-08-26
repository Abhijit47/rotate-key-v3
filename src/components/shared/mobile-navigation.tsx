import { MenuIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

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
import LogoBrand from './logo-brand';

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className='lg:hidden flex flex-wrap gap-2'>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant='outline' size={'icon'} className={'rounded-full'}>
            <MenuIcon />
          </Button>
        </SheetTrigger>
        <SheetContent
          side={'right'}
          className='data-[state=open]:slide-in-from-right-20 data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh] data-[state=open]:duration-600 data-[state=open]:zoom-in-100!'>
          <SheetHeader>
            <Link href='/' className='block' onClick={() => setIsOpen(false)}>
              <LogoBrand className='w-full h-12' />
            </Link>
            <SheetTitle className={'sr-only'}>Menu</SheetTitle>
            <SheetDescription className={'sr-only'}>
              Mobile navigation menu
            </SheetDescription>
          </SheetHeader>
          <div className='px-4 overflow-y-auto no-scrollbar'>
            <ul className={'flex flex-col items-start gap-2'}>
              {navlinks.map((link) => (
                <li key={link.name} className={'w-full'}>
                  <Link
                    href={link.href}
                    className={buttonVariants({
                      variant: pathname === link.href ? 'default' : 'ghost',
                      className: 'w-full! justify-start!',
                    })}
                    onClick={() => setIsOpen(false)}>
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
