import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';

export const LazyUserButton = dynamic(() => import('../user-button'), {
  ssr: false,
  loading: () => <Skeleton className='size-8 rounded-md animate-pulse' />,
});
