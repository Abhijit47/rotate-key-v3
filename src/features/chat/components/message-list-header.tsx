import { Button } from '@/components/ui/button';
import { useCustomChatContext } from '@/contexts/chat-context';
import { useChatContext } from 'stream-chat-react';

export default function MessageListHeader() {
  const { client, channel } = useChatContext();

  const { onOpenDocumentDialog, user } = useCustomChatContext();

  const hasDocumentMessageFromCurrentUser = channel?.state.messages.some(
    (msg) => {
      const sentByCurrentUser = msg?.user?.id === client.userID;
      const hasDocumentAttachment = msg.attachments?.some(
        (att) => att.type === 'file' && !!att.asset_url,
      );

      return sentByCurrentUser && hasDocumentAttachment;
    },
  );

  const shouldEnable =
    user.isPropertyDocumentUploaded && hasDocumentMessageFromCurrentUser;

  return (
    <div
      className={
        'h-16 bg-primary/30 backdrop-blur-lg rounded-bl-xl rounded-br-xl w-full flex items-center justify-center gap-2 px-2'
      }>
      {/* TODO: Will implement later */}
      <Button size={'xs'} className={'text-sm!'} disabled={!shouldEnable}>
        Do Somthing
      </Button>
      <Button size={'xs'} className={'text-sm!'} disabled={!shouldEnable}>
        Do Somthing
      </Button>
    </div>
  );
}
