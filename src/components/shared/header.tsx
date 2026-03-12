'use client';

import UserButton from '@/features/common/components/user-button';
import { useOnboardModal } from '@/features/common/hooks/use-onboard-modal';
import { useSession } from '@/lib/auth-client';
import Link from 'next/link';
import { LazyNotificationButton } from '../lazy-components';
import { buttonVariants } from '../ui/button';
import LocaleToggler from './locale-toggler';
import ThemeToggler from './theme-toggler';

export default function Header() {
  const { data } = useSession();
  const { modal } = useOnboardModal();
  
  return (
    <header
      className={
        'py-4 px-4 w-full bg-accent border-b border-accent-foreground/10 dark:bg-accent/50 dark:border-accent-foreground/20 sticky top-0 z-50 backdrop-blur-lg'
      }>
      {modal}
      <nav className={'flex items-center justify-between'}>
        <div>LOGO</div>
        <ul className={'flex items-center gap-2'} >
          <li>
            <Link href={'/'} className={buttonVariants({ variant: 'ghost' })}>
              Home
            </Link>
          </li>
          <li>
            <Link href={'#'} className={buttonVariants({ variant: 'ghost' })}>
              About
            </Link>
          </li>
          <li>
            <Link href={'#'} className={buttonVariants({ variant: 'ghost' })}>
              How it works
            </Link>
          </li>
          <li>
            <Link href={'#'} className={buttonVariants({ variant: 'ghost' })}>
              Rooms
            </Link>
          </li>
          <li>
            <Link href={'#'} className={buttonVariants({ variant: 'ghost' })}>
              Billings
            </Link>
          </li>
          <li>
            <Link href={'#'} className={buttonVariants({ variant: 'ghost' })}>
              Contact
            </Link>
          </li>
        </ul>

        <ul className={'flex items-center gap-2'}>
          <li>
            <ThemeToggler />
          </li>
          <li>
            <LocaleToggler />
          </li>

          {/* user session required */}
          {!data ? (
            <>
              <li>
                <Link
                  href={'/login'}
                  className={buttonVariants({
                    variant: 'outline',
                    className: 'rounded-full!',
                  })}>
                  Continue to Login
                </Link>
              </li>
              <li>
                <Link
                  href={'/sign-up'}
                  className={buttonVariants({
                    className: 'rounded-full!',
                  })}>
                  Get Started
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <LazyNotificationButton />
              </li>

              <li>
                <UserButton />
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
