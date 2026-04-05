'use server';

import { cache } from 'react';
import { auth } from './auth';

export const checkAdminPermissions = cache(async (userId: string) => {
  const result = await auth.api.userHasPermission({
    body: {
      userId: userId,
      permissions: {
        user: [
          'create',
          'list',
          'set-role',
          'ban',
          'impersonate',
          'impersonate-admins',
          'delete',
          'set-password',
          'get',
          'update',
        ],
        property: ['create', 'share', 'update', 'delete', 'get', 'list'],
        session: ['list', 'revoke', 'delete'],
      },
    },
  });
  return result;
});

export const checkUserPermissions = cache(async (userId: string) => {
  const result = await auth.api.userHasPermission({
    body: {
      userId: userId,
      role: 'user',
      permissions: {
        user: ['get', 'update'],
        property: ['create', 'share', 'update', 'delete', 'get', 'list'],
      },
    },
  });
  return result;
});

export const checkPermissions = cache(
  async (userId: string, permissions: Record<string, string[]>) => {
    const result = await auth.api.userHasPermission({
      body: {
        userId: userId,
        permissions: permissions,
      },
    });
    return result;
  },
);

export const checkListingPermissions = cache(async (userId: string) => {
  const result = await auth.api.userHasPermission({
    body: {
      userId: userId,
      permissions: {
        property: ['create', 'share', 'update', 'delete', 'get', 'list'],
      },
    },
  });
  return result;
});
