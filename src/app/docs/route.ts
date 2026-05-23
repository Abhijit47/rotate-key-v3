// app/docs/route.ts
import { collectRoutes, generateDocsHtml } from 'trpc-docs-generator';

import { appRouter } from '@/trpc/routers/_app';

export async function GET() {
  const routes = collectRoutes(appRouter);
  const html = generateDocsHtml(routes, {
    title: 'API Documentation',
    transformer: 'superjson', // Enable superjson in test playground
  });

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
