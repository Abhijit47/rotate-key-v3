import { Suspense } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { PersoalLoading } from '@/features/my-profile/components/my-profile-elements';
import PersonalInformationForm from '@/features/my-profile/components/personal-information-form';
import { ProfileErrorBoundary } from '@/features/my-profile/components/profile-components';
import ProfileRadialChart from '@/features/my-profile/components/profile-radial-chart';
import UserRecentListings from '@/features/my-profile/components/user-recent-listings';
import { prefetchProfileCompletionPercentage } from '@/features/users/server/prefetch';
import { requireAuth } from '@/lib/requireAuth';
import { HydrateClient } from '@/trpc/server';

export default async function MyProfilePage() {
  const { user } = await requireAuth();

  prefetchProfileCompletionPercentage();

  const personalInformation = {
    name: user.name,
    firstName: user.firstName,
    lastName: user.lastName,
    image: user.image,
    spokenLanguages: user.spokenLanguages,
    country: user.country,
    aboutMe: user.aboutMe,
  };

  return (
    <HydrateClient>
      <ProfileErrorBoundary
        fallBackText={'Something went wrong loading the your profile.'}>
        <div className='flex flex-col gap-4 md:gap-6 py-4 md:py-6'>
          <Suspense fallback={<PersoalLoading />}>
            <div className='space-y-6 px-4 lg:px-6'>
              <div className={'grid grid-cols-12 gap-4'}>
                <div className={'col-span-full lg:col-span-8'}>
                  <Card className={'gap-3 py-4'}>
                    <CardContent className={''}>
                      <PersonalInformationForm
                        personalInformation={personalInformation}
                      />
                    </CardContent>
                  </Card>
                </div>
                <div className={'col-span-full lg:col-span-4'}>
                  <ProfileRadialChart />
                </div>
              </div>
              <div className={'grid grid-cols-12 gap-4'}>
                <div className={'col-span-full'}>
                  <UserRecentListings />
                </div>
              </div>
            </div>
          </Suspense>
        </div>
      </ProfileErrorBoundary>
    </HydrateClient>
  );
}
