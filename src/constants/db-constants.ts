export const roles = ['admin', 'moderator', 'user'] as const;
export type Role = (typeof roles)[number];

export const plans = ['free', 'basic', 'pro'] as const;
export type Plan = (typeof plans)[number];
