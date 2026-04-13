import { DetailedUsageTableDemo } from '@/features/my-profile/components/detailed-usage-table-demo';
import { SubscriptionManagement } from '@/features/my-profile/components/subscription-management';

export default function SubscriptionsPage() {
  // const customer = await auth.api.state();

  return (
    <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
      <div className='px-4 lg:px-6 space-y-6'>
        <SubscriptionManagement />
        <DetailedUsageTableDemo />
      </div>
    </div>
  );
}
