import { z } from 'zod';

import { adminRouter } from '@/features/admin/server/routers';
import { authRouter } from '@/features/auth/server/routers';
import { propertyRouter } from '@/features/property/server/routers';
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

  auth: authRouter,
  admin: adminRouter,
  property: propertyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
