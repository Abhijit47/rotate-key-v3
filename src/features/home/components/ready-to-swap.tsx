import { ChevronRightCircle } from 'lucide-react';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

import ReadySwapGraphicPNG from '../../../../public/home/ready-swap-bg-graphic.png';
import ReadySwapGraphicSVG from '../../../../public/home/ready-swap-bg-graphic.svg';
import ReadySwappingPNG from '../../../../public/home/ready_to_swap_demo_docs.png';
import ReadySwappingSVG from '../../../../public/home/ready_to_swap_demo_docs.svg';

import SectionBadge from '@/components/shared/section-badge';
import SectionDescription from '@/components/shared/section-description';
import SectionHeading from '@/components/shared/section-heading';
import SectionHeadingGroup from '@/components/shared/section-heading-group';
import SectionWrapper from '@/components/shared/section-wrapper';
import { Button } from '@/components/ui/button';

export default function ReadyToSwap() {
  const locale = useLocale();
  return (
    <section
      className={
        'bg-black dark:bg-background py-8 md:py-10 lg:py-12 xl:py-16 relative'
      }>
      <SectionWrapper className={''}>
        <div className='gap-4 grid grid-cols-1 md:grid-cols-2'>
          <div className=''>
            <Image
              src={ReadySwappingSVG}
              alt='readytoswap'
              className='w-full h-full'
              width={635}
              height={851}
              placeholder='blur'
              blurDataURL={ReadySwappingPNG.blurDataURL}
            />
          </div>

          <div className='inline-grid content-center gap-y-8 py-8 sm:py-12 md:py-16 lg:py-0 w-full h-full z-10'>
            <SectionBadge align='left'>
              The smart way to Exchange Houses
            </SectionBadge>

            <SectionHeadingGroup
              className={'space-y-4 lg:space-y-6 xl:space-y-8'}>
              <SectionHeading align='left' className={'text-primary'}>
                <span className={'block'}>
                  Ready to Swap Homes and Create Memories ?
                </span>
              </SectionHeading>

              <SectionDescription className={'text-muted-foreground'}>
                Become part of a community that values trust, diversity, and
                unforgettable experiences. Find your perfect match with detailed
                profiles and customizable search filters.
              </SectionDescription>
            </SectionHeadingGroup>

            <div className={'justify-self-center'}>
              <Button asChild>
                <Link
                  href={'/swapings'}
                  // locale={locale}
                  // className='inline-flex justify-self-center items-center gap-2 bg-primary-500 px-4 py-3 rounded text-tertiary-50 text-sm'
                >
                  <span>I want to Exchange My Home</span>
                  <span>
                    <ChevronRightCircle className='size-4' />
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className={'absolute right-0 bottom-0 hidden lg:block'}>
          <div className={''}>
            <Image
              src={ReadySwapGraphicSVG}
              alt='readytoswap'
              className='w-full h-full object-contain'
              width={356}
              height={731}
              // fill
              // sizes='(min-width: 1024px) 356px, (min-width: 640px) 356px, 100vw'
              placeholder='blur'
              blurDataURL={ReadySwapGraphicPNG.blurDataURL}
            />
          </div>
        </div>
      </SectionWrapper>
    </section>
  );
}
