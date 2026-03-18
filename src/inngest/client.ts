import { ServerSession } from '@/lib/auth';
import { CreateUserValues } from '@/lib/validators/admin-schemas';
import { EventSchemas, Inngest } from 'inngest';

type UserSignup = {
  data: ServerSession['user'];
};

type UserOnboarding = {
  data: ServerSession['user'];
};

type UserCreated = {
  data: CreateUserValues;
};

type UserDeleted = {
  data: { id: string };
};

type Events = {
  'test/hello.world': {
    data: { email: string };
  };
  'user/new.signup.complete': UserSignup;
  'user/oauth.signup.complete': UserSignup;
  'user/onboarding.complete': UserOnboarding;
  'admin-user/created': UserCreated;
  'admin-user/deleted': UserDeleted;
};

export const inngest = new Inngest({
  id: 'rotate-key',
  schemas: new EventSchemas().fromRecord<Events>(),
  eventKey: process.env.INNGEST_EVENT_KEY,
});
