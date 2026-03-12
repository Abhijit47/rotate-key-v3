import { ServerSession } from '@/lib/auth';
import { EventSchemas, Inngest } from 'inngest';

type UserSignup = {
  data: ServerSession['user'];
};

type UserOnboarding = {
  data: ServerSession['user'];
};

type Events = {
  'test/hello.world': {
    data: { email: string };
  };
  'user/new.signup': UserSignup;
  'user/onboarding.complete': UserOnboarding;
};

export const inngest = new Inngest({
  id: 'rotate-key',
  schemas: new EventSchemas().fromRecord<Events>(),
  eventKey: process.env.INNGEST_EVENT_KEY,
});
