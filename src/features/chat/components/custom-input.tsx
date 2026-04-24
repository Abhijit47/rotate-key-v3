import { Button, buttonVariants } from '@/components/ui/button';
import {
  AttachmentPreviewList,
  CooldownTimer,
  LinkPreviewList,
  QuotedMessagePreview,
  SendButton,
  SimpleAttachmentSelector,
  TextareaComposer,
  useMessageInputContext,
} from 'stream-chat-react';

function SendButtonWithCooldown() {
  const { handleSubmit, cooldownRemaining, setCooldownRemaining } =
    useMessageInputContext();
  return cooldownRemaining ? (
    <CooldownTimer
      cooldownInterval={cooldownRemaining}
      setCooldownRemaining={setCooldownRemaining}
    />
  ) : (
    <Button asChild>
      <SendButton
        className={buttonVariants({ variant: 'default' })}
        sendMessage={handleSubmit}
      />
    </Button>
  );
}

export default function CustomInput() {
  // consume `MessageInputContext` and render custom component here
  return (
    <div className='message-input'>
      <div className={'left-container'}>
        <SimpleAttachmentSelector />
      </div>
      <div className={'central-container'}>
        <QuotedMessagePreview />
        <LinkPreviewList />
        <AttachmentPreviewList />
        <TextareaComposer />
      </div>
      <div className={'right-container'}>
        <SendButtonWithCooldown />
      </div>
    </div>
  );
}
