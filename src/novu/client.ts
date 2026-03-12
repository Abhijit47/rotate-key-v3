import { env } from '@/env';
import { Novu } from '@novu/api';

export const novuClient = new Novu({
  // secretKey: env.NOVU_SECRET_KEY,
  secretKey: 'ApiKey ' + env.NOVU_SECRET_KEY,
  serverURL: env.NOVU_US_API_URL,
});
