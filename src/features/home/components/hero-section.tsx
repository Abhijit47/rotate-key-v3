import Image from 'next/image';

import { LazyHeroSearch, LazyKeyWordTags } from './lazy';

import SectionDescription from '@/components/shared/section-description';
import SectionWrapper from '@/components/shared/section-wrapper';
import HeroBGPNG from '../../../../public/home/hero.png';
import HeroBGSVG from '../../../../public/home/hero.svg';
import HeroGraphic from '../../../../public/home/Waves.png';

export default function HeroSection() {
  return (
    <section className='bg-primary/25'>
      {/* <SectionContextWrapper> */}
      <div className={'absolute top-16 left-0 hidden xl:block'}>
        <figure className={'relative size-20 -rotate-12'}>
          <Image
            src={HeroGraphic}
            alt='hero-graphics'
            className='w-full h-full object-cover'
            // width={133}
            // height={268}
            fill
            sizes='(max-width: 640px) 100vw, 100vw'
            // placeholder='blur'
            // blurDataURL={HeroGraphic.blurDataURL}
          />
        </figure>
      </div>

      <SectionWrapper>
        <div className='gap-4 grid grid-cols-1 md:grid-cols-2'>
          <div className='inline-grid content-center gap-4 md:gap-6 lg:gap-8 py-8 sm:py-12 md:py-16 w-full h-full'>
            <h1 className='font-display font-semibold md:font-bold lg:font-extrabold text-4xl md:text-4xl lg:text-5xl xl:text-7xl'>
              Unlock the Door to Your Next Adventure with
              <span className='text-primary'> Rotate Keys</span>.
            </h1>
            <SectionDescription
              align='left'
              className={'dark:text-muted-foreground'}>
              Rotate Keys is not just a platform; it&apos;s a community of
              like-minded individuals sharing the joy of exploration and
              discovery. Your dream house swap is just a click away.
            </SectionDescription>
            {/* <PropertyFilter /> */}
            <LazyHeroSearch />
          </div>

          <div className='relative flex justify-end'>
            <Image
              src={HeroBGSVG}
              alt='hero'
              className='w-full h-full object-cover'
              width={914}
              height={867}
              priority
              placeholder='blur'
              blurDataURL={HeroBGPNG.blurDataURL}
            />

            <div
              className={
                'h-16 w-fit absolute bottom-16 right-10 xl:left-10 z-10'
              }>
              <LazyKeyWordTags />
            </div>
          </div>
        </div>
      </SectionWrapper>
      {/* </SectionContextWrapper> */}
    </section>
  );
}
