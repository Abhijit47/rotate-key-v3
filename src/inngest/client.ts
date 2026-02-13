import { env } from '@/env';
import { EventSchemas, Inngest } from 'inngest';

type UserSignup = {
  data: {
    email: string;
    name: string;
  };
};

type Events = {
  'test/hello.world': {
    data: { email: string };
  };
  'user/new.signup': UserSignup;
};

const isDev = process.env.NODE_ENV === 'development';

export const inngest = new Inngest({
  id: 'rotate-key',
  name: 'Rotate Key',
  schemas: new EventSchemas().fromRecord<Events>(),
  eventKey: isDev ? undefined : env.INNGEST_EVENT_KEY,
});
