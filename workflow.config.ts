import { createVercelWorld } from '@workflow/world-vercel';

const isDev = process.env.NODE_ENV === 'development';

export const world = createVercelWorld({
  // token: process.env.WORKFLOW_VERCEL_AUTH_TOKEN,
  projectConfig: {
    projectId: process.env.WORKFLOW_VERCEL_PROJECT,
    teamId: process.env.WORKFLOW_VERCEL_TEAM,
    environment: isDev ? 'development' : 'production',
  },
});
