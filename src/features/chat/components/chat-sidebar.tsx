import { IconInnerShadowTop } from '@tabler/icons-react';
import Link from 'next/link';
import { ChannelList, WithComponents } from 'stream-chat-react';

import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCustomChatContext } from '@/contexts/chat-context';

import CustomChannelListUI from './custom-channel-list-ui';

export default function ChatSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { filters, sort, options } = useCustomChatContext();

  return (
    <Sidebar collapsible='offcanvas' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className='data-[slot=sidebar-menu-button]:p-1.5!'>
              <Link prefetch href='/my-profile'>
                <IconInnerShadowTop className='size-5!' />
                <span className='text-base font-semibold'>Rotate key Inc.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator className={'my-1'} />
      <SidebarContent>
        <WithComponents overrides={{ ChannelListUI: CustomChannelListUI }}>
          <ChannelList
            showChannelSearch={true}
            filters={filters}
            sort={sort}
            options={options}
            setActiveChannelOnMount={false}
          />
        </WithComponents>
      </SidebarContent>
    </Sidebar>
  );
}
