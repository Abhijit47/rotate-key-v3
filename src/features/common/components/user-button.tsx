'use client';

import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
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
import { Skeleton } from '@/components/ui/skeleton';
import { authClient, signOut, useSession } from '@/lib/auth-client';
import NotificationInbox from './notification-inbox';

const isDev = process.env.NODE_ENV === 'development';

export default function UserButton() {
  const { data, isPending, isRefetching } = useSession();

  return (
    <>
      {isPending ? (
        <li>
          <Skeleton className='rounded-md size-8' />
        </li>
      ) : isRefetching ? (
        <li>
          <Skeleton className='rounded-md size-8' />
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
            <NotificationInbox
              subscriberHash={data.user.notificationHash}
              userId={data.user.id}
            />
          </li>
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={'ghost'}
                  size={'icon-sm'}
                  className={'rounded-full h-full mt-1.5'}
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
              <DropdownMenuContent className='w-full min-w-60' align='end'>
                <DropdownMenuGroup>
                  <DropdownMenuLabel className='flex justify-between items-center'>
                    <Badge variant='outline' className='capitalize'>
                      {data.user.name}
                    </Badge>
                    <Badge variant='default' className='capitalize'>
                      {data.user.role}
                    </Badge>
                  </DropdownMenuLabel>
                  {isDev ? (
                    <DropdownMenuItem asChild>
                      <Link href={'/test-users'} className='w-full'>
                        Test Users
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                      </Link>
                    </DropdownMenuItem>
                  ) : null}
                  {data.user.role === 'admin' ? (
                    <DropdownMenuItem asChild>
                      <Link href={'/admin'} className='w-full'>
                        Admin
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                      </Link>
                    </DropdownMenuItem>
                  ) : null}

                  <DropdownMenuItem asChild>
                    <Link href={'/my-profile'} className='w-full'>
                      Profile
                      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => authClient.customer.portal()}>
                    Billing
                    <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem asChild>
                    <Link href={"#"} className="w-full">
                      Settings
                      <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </Link>
                  </DropdownMenuItem> */}
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
                      <DropdownMenuShortcut>⇧⌘S</DropdownMenuShortcut>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={'/favourite-properties'} className='w-full'>
                      Favourite Properties
                      <DropdownMenuShortcut>⌘F</DropdownMenuShortcut>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={'/my-properties'} className='w-full'>
                      My Properties
                      <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={'/my-exchanges'} className='w-full'>
                      My Exchanges
                      <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
                    </Link>
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem>Team</DropdownMenuItem> */}
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
