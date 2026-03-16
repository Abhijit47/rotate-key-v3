import { UsersSectionCards } from '@/features/admin/components/users-section-card';
import { UsersTable } from '@/features/admin/components/users-table';
import { prefetchUsers } from '@/features/admin/server/prefetch';
import { HydrateClient } from '@/trpc/server';
import { ErrorBoundary } from 'react-error-boundary';

export default async function UsersPage(props: PageProps<'/admin/users'>) {
  // TODO: require auth check and admin role here
  const searchParams = await props.searchParams;

  prefetchUsers(searchParams);

  return (
    <HydrateClient>
      <ErrorBoundary
        fallback={<div>Something went wrong loading the users listing.</div>}>
        <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
          <UsersSectionCards />

          <UsersTable />
        </div>
      </ErrorBoundary>
    </HydrateClient>
  );
}
