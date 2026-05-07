import { Avatar, type ChannelAvatarProps } from 'stream-chat-react';

export default function CustomAvatar({
  imageUrl,
  userName,
}: ChannelAvatarProps) {
  return (
    <Avatar
      imageUrl={imageUrl}
      size='lg'
      userName={userName}
      className={'rounded-full!'}
    />
  );
}
