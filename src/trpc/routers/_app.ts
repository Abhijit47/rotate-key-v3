import { z } from 'zod';

import { usersRouter } from '@/features/auth/server/routers';
import { baseProcedure, createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query((opts) => {
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),

  users: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
