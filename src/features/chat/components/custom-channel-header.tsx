import MobileNavigation from '@/components/shared/mobile-navigation';
import { buttonVariants } from '@/components/ui/button';
import { LazyUserButton } from '@/features/common/components/lazy-common';
import ThemeToggler from '@/features/common/components/theme-toggler';
import { ArrowLeftCircle } from 'lucide-react';
import Link from 'next/link';
import {
  // Avatar,
  useChannelPreviewInfo,
  useChannelStateContext,
  useChatContext,
} from 'stream-chat-react';
import { Avatar } from './avatar';

const DotIcon = () => {
  return (
    <svg
      className={'fill-green-500 size-2.5'}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 512 512'
      fill='currentColor'>
      <path d='M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z' />
    </svg>
  );
};

export default function CustomChannelHeader() {
  const { channel, watcher_count } = useChannelStateContext('ChannelHeader');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { openMobileNav } = useChatContext('ChannelHeader');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { displayImage, displayTitle, groupChannelDisplayInfo } =
    useChannelPreviewInfo({
      channel,
      // overrideImage,
      // overrideTitle,
    });
  // const { t } = useTranslationContext('ChannelHeader');

  // eslint-disable-next-line
  // @ts-ignore
  const { member_count, subtitle } = channel?.data || {};

  const live = true;

  return (
    <div className='str-chat__channel-header'>
      {/* <Button
        variant={'ghost'}
        size={'icon'}
        // aria-label={t('aria/Menu')}
        // className='str-chat__header-hamburger'
        onClick={openMobileNav}>
        <MenuIcon />
      </Button> */}

      <div className='hidden md:block'>
        <Link
          href={'/chat'}
          className={buttonVariants({
            variant: 'ghost',
            size: 'icon',
          })}>
          <ArrowLeftCircle className={''} />
        </Link>
      </div>

      <div className='flex items-center md:hidden'>
        <MobileNavigation />
      </div>
      <Avatar
        className='str-chat__avatar--channel-header'
        // groupChannelDisplayInfo={groupChannelDisplayInfo}
        image={displayImage}
        name={displayTitle}
      />
      <div className='str-chat__channel-header-end'>
        <p className='str-chat__channel-header-title flex items-center gap-1'>
          {displayTitle}{' '}
          {live && (
            <span className='str-chat__header-livestream-livelabel'>
              {/* {t('live')} */}
              <DotIcon />
            </span>
          )}
        </p>
        {subtitle && (
          <p className='str-chat__channel-header-subtitle'>{subtitle}</p>
        )}
        <p className='str-chat__channel-header-info'>
          {!live && !!member_count && member_count > 0 && (
            <>
              {/* {t('{{ memberCount }} members', {
                memberCount: member_count,
              })} */}
              , {member_count} members
            </>
          )}
          {/* {t('{{ watcherCount }} online', { watcherCount: watcher_count })} */}
          {watcher_count} online
        </p>
      </div>

      <div className={'flex items-center gap-2'}>
        <ThemeToggler />
        <LazyUserButton />
      </div>
    </div>
  );
}
