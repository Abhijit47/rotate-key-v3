import {
  AttachmentPreviewList,
  AttachmentSelector,
  type AttachmentSelectorAction,
  type AttachmentSelectorActionProps,
  type AttachmentSelectorModalContentProps,
  CooldownTimer,
  defaultAttachmentSelectorActionSet,
  LinkPreviewList,
  QuotedMessagePreview,
  SendButton,
  SimpleAttachmentSelector,
  TextareaComposer,
  useCooldownRemaining,
  useMessageComposerContext,
} from 'stream-chat-react';

import { VoiceRecordingPreviewSlot } from './stream-extends/VoiceRecordingPreviewSlot';

/* CUSTOM UI */
export const AddEventAction = ({
  // closeMenu,
  openModalForAction,
}: AttachmentSelectorActionProps) => (
  <button
    onClick={() => {
      openModalForAction('addEvent');
      // closeMenu();
    }}>
    Event
  </button>
);
export const AddEventModalContent = ({
  close,
}: AttachmentSelectorModalContentProps) => (
  <div>
    <button onClick={close}>Done</button>
  </div>
);
export const attachmentSelectorActionSet: AttachmentSelectorAction[] = [
  {
    ActionButton: AddEventAction,
    ModalContent: AddEventModalContent,
    id: 'event',
    type: 'addEvent',
  },
  ...defaultAttachmentSelectorActionSet,
];
export const CustomAttachmentSelector = () => (
  <AttachmentSelector
    attachmentSelectorActionSet={attachmentSelectorActionSet}
  />
);

export function SendButtonWithCooldown() {
  const cooldownRemaining = useCooldownRemaining();
  const { handleSubmit } = useMessageComposerContext();
  return cooldownRemaining ? (
    <CooldownTimer />
  ) : (
    <SendButton sendMessage={handleSubmit} />
  );
}

export function CustomMessageComposer() {
  return (
    <div className='message-input flex items-center justify-between max-w-5xl w-full mx-auto px-4 py-2'>
      <div className='left-container'>
        <SimpleAttachmentSelector />
      </div>
      <div className='central-container'>
        <QuotedMessagePreview />
        <VoiceRecordingPreviewSlot />
        <AttachmentPreviewList />
        <LinkPreviewList />
        <TextareaComposer />
      </div>
      <div className='right-container'>
        {/* <MessageComposerActions /> */}
        <SendButtonWithCooldown />
      </div>
    </div>
  );
}
/* END CUSTOM UI */
