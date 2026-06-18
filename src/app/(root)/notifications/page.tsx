import { requireAuth } from '@/lib/requireAuth';
import { LazyNotificationsWrapper } from '@/features/notifications/components/lazy';

export default async function NotificationsPage() {
  const { user } = await requireAuth();

  // TODO: will handle check properly later
  // if (user.notificationHash && user.notificationHash.length <= 0) return null;
  if (!user.notificationHash?.length) return null;
  return (
    <main
      className={'max-w-(--breakpoint-lg) mx-auto px-4 2xl:px-0 space-y-8 py-8'}
    >
      <LazyNotificationsWrapper
        subscriber={user.id}
        subscriberHash={user.notificationHash}
      />
    </main>
  );
}
