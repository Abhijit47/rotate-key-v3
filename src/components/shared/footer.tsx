'use client';

import {
  ArrowRightIcon,
  ChevronsDownIcon,
  MailsIcon,
  MapPinnedIcon,
  PhoneCallIcon,
} from 'lucide-react';
import { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { footerLinks } from '@/constants';
import { prettifyText } from '@/lib/helpers/property-helpers';
import { buttonVariants } from '../ui/button';
import { Separator } from '../ui/separator';
import LogoBrand from './logo-brand';
import SectionWrapper from './section-wrapper';

export default function Footer() {
  const pathname = usePathname();

  const chatSlugRegex = /^\/chat\/[^/]+$/;
  // http://localhost:3000/property/new
  const propertyNewRegex = /^\/property\/new$/;

  const profileSlugRegex = /^\/profile(\/.*)?$/;

  if (pathname && chatSlugRegex.test(pathname)) {
    return null;
  }

  if (pathname && propertyNewRegex.test(pathname)) {
    return null;
  }

  // http://localhost:3000/property/fe1fb455-65b8-46bf-8df3-929540628ec1/update
  const propertyUpdateRegex = /^\/property\/[^/]+\/update$/;
  if (pathname && propertyUpdateRegex.test(pathname)) {
    return null;
  }

  if (pathname && profileSlugRegex.test(pathname)) {
    return null;
  }

  // return (
  //   <footer>
  //     <div
  //       className={
  //         "py-4 px-4 w-full bg-accent border-t border-accent-foreground/10 dark:bg-accent/50 dark:border-accent-foreground/20 text-center"
  //       }
  //     >
  //       <p className={"text-sm text-muted-foreground"}>
  //         &copy; {new Date().getFullYear()} Your Company. All rights reserved.
  //       </p>
  //     </div>
  //   </footer>
  // );

  return (
    <footer className='bg-foreground dark:bg-background mt-auto py-20'>
      <SectionWrapper>
        <div className={'space-y-6 md:space-y-8 lg:space-y-10 xl:space-y-12'}>
          <div className='gap-4 grid'>
            <div className='justify-self-start col-span-full'>
              <Link href='/'>
                <LogoBrand className='fill-white stroke-white w-full h-20' />
              </Link>

              {/* <Separator /> */}
              {/* <div className='border-secondary-200 border-b' /> */}
            </div>

            <div className='gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 col-span-full'>
              <div className='space-y-4 text-muted dark:text-muted-foreground text-sm'>
                <div className={'flex items-center gap-2'}>
                  <span className={'block self-start'}>
                    <MapPinnedIcon className={'size-4 md:size-6'} />
                  </span>
                  <div>
                    <h5 className={'test-xs sm:text-sm md:text-base'}>
                      Bengaluru (HQ)
                    </h5>
                    <p className={'test-xs sm:text-sm'}>
                      #12 Second Floor 3rd Cross
                      <br />
                      Patel Narayana Reddy Layout
                      <br />
                      6th Block Koramangala <br />
                      Bengaluru -560095
                    </p>
                  </div>
                </div>

                <div
                  className={
                    'flex items-center gap-2 group transition-all delay-300 ease-in-out'
                  }>
                  <span
                    className={'block self-start group-hover:text-primary-500'}>
                    <PhoneCallIcon className={'size-4 md:size-6'} />
                  </span>
                  <Link
                    href={`tel:+91 12345-67890`}
                    target='_blank'
                    className={buttonVariants({
                      variant: 'link',
                      className:
                        'p-0! text-muted-foreground! hover:text-primary! h-fit rounded-none',
                    })}>
                    +91 12345-67890
                  </Link>
                </div>

                <div
                  className={
                    'flex items-center gap-2 group transition-all delay-300 ease-in-out'
                  }>
                  <span
                    className={'block self-start group-hover:text-primary-500'}>
                    <MailsIcon className={'size-4 md:size-6'} />
                  </span>
                  <Link
                    href={`mailto:rotatekey@gmail.com`}
                    target='_blank'
                    className={buttonVariants({
                      variant: 'link',
                      className:
                        'p-0! text-muted-foreground! hover:text-primary! h-fit rounded-none',
                    })}>
                    rotatekey@gmail.com
                  </Link>
                </div>

                <Link
                  href='#'
                  className={buttonVariants({
                    variant: 'link',
                    className:
                      'p-0! text-muted-foreground! hover:text-primary! h-fit rounded-none',
                  })}>
                  <span>See Details</span>
                  <span>
                    <ArrowRightIcon className={'size-4 md:size-6'} />
                  </span>
                </Link>
              </div>

              {Object.keys(footerLinks).map((header: string) => (
                <div key={crypto.randomUUID()} className='space-y-4'>
                  <div className='flex items-center gap-2 text-muted dark:text-muted-foreground'>
                    <h6 className='text-base md:text-lg lg:text-xl decoration-wavy underline underline-offset-2'>
                      {prettifyText(header)}
                    </h6>

                    <span className=''>
                      <ChevronsDownIcon className='size-4' />
                    </span>
                  </div>

                  <ul className='space-y-2 text-sm'>
                    {Object.values(footerLinks[header]).map(
                      (link: FooterLink) => (
                        <li
                          key={link.id}
                          className={
                            'group transition-all delay-300 ease-in-out'
                          }>
                          <Link
                            href={link.link as Route}
                            className={buttonVariants({
                              variant: 'link',
                              className:
                                'p-0! text-muted-foreground! hover:text-primary! h-fit rounded-none',
                            })}>
                            {link.title}
                          </Link>
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <Separator className='my-4' />
          <div className='flex justify-center'>
            <p className='font-medium text-muted-foreground text-sm'>
              Copyright &copy; {new Date().getFullYear()} Rotate Keys. All Right
              Reserved
            </p>
          </div>
        </div>
      </SectionWrapper>
    </footer>
  );
}
