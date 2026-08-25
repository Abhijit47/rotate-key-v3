import SectionHeading from '@/components/shared/section-heading';
import SectionWrapper from '@/components/shared/section-wrapper';
import { teams } from '@/constants';
import Hover3DCard from './hover-3d-card';

export default function OurTeams() {
  return (
    <SectionWrapper className={'py-8 space-y-6'}>
      <SectionHeading>
        <span className={'text-foreground'}>Our</span>{' '}
        <span className={'text-primary-500'}>Teams</span>
      </SectionHeading>
      <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'}>
        {teams.map((team) => (
          <Hover3DCard key={team.id} {...team} />
        ))}
      </div>
    </SectionWrapper>
  );
}
