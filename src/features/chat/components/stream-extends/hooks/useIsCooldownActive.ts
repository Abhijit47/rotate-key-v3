import type { CooldownTimerState } from 'stream-chat';
import { useChannelStateContext, useStateStore } from 'stream-chat-react';

const cooldownTimerStateSelector = (state: CooldownTimerState) => ({
  isCooldownActive: !!state.cooldownRemaining,
});

export const useIsCooldownActive = () => {
  const { channel } = useChannelStateContext();
  return useStateStore(channel.cooldownTimer.state, cooldownTimerStateSelector)
    .isCooldownActive;
};
