import { Button } from '@/components/ui/button';
import { inngest } from '@/inngest/client';

export default function TestingMode() {
  return (
    <div>
      <form
        action={async () => {
          'use server';
          await inngest.send({
            name: 'test/delete-polar-users',
            data: undefined,
          });
        }}>
        <Button type='submit'>Delete All Polar Users</Button>
      </form>
      <form
        action={async () => {
          'use server';
          await inngest.send({
            name: 'test/delete-stream-users',
            data: undefined,
          });
        }}>
        <Button type='submit'>Delete All Stream Users</Button>
      </form>
      <form
        action={async () => {
          'use server';
          await inngest.send({
            name: 'test/delete-novu-users',
            data: undefined,
          });
        }}>
        <Button type='submit'>Delete All Novu Users</Button>
      </form>
    </div>
  );
}
