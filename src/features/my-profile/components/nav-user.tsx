'use client';

import { useRouter } from 'next/navigation';
import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from '@tabler/icons-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession, authClient } from '@/lib/auth-client';

export function NavUser() {
  const { customer } = authClient;
  const router = useRouter();
  const { data, isPending, isRefetching } = useSession();
  const { isMobile } = useSidebar();

  const userImage = data?.user ? `${data.user.image}` : `/api/avatar?name`;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {isPending || isRefetching ? (
          <div className='flex items-center justify-between h-10'>
            <div className='flex items-center gap-2'>
              <Skeleton className='size-8' />
              <div className='flex flex-col gap-2'>
                <Skeleton className='h-3 w-20' />
                <Skeleton className='h-2 w-24' />
              </div>
            </div>
            <Skeleton className='size-6' />
          </div>
        ) : !data ? (
          <div className='flex items-center justify-between h-10'>
            <div className='flex items-center gap-2'>
              <Skeleton className='size-8' />
              <div className='flex flex-col gap-2'>
                <Skeleton className='h-3 w-20' />
                <Skeleton className='h-2 w-24' />
              </div>
            </div>
            <Skeleton className='size-6' />
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size='lg'
                className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              >
                <Avatar className='h-8 w-8 rounded-lg grayscale'>
                  <AvatarImage src={userImage} alt={data.user.name} />
                  <AvatarFallback className='rounded-lg'>
                    {data.user.name}
                  </AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>{data.user.name}</span>
                  <span className='truncate text-xs text-muted-foreground'>
                    {data.user.email}
                  </span>
                </div>
                <IconDotsVertical className='ml-auto size-4' />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
              side={isMobile ? 'bottom' : 'right'}
              align='end'
              sideOffset={4}
            >
              <DropdownMenuLabel className='p-0 font-normal'>
                <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                  <Avatar className='h-8 w-8 rounded-lg'>
                    <AvatarImage src={userImage} alt={data.user.name} />
                    <AvatarFallback className='rounded-lg'>
                      {data.user.name}
                    </AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-medium'>
                      {data.user.name}
                    </span>
                    <span className='truncate text-xs text-muted-foreground'>
                      {data.user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => router.push('/my-profile')}>
                  <IconUserCircle />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    customer.portal();
                  }}
                >
                  <IconCreditCard />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/notifications')}>
                  <IconNotification />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant='destructive'>
                <IconLogout />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
