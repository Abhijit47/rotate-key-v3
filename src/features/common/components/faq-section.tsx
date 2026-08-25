import { ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';

import SectionHeading from '@/components/shared/section-heading';
import SectionWrapper from '@/components/shared/section-wrapper';
import Faqs from './faqs';
import { LazyNewsLetterForm } from './lazy-common';

export default function FAQSection() {
  return (
    <section
      className={'bg-primary/15 dark:bg-primary/10 py-8 md:py-12 lg:py-16'}>
      <SectionWrapper>
        <SectionHeading>
          <span className={'block text-foreground'}>Fequently</span>{' '}
          <span className={'block text-primary-500'}>asked questions</span>
        </SectionHeading>

        <div
          className={
            'grid lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 mt-8 md:mt-12 lg:mt-16'
          }>
          <div className={''}>
            <Faqs />
          </div>

          <div className={'inline-grid place-items-center w-full h-full'}>
            <div className={'space-y-2 md:space-y-4 lg:space-y-6'}>
              <div className={'space-y-2 md:space-y-4 lg:space-y-6'}>
                <h4
                  className={
                    'text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-primary-500'
                  }>
                  How we can help you?
                </h4>
                <ul className={'list-inside list-disc space-y-2'}>
                  <li className={'text-sm md:text-base'}>
                    Follow our newsletter.
                  </li>
                  <li className={'text-sm md:text-base'}>
                    We will regulary update our latest project and availability.
                  </li>
                </ul>
              </div>

              <div className={'grid grid-cols-3 gap-2'}>
                <div className={'col-span-3'}>
                  <LazyNewsLetterForm />
                </div>
              </div>

              <Link
                href={'#'}
                className={
                  'text-primary-500 text-sm font-semibold inline-flex items-center gap-1'
                }>
                <span>More FAQ</span>
                <span>
                  <ArrowRightIcon className={'size-4'} />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </section>
  );
}
