import { Button } from '@/components/ui/button';

import { useCustomChatContext } from '@/contexts/chat-context';
import { PanelLeftIcon, PanelRightIcon } from 'lucide-react';
import { useChatSessionStorage } from '../hooks/useChatSessionStorage';

export default function SidebarToggle() {
  const { closeSidebar, openSidebar, sidebarOpen } = useCustomChatContext();

  const [storedValue] = useChatSessionStorage('chat-session', {
    channelId: 'general',
  });

  if (storedValue.channelId === 'general') {
    return null;
  }

  return (
    <Button
      aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      onClick={sidebarOpen ? closeSidebar : openSidebar}
      variant={'ghost'}
      size={'icon-xs'}>
      {sidebarOpen ? (
        <PanelRightIcon className={'size-4'} />
      ) : (
        <PanelLeftIcon className={'size-4'} />
      )}
    </Button>
  );
}
