import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { Card, CardContent } from '@/components/ui/card';
import { requireAuth } from '@/lib/requireAuth';
import { HydrateClient } from '@/trpc/server';
import ProfileRadialChart from '@/features/my-profile/components/profile-radial-chart';
import PersonalInformationForm from '@/features/my-profile/components/personal-information-form';
import { prefetchProfileCompletionPercentage } from '@/features/users/server/prefetch';
import UserRecentListings from '@/features/my-profile/components/user-recent-listings';
import { PersoalLoading } from '@/features/my-profile/components/my-profile-elements';

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
      <ErrorBoundary
        fallback={<div>Something went wrong loading the your profile.</div>}
      >
        <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
          <Suspense fallback={<PersoalLoading />}>
            <div className='px-4 lg:px-6 space-y-6'>
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
      </ErrorBoundary>
    </HydrateClient>
  );
}
