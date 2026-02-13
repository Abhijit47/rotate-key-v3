import { inngest } from './client';

export const helloWorld = inngest.createFunction(
  { id: 'hello-world' },
  { event: 'test/hello.world' },
  async ({ event, step }) => {
    await step.sleep('wait-a-moment', '1s');

    await step.sleep('wait-another-moment', '5s');

    await step.sleep('wait-one-more-moment', '10s');

    return { message: `Hello ${event.data.email}!` };
  },
);
