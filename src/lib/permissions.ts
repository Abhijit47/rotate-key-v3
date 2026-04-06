import { createAccessControl } from 'better-auth/plugins/access';
import { adminAc, defaultStatements } from 'better-auth/plugins/admin/access';

export const statement = {
  ...defaultStatements,
  property: [
    'create',
    'share',
    'update',
    'delete',
    'get',
    'list',
    'like',
    'save',
  ],
} as const;

export const ac = createAccessControl(statement);

// admin, moderator, user roles with different permissions
export const admin = ac.newRole({
  property: ['create', 'share', 'update', 'delete', 'get', 'list'],
  ...adminAc.statements,
});

export const moderator = ac.newRole({
  property: ['get', 'list', 'update'],
  user: ['ban'],
});

export const user = ac.newRole({
  property: ['create', 'share', 'update', 'get', 'list', 'like', 'save'],
  user: ['get', 'update', 'set-password'],
});

// export const check1 = await auth.api.userHasPermission({
//   body: {
//     userId: 'id', //the user id
//     permissions: {
//       property: ['create'], // This must match the structure in your access control
//     },
//   },
// });

// You can also just pass the role directly
// export const check2 = await auth.api.userHasPermission({
//   body: {
//     role: 'admin',
//     permissions: {
//       property: ['create'], // This must match the structure in your access control
//     },
//   },
// });

// You can also check multiple resource permissions at the same time
// export const check3 = await auth.api.userHasPermission({
//   body: {
//     role: 'admin',
//     permissions: {
//       property: ['create'], // This must match the structure in your access control
//       // sale: ['create'],
//     },
//   },
// });
