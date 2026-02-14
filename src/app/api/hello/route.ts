import { inngest } from '@/inngest/client'; // Import our client
import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';

// Opt out of caching; every request should send a new event
export const dynamic = 'force-dynamic';

// Create a simple async Next.js API route handler
export async function GET() {
  const start = Date.now();

  Sentry.metrics.count('inngest-sample-call', 1, {
    attributes: { status: 'success' },
  });

  Sentry.logger.info(
    `Inngest sample API called at ${new Date().toISOString()}`,
  );
  // Send your event payload to Inngest

  Sentry.startSpan(
    {
      op: 'rootSpan',
      name: 'My root span',
    },
    async () => {
      await inngest.send({
        name: 'test/hello.world',
        data: {
          email: 'testUser@example.com',
        },
      });
    },
  );

  Sentry.metrics.distribution('inngest_latency', Date.now() - start, {
    unit: 'millisecond',
  });

  return NextResponse.json({ message: 'Event sent!' });
}
