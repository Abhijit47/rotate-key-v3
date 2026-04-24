import { db } from '@/drizzle/db';
import { user } from '@/drizzle/schema';
import {
  createDevtoolsIntegration,
  defineDevtoolsConfig,
} from 'better-auth-devtools/plugin';
import { eq } from 'drizzle-orm';

const ALLOWED_ROLES = ['admin', 'moderator', 'user'] as const;
type Role = (typeof ALLOWED_ROLES)[number];

export const devtoolsConfig = defineDevtoolsConfig({
  templates: {
    admin: { label: 'Admin', meta: { role: 'admin' } },
    moderator: { label: 'Moderator', meta: { role: 'moderator' } },
    user: { label: 'User', meta: { role: 'user' } },
  },
  editableFields: [
    {
      key: 'role',
      label: 'Role',
      type: 'select',
      options: ['admin', 'moderator', 'user'],
    },
  ],
  async createManagedUser(args) {
    const [newUser] = await db
      .insert(user)
      .values({
        name: args.template.label,
        email: args.email,
      })
      .returning();

    return {
      userId: newUser.id,
      email: newUser.email,
      label: args.template.label,
    };
  },
  async getSessionView(args) {
    const existingUser = await db.query.user.findFirst({
      where: (field, { eq }) => eq(field.id, args.userId),
    });
    // const existingUser = await db.user.findUnique({ where: { id: args.userId } });

    return {
      userId: args.userId,
      email: existingUser?.email,
      label: existingUser?.name,
      fields: {
        sessionId: args.sessionId,
        role: existingUser?.role ?? 'viewer',
      },
      editableFields: ['role'],
    };
  },
  async patchSession(args) {
    const nextRole = ALLOWED_ROLES.includes(args.patch.role as Role)
      ? (args.patch.role as Role)
      : 'user';
    await db
      .update(user)
      .set({ role: nextRole })
      .where(eq(user.id, args.userId));

    // await db.user.update({
    //   where: { id: args.userId },
    //   data: { role: String(args.patch.role ?? 'viewer') },
    // });

    const existingUser = await db.query.user.findFirst({
      where: (field, { eq }) => eq(field.id, args.userId),
    });

    // const user = await db.user.findUnique({ where: { id: args.userId } });

    return {
      userId: args.userId,
      email: existingUser?.email,
      label: existingUser?.name,
      fields: {
        sessionId: args.sessionId,
        role: existingUser?.role ?? 'user',
      },
      editableFields: ['role'],
    };
  },
});

export const devtools = createDevtoolsIntegration(devtoolsConfig, {
  position: 'bottom-right',
  triggerLabel: 'Auth DevTools',
});

export type DevtoolsConfig = typeof devtoolsConfig;
