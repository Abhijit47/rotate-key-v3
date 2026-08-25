import SectionBanner from '@/components/shared/section-banner';
import AboutInfo from '@/features/about/components/about-info';
import CustomerFeedback from '@/features/about/components/customer-feedbacks';
import OurTeams from '@/features/about/components/our-teams';
import FAQSection from '@/features/common/components/faq-section';

export default function AboutPage() {
  return (
    <main
      className={'space-y-8 py-8'}
      // className={"max-w-(--breakpoint-xl) mx-auto px-4 2xl:px-0 space-y-8 py-8"}
    >
      <SectionBanner
        description='"From Registration to Adventure - A Seamless Experience Awaits You"'
        buttonText='Create your account for free'
        buttonLink='/sign-up'>
        <span className={'text-primary-500'}>Rotate Keys</span>
        <span className={'text-tertiary-50'}> : About Us</span>
      </SectionBanner>

      <AboutInfo />

      <CustomerFeedback />

      <OurTeams />

      <FAQSection />
    </main>
  );
}
