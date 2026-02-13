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

export const inngest = new Inngest({
  id: 'rotate-key',
  schemas: new EventSchemas().fromRecord<Events>(),
});
