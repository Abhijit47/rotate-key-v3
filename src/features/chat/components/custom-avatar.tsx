import { Avatar, type ChannelAvatarProps } from 'stream-chat-react';

export default function CustomAvatar({
  imageUrl,
  userName,
  size,
  className,
  ...rest
}: ChannelAvatarProps) {
  return (
    <Avatar
      {...rest}
      imageUrl={imageUrl}
      size={size || '2xl'}
      userName={userName}
      className={className ?? 'rounded-full! w-full! h-full!'}
    />
  );
}
