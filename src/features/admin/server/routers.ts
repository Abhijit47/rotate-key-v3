import { db } from '@/drizzle/db';
import { user } from '@/drizzle/schema';
import { inngest } from '@/inngest/client';
import {
  createUserSchema,
  getUserSchema,
} from '@/lib/validators/admin-schemas';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import z from 'zod';

const searchParams = z.object({
  page: z.string().default('1').optional(),
  perPage: z.string().default('10').optional(),
});

export const adminRouter = createTRPCRouter({
  createUser: baseProcedure
    .input(createUserSchema)
    .mutation(async ({ input }) => {
      await inngest.send({
        name: 'admin-user/created',
        data: input,
      });
    }),

  getUsers: baseProcedure.input(searchParams).query(async () => {
    const usersList = await db.query.user.findMany({});

    return usersList;
  }),

  getUser: baseProcedure.input(getUserSchema).query(async ({ input }) => {
    const user = await db.query.user.findFirst({
      where: (fields, { eq }) => eq(fields.id, input.id),
    });

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `No user found with id ${input.id}`,
      });
    }

    return user;
  }),

  deleteUsers: baseProcedure.mutation(async ({}) => {
    const oldUsers = await db.query.user.findMany({});

    const result = await Promise.all(
      oldUsers.map(async (oldUser) => {
        await db.delete(user).where(eq(user.id, oldUser.id));
      }),
    );

    return result;
  }),

  deleteUser: baseProcedure.input(getUserSchema).mutation(async ({ input }) => {
    await inngest.send({
      name: 'admin-user/deleted',
      data: {
        id: input.id,
      },
    });
  }),
});
