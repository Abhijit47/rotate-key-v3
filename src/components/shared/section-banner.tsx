import { Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import BannerBG from '../../../public/how-it-works/banner.jpg';
import { buttonVariants } from '../ui/button';
import SectionWrapper from './section-wrapper';

// import SectionContextWrapper from "./section-context-wrapper";

export default function SectionBanner(props: SectionBannerProps) {
  const { description, buttonText, buttonLink, coverImage, children } = props;

  return (
    // <SectionContextWrapper className={"py-8"}>
    <SectionWrapper>
      <div
        className={
          'aspect-square sm:aspect-18/9 md:aspect-24/9 relative w-full h-full bg-primary/10 overflow-hidden rounded-2xl ring-2 ring-primary'
        }>
        <Image
          src={coverImage ? coverImage : BannerBG}
          fill
          sizes='(max-width: 768px) 100vw, 768px'
          alt='How it works banner'
          className={'object-cover w-full h-full opacity-40'}
          placeholder='blur'
          blurDataURL={
            coverImage ? coverImage.blurDataURL : BannerBG.blurDataURL
          }
          priority
        />

        <div
          className={
            'absolute w-full h-full grid place-items-center content-center gap-4 md:gap-6 lg:gap-8 px-8 text-center'
          }>
          <h1 className='font-secondary font-bold text-2xl xs:text-3xl md:text-4xl lg:text-5xl'>
            {children}
          </h1>
          {description ? (
            <p className={'text-tertiary-50 text-sm md:text-base lg:text-lg'}>
              {description}
            </p>
          ) : null}

          {buttonText && buttonLink ? (
            <Link
              href={buttonLink as Route}
              className={buttonVariants({ variant: 'default', size: 'lg' })}>
              {buttonText}
            </Link>
          ) : null}
        </div>
      </div>
    </SectionWrapper>
    // </SectionContextWrapper>
  );
}
