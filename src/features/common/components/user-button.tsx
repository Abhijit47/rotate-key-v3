'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  // DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  // DropdownMenuSub,
  // DropdownMenuSubContent,
  // DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { signOut, useSession } from '@/lib/auth-client';
import Link from 'next/link';
import NotificationInbox from './notification-inbox';

export default function UserButton() {
  const { data, isPending, isRefetching } = useSession();

  return (
    <>
      {isPending ? (
        <li>
          <Skeleton className='size-8 rounded-md' />
        </li>
      ) : isRefetching ? (
        <li>
          <Skeleton className='size-8 rounded-md' />
        </li>
      ) : !data ? (
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
            <NotificationInbox userId={data.user.id} />
          </li>
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={'ghost'}
                  size={'icon-sm'}
                  className={'rounded-full h-full'}
                  aria-label={`${data.user.name} account menu`}>
                  <Avatar className={'size-8'}>
                    <AvatarImage
                      src={data.user.image ?? undefined}
                      alt={data.user.name ?? 'User avatar'}
                    />
                    <AvatarFallback>
                      {data.user.name
                        .split(' ')
                        .map((part) => part[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase() ?? 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='min-w-60 w-full' align='end'>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    <Badge variant='outline' className='capitalize'>
                      {data.user.role}
                    </Badge>
                  </DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link href={'#'} className='w-full'>
                      Profile
                      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={'#'} className='w-full'>
                      Billing
                      <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={'#'} className='w-full'>
                      Settings
                      <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href={'/property/new'} className='w-full'>
                      Create Property
                      <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={'/swapings'} className='w-full' prefetch>
                      Swapings
                      <DropdownMenuShortcut>⌘W</DropdownMenuShortcut>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={'#'} className='w-full'>
                      Favourite Properties
                      <DropdownMenuShortcut>⌘F</DropdownMenuShortcut>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={'#'} className='w-full'>
                      My Properties
                      <DropdownMenuShortcut>⌘M</DropdownMenuShortcut>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Team</DropdownMenuItem>
                  {/* <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      Invite users
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem>Email</DropdownMenuItem>
                        <DropdownMenuItem>Message</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>More...</DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub> */}
                  {/* <DropdownMenuItem>
                    New Team
                    <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                  </DropdownMenuItem> */}
                </DropdownMenuGroup>
                {/* <DropdownMenuSeparator /> */}
                {/* <DropdownMenuGroup>
                  <DropdownMenuItem>GitHub</DropdownMenuItem>
                  <DropdownMenuItem>Support</DropdownMenuItem>
                  <DropdownMenuItem disabled>API</DropdownMenuItem>
                </DropdownMenuGroup> */}
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    variant='destructive'
                    onSelect={() => signOut()}>
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        </>
      )}
    </>
  );
}
