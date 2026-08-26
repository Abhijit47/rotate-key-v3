import { ArrowRight } from 'lucide-react';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

import LikedBG from '../../../../public/home/r-architecture-2gDwlIim3Uw-unsplash.jpg';

import SectionDescription from '@/components/shared/section-description';
import SectionHeading from '@/components/shared/section-heading';
import SectionHeadingGroup from '@/components/shared/section-heading-group';
import SectionWrapper from '@/components/shared/section-wrapper';

export default function LikedProperty() {
  const locale = useLocale();

  return (
    <section className={'my-16 md:my-20 lg:my-24'}>
      <SectionWrapper className={'flex items-center'}>
        <div className='inline-flex relative w-full md:overflow-hidden'>
          <div className='hidden lg:block w-full h-full lg:[clip-path:polygon(0%_0%,25%_0%,80%_100%,0%_100%)]'>
            <Image
              // src='https://images.unsplash.com/photo-1605146769289-440113cc3d00?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
              src={LikedBG}
              alt='liked property background'
              className='rounded-2xl w-full h-full object-cover'
              width={4500}
              height={3000}
              placeholder='blur'
              blurDataURL={LikedBG.blurDataURL}
            />
          </div>
          <div className='lg:absolute lg:inset-0 bg-linear-to-l from-primary/90 dark:from-primary/60 to-primary/50 dark:to-primary/70 py-16 lg:py-0 rounded-2xl w-full h-full lg:[clip-path:polygon(27%_0%,100%_0%,100%_100%,82%_100%)]'>
            <div
              className={
                'flex w-full justify-end items-center p-2 md:p-4 lg:p-6 xl:p-8'
              }>
              <div className={'lg:w-6/12'}>
                <SectionHeadingGroup
                  className={'space-y-4 lg:space-y-6 xl:space-y-8'}>
                  <SectionHeading
                    align='left'
                    className={
                      'text-accent dark:text-accent-foreground hidden lg:block'
                    }>
                    <span className={'block'}>
                      Ready to Swap Homes and Create Memories ?
                    </span>
                  </SectionHeading>
                  <SectionHeading
                    align='center'
                    className={
                      'text-accent dark:text-accent-foreground lg:hidden block'
                    }>
                    <span className={'block'}>
                      Ready to Swap Homes and Create Memories ?
                    </span>
                  </SectionHeading>

                  <SectionDescription
                    align='right'
                    className={
                      'text-accent dark:text-accent-foreground hidden lg:block font-body'
                    }>
                    <span>Become part of a community that values trust, </span>
                    <span>diversity, and unforgettable experiences. Find </span>
                    <span>your perfect match with detailed profiles and </span>
                    <span>customizable search filters.</span>
                  </SectionDescription>
                  <SectionDescription
                    align='center'
                    className={
                      'text-accent dark:text-accent-foreground lg:hidden block font-body'
                    }>
                    <span>Become part of a community that values trust, </span>
                    <span>diversity, and unforgettable experiences. Find </span>
                    <span>your perfect match with detailed profiles and </span>
                    <span>customizable search filters.</span>
                  </SectionDescription>
                </SectionHeadingGroup>
              </div>
            </div>

            <div
              className={
                'flex w-full justify-center lg:justify-end items-center p-2 md:p-4 lg:p-6 xl:p-8'
              }>
              <div className={'lg:w-3/12'}>
                <Link
                  href='/swapings'
                  // locale={locale}
                  className={
                    'text-accent dark:text-accent-foreground text-center ring-1 ring-accent dark:ring-accent-foreground px-6 lg:px-8 py-2 rounded-lg flex items-center justify-center space-x-2 text-xs md:text-sm lg:text-base xl:text-lg shadow-lg hover:shadow-sm transition-all duration-300'
                  }>
                  <span>Visit this property now</span>
                  <span>
                    <ArrowRight className={'size-4 md:size-6'} />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </section>
  );
}
