'use client';
// <-- hooks can only be used in client components
import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query';
export function ClientGreeting() {
  const trpc = useTRPC();
  // const greeting = useQuery(trpc.hello.queryOptions({ text: 'world' }));
  // if (!greeting.data) return <div>Loading...</div>;
  // return <div>{greeting.data.greeting}</div>;
  const { data, isLoading, isFetching, isPending } = useSuspenseQuery(
    trpc.hello.queryOptions({
      text: 'Hello fron client',
    }),
  );

  // throw new Error('Intensionally throw an error 💣');
  if (isLoading || isFetching || isPending) return <div>Loading...</div>;
  return <div>{data.greeting}</div>;
}
