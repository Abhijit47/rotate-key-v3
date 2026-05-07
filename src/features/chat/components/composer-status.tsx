import {
  useAttachmentManagerState,
  useCooldownRemaining,
  useMessageComposerHasSendableData,
} from 'stream-chat-react';

export default function ComposerStatus() {
  const { pendingUploadsCount } = useAttachmentManagerState();
  const canSend = useMessageComposerHasSendableData();
  const cooldownRemaining = useCooldownRemaining();

  return (
    <div className={'flex flex-col gap-1'}>
      <span className='text-xs'>Pending uploads: {pendingUploadsCount}</span>
      <span className='text-xs'>Can send: {String(canSend)}</span>
      <span className='text-xs'>Cooldown: {cooldownRemaining}</span>
    </div>
  );
}
