import SectionDescription from '@/components/shared/section-description';
import SectionHeading from '@/components/shared/section-heading';
import SectionHeadingGroup from '@/components/shared/section-heading-group';
import SectionWrapper from '@/components/shared/section-wrapper';

export default function AboutInfo() {
  return (
    <SectionWrapper className={'space-y-4 sm:space-y-6'}>
      <SectionHeadingGroup
        className={'space-y-4 md:space-y-6 lg:space-y-8 xl:space-y-10'}>
        <SectionHeading>
          <span className={'block text-foreground'}>Unlock the Door to</span>
          <span className={'block text-foreground'}>
            Your Next Adventure with
          </span>
          <span className={'block text-primary-500'}>Rotate Key</span>
        </SectionHeading>

        <SectionDescription className={'text-muted-foreground'}>
          {/* Rotate Keys is not just a platform; it&apos;s a community of
          like-minded individuals sharing the joy of exploration and discovery.
          Your dream house swap is just a click away. Rotate Keys is not just a
          platform; it&apos;s a community of like-minded individuals sharing the
          joy of exploration and discovery. Your dream house swap is just a
          click away.Rotate Keys is not just a platform; it&apos;s a community
          of like-minded individuals sharing the joy of exploration and
          discovery. Your dream house swap is just a click away. */}
          Rotate Keys is not just a platform, it&apos;s a community of
          like-minded individuals sharing the joy of exploration and discovery.
          Your dream house swap is just a click away.
        </SectionDescription>
      </SectionHeadingGroup>
    </SectionWrapper>
  );
}
