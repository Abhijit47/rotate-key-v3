import { ArrowRightIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import SectionWrapper from '@/components/shared/section-wrapper';
import HOWITWORKSCTABG from '../../../../public/how-it-works/how-it-works-cta.jpg';

export default function WorksCTA() {
  return (
    <section className={'pb-8 md:pb-12 lg:pb-16 xl:pb-20'}>
      <SectionWrapper>
        <div className=''>
          <div className='relative grid grid-cols-2 rounded-xl w-full h-96 sm:aspect-video md:aspect-video overflow-hidden'>
            <div className='w-full h-full'>
              <Image
                src={HOWITWORKSCTABG}
                alt='how-it-works-image'
                width={3288}
                height={2192}
                // fill
                // sizes='(max-width: 768px) 100vw, 768px'
                className={
                  // 'w-full h-full object-cover object-center absolute inset-0 brightness-40'
                  'z-0 w-full h-full object-cover object-center absolute inset-0 brightness-40'
                }
                placeholder='blur'
                blurDataURL={HOWITWORKSCTABG.blurDataURL}
              />
              {/* <div
                className={
                  "bg-linear-to-b from-primary/80 via-primary/40 to-secondary/80 absolute inset-0 h-full w-full opacity-65"
                }
              ></div> */}
            </div>
            {/* <div className='-z-10 absolute inset-0 bg-linear-to-t from-emerald-600 via-primary-500 to-emerald-600 w-full h-full aspect-square [clip-path:polygon(70%_0%,100%_0%,100%_100%,50%_100%)]'>
              &nbsp;
            </div> */}
            <div className='z-1 absolute inset-0 bg-linear-to-t from-emerald-600 via-primary-500 to-emerald-600 w-full h-full aspect-square [clip-path:polygon(70%_0%,100%_0%,100%_100%,50%_100%)]'></div>

            <div className='z-10 absolute content-center place-items-center gap-2 lg:gap-4 grid grid-cols-3 w-full h-full text-center'>
              <div className={'col-span-3 lg:col-span-1'}>
                <div className={'aspect-52/9 sm:aspect-48/9 lg:aspect-30/9'}>
                  <Image
                    src={'/logos/logo-landscape-2.webp'}
                    alt='logo'
                    width={300}
                    height={80}
                    className={'w-full h-full object-cover'}
                  />
                </div>
                <p
                  className={
                    'font-mono text-xl sm:text-2xl md:text-3xl lg:text-4xl text-right font-normal sm:font-medium md:font-semibold lg:font-bold text-primary dark:text-primary-foreground mr-2'
                  }>
                  money efficient
                </p>
              </div>
              <p className='z-10 col-span-3 lg:col-span-1 p-2 lg:p-4 px-4 lg:px-0 font-semibold text-white text-xs sm:text-sm lg:text-sm md:text-base'>
                Introducing Turn Keys Cost Escapes, where we offers numerous
                benefits, including cost saving, cultural immersion, and
                flexibility. It enables individuals to experience a new way of
                living while saving on accommodation costs.
              </p>

              <div className='col-span-3 lg:col-span-1'>
                <Link
                  prefetch
                  href={'/swapings'}
                  className='group font-semibold text-accent text-sm md:text-base lg:text-lg'>
                  <span className={'block'}>Discover</span>
                  <span className={'inline-flex items-center gap-2'}>
                    <span className={'italic block font-mono'}>
                      Money Efficient
                    </span>
                    <span>
                      <ArrowRightIcon
                        className={
                          'size-4 md:size-6 group-hover:-ml-2 transition-all delay-300 ease-in-out'
                        }
                      />
                    </span>
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
