import type { ComponentProps } from 'react';
import { useTranslationContext } from 'stream-chat-react';

export type StopAIGenerationButtonProps = ComponentProps<'button'>;

export const StopAIGenerationButton = ({
  onClick,
  ...restProps
}: StopAIGenerationButtonProps) => {
  const { t } = useTranslationContext();
  return (
    <button
      aria-label={t('aria/Stop AI Generation')}
      className='str-chat__stop-ai-generation-button'
      data-testid='stop-ai-generation-button'
      onClick={onClick}
      {...restProps}
    />
  );
};
