'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LazyUserButton } from '@/features/common/components/lazy-common';
import { useOnboardModal } from '@/features/common/hooks/use-onboard-modal';

import LocaleToggler from '@/features/common/components/locale-toggler';
import ThemeToggler from '@/features/common/components/theme-toggler';

import { navlinks } from '@/constants';
import MobileNavigation from './mobile-navigation';

import { cn } from '@/lib/utils';
import LogoBrand from './logo-brand';

export default function Header() {
  const pathname = usePathname();
  const { modal } = useOnboardModal();

  // Regex to match /chat/[userId] paths
  const chatSlugRegex = /^\/chat\/[^/]+$/;

  if (pathname && chatSlugRegex.test(pathname)) {
    return null;
  }

  return (
    <header
      className={
        'py-2 px-4 w-full bg-background border-b border-accent-foreground/10 dark:bg-accent/50 dark:border-accent-foreground/20 sticky top-0 z-50 backdrop-blur-lg'
      }>
      {modal}
      <nav className={'flex items-center justify-between'}>
        <Link href='/' className='block'>
          <LogoBrand className='w-full h-12' />
        </Link>
        <ul className={'hidden lg:flex items-center gap-2'}>
          {navlinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <li key={link.name}>
                <Link
                  href={link.href}
                  prefetch={
                    link.href.startsWith('/swapings') ? true : undefined
                  }
                  className={cn(
                    'rounded-none font-medium text-sm',
                    isActive
                      ? 'text-primary underline underline-offset-4 decoration-dotted'
                      : 'text-muted-foreground hover:text-foreground',
                  )}>
                  {link.name}
                </Link>
              </li>
            );
          })}
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
