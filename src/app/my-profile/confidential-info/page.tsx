import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { Card, CardContent } from '@/components/ui/card';
import ProfileRadialChart from '@/features/my-profile/components/profile-radial-chart';
import ConfidentialForm from '@/features/my-profile/components/confidential-form';
import { requireAuth } from '@/lib/requireAuth';
import { prefetchProfileCompletionPercentage } from '@/features/users/server/prefetch';
import { HydrateClient } from '@/trpc/server';
import UserRecentListings from '@/features/my-profile/components/user-recent-listings';
import { ConfidentalLoading } from '@/features/my-profile/components/my-profile-elements';

export default async function ConfidentialInfoPage() {
  const { user } = await requireAuth();

  prefetchProfileCompletionPercentage();

  const confidentialInformation = {
    yearOfBirth: user.yearOfBirth,
    contactNumber: user.contactNumber,
    email: user.email,
    profileDocument: user.profileVerificationDocument,
    isProfileDocumentVerified: user.isProfileDocumentVerified,
  };

  return (
    <HydrateClient>
      <ErrorBoundary
        fallback={<div>Something went wrong loading the your profile.</div>}
      >
        <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
          <Suspense fallback={<ConfidentalLoading />}>
            <div className='px-4 lg:px-6 space-y-6'>
              <div className={'grid grid-cols-12 gap-4'}>
                <div className={'col-span-full lg:col-span-8'}>
                  <Card className={'gap-3 py-4'}>
                    <CardContent className={''}>
                      <ConfidentialForm
                        confidentialInformation={confidentialInformation}
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
