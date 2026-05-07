import { useEffect } from 'react';
import type { Event as StreamEvent } from 'stream-chat';
import {
  ChannelListUI,
  type ChannelListUIProps,
  getChannel,
  useChannelListContext,
  useChatContext,
} from 'stream-chat-react';

import { useChatSessionStorage } from '../hooks/useChatSessionStorage';
import { DEFAULT_CHANNEL_ID, DEFAULT_CHANNEL_TYPE } from './chat-interface';

export default function CustomChannelListUI(props: ChannelListUIProps) {
  // const { channelId } = useParams<{ channelId: string }>();
  // const router = useRouter();

  const [storedValue, setValue] = useChatSessionStorage('chat-session', {
    channelId: DEFAULT_CHANNEL_ID,
  });

  const channelId = storedValue.channelId;

  const { client, channel, setActiveChannel } = useChatContext();
  const { setChannels } = useChannelListContext();

  useEffect(() => {
    // if (!channelId) return router.push(`/chats/${DEFAULT_CHANNEL_ID}`);
    if (!channelId) return setValue({ channelId: DEFAULT_CHANNEL_ID });
    if (channel?.id === channelId || !client) return;
    let subscription: { unsubscribe: () => void } | undefined;
    if (channel?.id) {
      // router.push(`/chats/${channel.id}`);
      setValue({ channelId: channel.id });
    }
    // BUG: 768px or below this channel is undefined on mount, so in sidebar mobile or medium not showing channel list "undefined"
    console.log('Channel data on ChannelListUI mount:', channel?.id);
    if (!channel?.id || channel?.id !== channelId) {
      subscription = client.on('channels.queried', (event: StreamEvent) => {
        const loadedChannelData = event.queriedChannels?.channels.find(
          (response) => response.channel.id === channelId,
        );
        console.log(
          'Channel found in channels.queried event:',
          loadedChannelData?.channel,
        );
        if (loadedChannelData?.channel.id !== 'general') {
          setActiveChannel(client.channel(DEFAULT_CHANNEL_TYPE, channelId));
          subscription?.unsubscribe();
          return;
        }
        return getChannel({
          client,
          id: channelId,
          type: DEFAULT_CHANNEL_TYPE,
        }).then((newActiveChannel) => {
          setActiveChannel(newActiveChannel);
          setChannels((channels) => {
            return [
              newActiveChannel,
              ...channels.filter(
                (ch) => ch.data?.cid !== newActiveChannel.data?.cid,
              ),
            ];
          });
        });
      });
    }
    return () => {
      subscription?.unsubscribe();
    };
    // }, [channel?.id, channelId, setChannels, client, setActiveChannel, router]);
  }, [channel?.id, channelId, setChannels, client, setActiveChannel, setValue]);
  return <ChannelListUI {...props} />;
}
