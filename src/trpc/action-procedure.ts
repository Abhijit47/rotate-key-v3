import { auth } from '@/lib/auth';
import { initTRPC, TRPCError } from '@trpc/server';
import { experimental_nextAppDirCaller } from '@trpc/server/adapters/next-app-dir';
import { headers } from 'next/headers';
import { cache } from 'react';
import superjson from 'superjson';

interface Meta {
  span: string;
}

/**
 * This context creator accepts `headers` so it can be reused in both
 * the RSC server caller (where you pass `next/headers`) and the
 * API route handler (where you pass the request headers).
 */
export const createTRPCContext = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  return { session };
});

type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

export const t = initTRPC.meta<Meta>().context<TRPCContext>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});

export const serverActionProcedure = t.procedure.experimental_caller(
  experimental_nextAppDirCaller({
    pathExtractor: ({ meta }) => (meta as Meta)?.span ?? '',
    createContext: async () => {
      // const headersList = await headers();
      return createTRPCContext();
    },
  }),
);
// .use(async (opts) => {
//   const session = await auth.api.getSession({ headers: await headers() });

//   // return session;
//   return opts.next({ ctx: { session } });
// });

export const protectedAction = serverActionProcedure.use((opts) => {
  if (!opts.ctx.session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    });
  }
  return opts.next({
    ctx: {
      ...opts.ctx,
      user: opts.ctx.session.user, // ensures type is non-nullable
    },
  });
});
