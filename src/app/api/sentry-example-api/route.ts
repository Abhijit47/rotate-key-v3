import * as Sentry from '@sentry/nextjs';
export const dynamic = 'force-dynamic';

class SentryExampleAPIError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = 'SentryExampleAPIError';
  }
}

// A faulty API route to test Sentry's error monitoring
export function GET() {
  const start = Date.now();

  Sentry.metrics.count('sample_api_call', 1, {
    attributes: { status: 'success' },
  });

  Sentry.logger.info('Sentry example API called');

  Sentry.startSpan(
    {
      op: 'rootSpan',
      name: 'My root span',
    },
    () => {
      // The code executed here will be profiled
      new Promise((resolve) => setTimeout(resolve, 1500)).then(() => {
        Sentry.logger.info('Sentry example API finished processing');
      });
    },
  );

  Sentry.metrics.distribution('sample_Api_latency', Date.now() - start, {
    unit: 'millisecond',
  });

  throw new SentryExampleAPIError(
    'This error is raised on the backend called by the example page.',
  );
}
