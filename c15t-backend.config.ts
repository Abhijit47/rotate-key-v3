import { db } from '@/drizzle/db';
import { defineConfig } from '@c15t/backend/v2';
import { drizzleAdapter } from '@c15t/backend/v2/db/adapters/drizzle';

// import { drizzle } from 'drizzle-orm/node-postgres';
// import { Pool } from 'pg';

// import { Pool } from '@neondatabase/serverless';
// import { drizzle } from 'drizzle-orm/neon-serverless';

// const db = drizzle(new Pool({ connectionString: process.env.DATABASE_URL! }));

export default defineConfig({
  adapter: drizzleAdapter({ provider: 'postgresql', db: db }),
});
