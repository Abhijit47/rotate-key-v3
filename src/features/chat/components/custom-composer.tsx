import { KeyboardEvent } from 'react';
import {
  AttachmentPreviewList,
  AttachmentSelector,
  LinkPreviewList,
  MessageComposer,
  QuotedMessagePreview,
  TextareaComposer,
  WithComponents,
  WithDragAndDropUpload,
} from 'stream-chat-react';
import { MessageComposerActions } from './stream-extends/MessageComposerActions';
import { SendToChannelCheckbox } from './stream-extends/SendToChannelCheckbox';
import { VoiceRecordingPreviewSlot } from './stream-extends/VoiceRecordingPreviewSlot';

const CustomInput = () => {
  // here i need to check if the user is on free tier and disable the input and show a message about the limit

  return (
    <WithDragAndDropUpload
      className='str-chat__message-composer-container'
      component='div'>
      <div className='str-chat__message-composer'>
        <AttachmentSelector />
        <div className='str-chat__message-composer-compose-area'>
          <div className='str-chat__message-composer-previews'>
            <QuotedMessagePreview />
            <VoiceRecordingPreviewSlot />
            <AttachmentPreviewList />
            <LinkPreviewList />
          </div>
          <div className='str-chat__message-composer-controls'>
            <TextareaComposer />
            <SendToChannelCheckbox />
            <MessageComposerActions />
          </div>
        </div>
      </div>
    </WithDragAndDropUpload>
  );
};

const Composer = () => {
  // const overrideSubmitHandler2: MessageComposerProps['overrideSubmitHandler'] =
  //   async ({ cid, localMessage, message, sendOptions }) => {
  //     try {
  //       const res = await checkLimit();
  //       if (res.isMessageLimitReached) {
  //         handleError(
  //           'You have reached the free tier message limit. Please upgrade to continue chatting.',
  //         );
  //         return; // void — cancels send
  //       }

  //       if (!messageComposer?.channel) {
  //         // throw new Error('No channel available to send message');
  //         toast.error(
  //           'No channel available to send message. Please try again later.',
  //         );
  //         return;
  //       }

  //       // send the composed message via the channel
  //       await messageComposer.channel.sendMessage(message, sendOptions);

  //       // clear composer state (match library's default flow)
  //       messageComposer.clear();
  //     } catch (err) {
  //       console.error('Error in overrideSubmitHandler:', err);
  //       if (err instanceof TRPCClientError) {
  //         handleError(err);
  //       } else {
  //         toast.error('Failed to send message. Please try again.');
  //         return;
  //       }
  //     }
  //   };

  const defaultShouldSubmit = (event: KeyboardEvent) =>
    event.key === 'Enter' && !event.shiftKey;

  return (
    <>
      <WithComponents overrides={{ MessageComposerUI: CustomInput }}>
        <MessageComposer
          audioRecordingEnabled={true}
          // emojiSearchIndex={SearchIndex}
          focus={true}
          shouldSubmit={defaultShouldSubmit}
          hideSendButton={false}
          // overrideSubmitHandler={overrideSubmitHandler}
        />
      </WithComponents>
    </>
  );
};
