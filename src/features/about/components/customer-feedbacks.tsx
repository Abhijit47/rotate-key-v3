import SectionHeading from '@/components/shared/section-heading';
import SectionWrapper from '@/components/shared/section-wrapper';
import { CustomerFeedbackTestimonials } from '../../common/components/lazy-common';

export default function CustomerFeedbacks() {
  return (
    <SectionWrapper
      className={'space-y-4 md:space-y-6 lg:space-y-8 xl:space-y-12'}>
      <SectionHeading className='font-display'>
        <span className={'text-foreground'}>Customer</span>{' '}
        <span className={'text-primary dark:text-primary'}>Feedback</span>
      </SectionHeading>

      <CustomerFeedbackTestimonials />
    </SectionWrapper>
  );
}
