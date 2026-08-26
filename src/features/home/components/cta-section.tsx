import { ArrowRightLeftIcon, ChevronRightCircleIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import SectionBadge from '@/components/shared/section-badge';
import SectionHeading from '@/components/shared/section-heading';
import SectionHeadingGroup from '@/components/shared/section-heading-group';
import SectionWrapper from '@/components/shared/section-wrapper';

import { buttonVariants } from '@/components/ui/button';
import GeometryLeftPNG from '../../../../public/home/Geometry-Left.png';
import GeometryLeftSVG from '../../../../public/home/Geometry-Left.svg';
import GeometryRightPNG from '../../../../public/home/Geometry-Right.png';
import GeometryRightSVG from '../../../../public/home/Geometry-Right.svg';
import GridGraphicPNG from '../../../../public/home/Grid.png';
import GridGraphicSVG from '../../../../public/home/Grid.svg';

export default function CTASection() {
  return (
    <section className={'bg-foreground dark:bg-background relative'}>
      <div className={'absolute left-0 top-0 hidden lg:block'}>
        <div className={'w-full h-full'}>
          <Image
            src={GeometryLeftSVG}
            alt='Geometry Left'
            className='w-full h-full object-cover'
            width={181}
            height={256}
            placeholder='blur'
            blurDataURL={GeometryLeftPNG.blurDataURL}
          />
        </div>
      </div>
      <div className={'absolute right-0 top-0 hidden lg:block'}>
        <div className={'w-full h-full'}>
          <Image
            src={GeometryRightSVG}
            alt='Geometry Right'
            className='w-full h-full object-cover'
            width={181}
            height={256}
            placeholder='blur'
            blurDataURL={GeometryRightPNG.blurDataURL}
          />
        </div>
      </div>
      <SectionWrapper>
        <div className='content-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 grid py-16 md:py-20 lg:py-24 xl:py-28 text-center'>
          <SectionBadge className='flex justify-center items-center gap-2 bg-background dark:bg-foreground mx-auto w-fit text-foreground dark:text-background'>
            Smarter Way to Exchange Houses
            <ArrowRightLeftIcon className='stroke-primary' />
          </SectionBadge>

          <SectionHeadingGroup className={'space-y-2 lg:space-y-4 z-10'}>
            <SectionHeading className='text-background dark:text-foreground'>
              <span className={'block'}>
                Be Part of the Rotatekey Global Network
              </span>
            </SectionHeading>

            <p className='mx-auto w-8/12 text-muted-foreground text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-center'>
              Rotatekey brings together a growing community of users who believe
              in smarter property usage and flexible living. Our platform gives
              members access to a wide network of properties for exchange,
              rental, and stays, supported by technology-driven security and
              convenience. Join Rotatekey and experience the future of property
              transactions.
            </p>
          </SectionHeadingGroup>

          <div className='justify-self-center'>
            <Link
              href='/sign-up'
              className={buttonVariants({ variant: 'default', size: 'lg' })}>
              Get Started - It&apos;s Free{' '}
              <ChevronRightCircleIcon className='size-4' />
            </Link>
          </div>
        </div>
      </SectionWrapper>

      <div className={'absolute right-0 bottom-0 hidden lg:block'}>
        <div className={'w-full h-full'}>
          <Image
            src={GridGraphicSVG}
            alt='Grid Graphic'
            className='w-full h-full object-cover'
            width={181}
            height={256}
            placeholder='blur'
            blurDataURL={GridGraphicPNG.blurDataURL}
          />
        </div>
      </div>
    </section>
  );
}
