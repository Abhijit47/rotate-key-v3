import clsx from 'clsx';
import { type ComponentProps } from 'react';
import type { AttachmentLoadingState } from 'stream-chat';
import {
  Button,
  IconXmarkSmall,
  useTranslationContext,
} from 'stream-chat-react';

export const RemoveAttachmentPreviewButton = ({
  className,
  uploadState,
  ...props
}: ComponentProps<'button'> & {
  uploadState?: AttachmentLoadingState;
}) => {
  const { t } = useTranslationContext();
  return (
    <Button
      aria-label={t('aria/Remove attachment')}
      circular
      className={clsx('str-chat__attachment-preview__remove-button', className)}
      data-testid='preview-item-delete-button'
      disabled={uploadState === 'uploading'}
      {...props}>
      <IconXmarkSmall />
    </Button>
  );
};
