import SectionBanner from '@/components/shared/section-banner';
import FAQSection from '@/features/common/components/faq-section';
import WhyUs from '@/features/how-it-works/components/why-us';
import WorksCTA from '@/features/how-it-works/components/works-cta';
import WorksSteps from '@/features/how-it-works/components/works-steps';

export default function HowItWorksPage() {
  return (
    <main className={'space-y-8 py-8'}>
      <SectionBanner
        description='"From Registration to Adventure - A Seamless Experience Awaits You"'
        buttonText='Create your account for free'
        buttonLink='/login'>
        <span className={'text-primary'}>Rotate Keys</span>
        <span className={'text-muted dark:text-accent-foreground'}>
          {' '}
          : How does it works?
        </span>
      </SectionBanner>

      <WorksSteps />
      <WhyUs />
      <WorksCTA />
      <FAQSection />
    </main>
  );
}
