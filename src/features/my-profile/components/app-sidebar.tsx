'use client';

import {
  Icon,
  IconChessKing,
  IconDashboard,
  IconHome2,
  IconLockAccessOff,
  IconMessage,
  IconShare,
} from '@tabler/icons-react';
import * as React from 'react';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Route } from 'next';
import { NavMain } from './nav-main';
import NavPropertyHold from './nav-property-hold';
import NavRecentlyLiked from './nav-recently-liked';
import { NavUser } from './nav-user';

type ProfileLink = {
  navMain: {
    title: string;
    url: Route | `/#${string}`;
    icon: Icon;
  }[];
};

const profileLinks: ProfileLink = {
  navMain: [
    {
      title: 'Home',
      url: '/',
      icon: IconHome2,
    },
    {
      title: 'Personal Info',
      url: '/my-profile',
      icon: IconDashboard,
    },
    {
      title: 'Confidential Info',
      url: '/my-profile/confidential-info',
      icon: IconLockAccessOff,
    },
    {
      title: 'Social & Network',
      url: '/my-profile/social-and-network',
      icon: IconShare,
    },
    {
      title: 'Chat',
      url: '#',
      icon: IconMessage,
    },
  ],
  // navClouds: [
  //   {
  //     title: 'Capture',
  //     icon: IconCamera,
  //     isActive: true,
  //     url: '#',
  //     items: [
  //       {
  //         title: 'Active Proposals',
  //         url: '#',
  //       },
  //       {
  //         title: 'Archived',
  //         url: '#',
  //       },
  //     ],
  //   },
  //   {
  //     title: 'Proposal',
  //     icon: IconFileDescription,
  //     url: '#',
  //     items: [
  //       {
  //         title: 'Active Proposals',
  //         url: '#',
  //       },
  //       {
  //         title: 'Archived',
  //         url: '#',
  //       },
  //     ],
  //   },
  //   {
  //     title: 'Prompts',
  //     icon: IconFileAi,
  //     url: '#',
  //     items: [
  //       {
  //         title: 'Active Proposals',
  //         url: '#',
  //       },
  //       {
  //         title: 'Archived',
  //         url: '#',
  //       },
  //     ],
  //   },
  // ],
  // navSecondary: [
  //   {
  //     title: 'Settings',
  //     url: '#',
  //     icon: IconSettings,
  //   },
  //   {
  //     title: 'Get Help',
  //     url: '#',
  //     icon: IconHelp,
  //   },
  //   {
  //     title: 'Search',
  //     url: '#',
  //     icon: IconSearch,
  //   },
  // ],
  // documents: [
  //   {
  //     name: 'Data Library',
  //     url: '#',
  //     icon: IconDatabase,
  //   },
  //   {
  //     name: 'Reports',
  //     url: '#',
  //     icon: IconReport,
  //   },
  //   {
  //     name: 'Word Assistant',
  //     url: '#',
  //     icon: IconFileWord,
  //   },
  // ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  };

  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <AspectRatio ratio={3.5 / 1.3} className='w-24 mx-auto'>
              <SidebarMenuButton className='data-[slot=sidebar-menu-button]:p-1.5! h-full w-full rounded-full border! border-card! relative!'>
                <Avatar className={'w-full h-full rounded-full'}>
                  <AvatarImage
                    src='https://github.com/shadcn.png'
                    className={'w-full h-full rounded-full '}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <IconChessKing
                  className={
                    'size-6! absolute bottom-1 right-4 text-yellow-400'
                  }
                />
              </SidebarMenuButton>
            </AspectRatio>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={profileLinks.navMain} />

        <Separator />

        <NavRecentlyLiked />
        <Separator />
        <NavPropertyHold />

        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className='mt-auto' /> */}
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
