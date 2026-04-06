import { db } from '@/drizzle/db';
import { user } from '@/drizzle/schema';
import { inngest } from '@/inngest/client';
import { auth } from '@/lib/auth';
import {
  createUserSchema,
  getUserSchema,
} from '@/lib/validators/admin-schemas';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import z from 'zod';

const searchParams = z.object({
  page: z.string().default('1').optional(),
  perPage: z.string().default('10').optional(),
});

export const adminRouter = createTRPCRouter({
  createUser: protectedProcedure
    .input(createUserSchema)
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx.auth;
      const result = await auth.api.userHasPermission({
        body: {
          userId: user.id,
          permissions: {
            user: ['create'], // This must match the structure in your access control
          },
        },
      });

      if (!result.success) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: `You do not have permission to perform this action!`,
        });
      }

      await inngest.send({
        name: 'admin-user/created',
        data: input,
      });
    }),

  getUsers: protectedProcedure.input(searchParams).query(async ({ ctx }) => {
    const { user } = ctx.auth;

    const result = await auth.api.userHasPermission({
      body: {
        userId: user.id,
        permissions: {
          user: ['list'], // This must match the structure in your access control
        },
      },
    });

    if (!result.success) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `You do not have permission to perform this action!`,
      });
    }

    const usersList = await db.query.user.findMany({});

    return usersList;
  }),

  getUser: protectedProcedure
    .input(getUserSchema)
    .query(async ({ input, ctx }) => {
      const { user } = ctx.auth;

      const result = await auth.api.userHasPermission({
        body: {
          userId: user.id,
          permissions: {
            user: ['get'], // This must match the structure in your access control
          },
        },
      });

      if (!result.success) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: `You do not have permission to perform this action!`,
        });
      }

      const existingUser = await db.query.user.findFirst({
        where: (fields, { eq }) => eq(fields.id, input.id),
      });

      if (!existingUser) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No user found with id ${input.id}`,
        });
      }

      return user;
    }),

  deleteUsers: protectedProcedure.mutation(async ({ ctx }) => {
    const session = ctx.auth;

    const result = await auth.api.userHasPermission({
      body: {
        userId: session.user.id,
        permissions: {
          user: ['delete'], // This must match the structure in your access control
        },
      },
    });

    if (!result.success) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `You do not have permission to perform this action!`,
      });
    }

    const oldUsers = await db.query.user.findMany({});

    const res = await Promise.all(
      oldUsers.map(async (oldUser) => {
        await db.delete(user).where(eq(user.id, oldUser.id));
      }),
    );

    return res;
  }),

  deleteUser: protectedProcedure
    .input(getUserSchema)
    .mutation(async ({ input, ctx }) => {
      const { user } = ctx.auth;

      const result = await auth.api.userHasPermission({
        body: {
          userId: user.id,
          permissions: {
            user: ['delete'], // This must match the structure in your access control
          },
        },
      });

      if (!result.success) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: `You do not have permission to perform this action!`,
        });
      }

      await inngest.send({
        name: 'admin-user/deleted',
        data: {
          id: input.id,
        },
      });
    }),
});
