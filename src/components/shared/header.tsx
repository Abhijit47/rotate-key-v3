'use client';

import Link from 'next/link';

import { LazyUserButton } from '@/features/common/components/lazy-common';
import { useOnboardModal } from '@/features/common/hooks/use-onboard-modal';

import LocaleToggler from '@/features/common/components/locale-toggler';
import ThemeToggler from '@/features/common/components/theme-toggler';
import { buttonVariants } from '../ui/button';

import { navlinks } from '@/constants';
import MobileNavigation from './mobile-navigation';

export default function Header() {
  const { modal } = useOnboardModal();

  return (
    <header
      className={
        'py-4 px-4 w-full bg-accent border-b border-accent-foreground/10 dark:bg-accent/50 dark:border-accent-foreground/20 sticky top-0 z-50 backdrop-blur-lg'
      }>
      {modal}
      <nav className={'flex items-center justify-between'}>
        <div>LOGO</div>
        <ul className={'hidden lg:flex items-center gap-2'}>
          {navlinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                prefetch={link.href.startsWith('/swapings') ? true : undefined}
                className={buttonVariants({ variant: 'ghost' })}>
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <ul className={'hidden lg:flex items-center gap-2'}>
          <li>
            <ThemeToggler />
          </li>
          <li>
            <LocaleToggler />
          </li>
          <LazyUserButton />
        </ul>

        <MobileNavigation />
      </nav>
    </header>
  );
}
