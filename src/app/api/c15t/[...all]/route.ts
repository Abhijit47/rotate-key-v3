import { db } from '@/drizzle/db';
import { c15tInstance } from '@c15t/backend/v2';
import { drizzleAdapter } from '@c15t/backend/v2/db/adapters/drizzle';
import type { NextRequest } from 'next/server';

// import { drizzle } from 'drizzle-orm/node-postgres';
// import { Pool } from 'pg';

// import { Pool } from '@neondatabase/serverless';
// import { drizzle } from 'drizzle-orm/neon-serverless';

// const db = drizzle(new Pool({ connectionString: process.env.DATABASE_URL! }));
const isDev = process.env.NODE_ENV === 'development';

const handler = c15tInstance({
  appName: 'rotate-key',
  basePath: '/api/c15t',
  adapter: drizzleAdapter({ provider: 'postgresql', db: db }),

  trustedOrigins: ['localhost', 'vercel.app'],
  advanced: {
    disableGeoLocation: true,
    openapi: {
      enabled: true,
    },
  },
  logger: {
    level: isDev ? 'info' : 'error',
  },
});

const handleRequest = async (request: NextRequest) => handler.handler(request);

export {
  handleRequest as GET,
  handleRequest as OPTIONS,
  handleRequest as POST,
};
