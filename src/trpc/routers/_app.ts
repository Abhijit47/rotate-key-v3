import { z } from 'zod';

import { adminRouter } from '@/features/admin/server/routers';
import { authRouter } from '@/features/auth/server/routers';
import { chatRouter } from '@/features/chat/server/routers';
import { propertyRouter } from '@/features/property/server/routers';
import { testPurposeRouter } from '@/features/test-purpose/server/routers';
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

  // Public endpoint
  health: baseProcedure
    .meta({
      name: 'Health Check',
      docs: {
        description: 'Check if the API is running',
        tags: ['System'],
      },
    })
    .output(z.object({ status: z.literal('ok') }))
    .query(() => ({ status: 'ok' as const })),

  auth: authRouter,
  admin: adminRouter,
  property: propertyRouter,
  chat: chatRouter,
  testPurpose: testPurposeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
