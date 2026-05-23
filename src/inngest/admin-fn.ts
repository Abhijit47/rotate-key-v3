import { env } from '@/env';
import { polarClient } from '@/lib/polar';
import { novuClient } from '@/novu/client';
import { StreamChat } from 'stream-chat';
import { inngest } from './client';

export const deletePolarUsers = inngest.createFunction(
  { id: 'delete-polar-users' },
  { event: 'test/delete-polar-users' },
  async ({ event, step }) => {
    await step.run(`delete-polar-customers`, async () => {
      const allCustomers = await polarClient.customers.list({
        organizationId: process.env.POLAR_ORGANISATION_ID!,
      });
      console.log(
        `Found ${allCustomers.result.items.length} customers to delete.`,
      );

      for (const customer of allCustomers.result.items) {
        try {
          console.log(`Deleting Polar customer ${customer.id}`);

          await step.sleep(`deleting-polar-user-${customer.id}`, '1s');
          await polarClient.customers.delete({
            id: customer.id,
          });

          console.log(`Deleted Polar customer ${customer.id}`);
        } catch (error) {
          console.error(
            `Failed to delete Polar customer ${customer.id}`,
            error,
          );
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    });

    return {
      message: `Deleted polar customers!`,
    };
  },
);

export const deleteStreamUsers = inngest.createFunction(
  { id: 'delete-stream-users' },
  { event: 'test/delete-stream-users' },
  async ({ event, step }) => {
    const serverClient = StreamChat.getInstance(
      env.NEXT_PUBLIC_STREAM_API_KEY,
      env.STREAM_API_SECRET,
      { timeout: 6000, enableWSFallback: true },
    );

    const { users } = await serverClient.queryUsers({
      role: 'user',
    });
    console.log(`Found ${users.length} Stream users to delete.`);

    for (const user of users) {
      // Sleep for a moment before deleting each user to avoid hitting rate limits
      await step.sleep(`deleting-user-${user.id}`, '1s');

      await serverClient.deleteUser(user.id, {
        delete_conversation_channels: true,
        hard_delete: true,
        mark_messages_deleted: true,
      });
    }

    return {
      message: `Deleted ${users.length} users!`,
    };
  },
);

export const deleteNovuUsers = inngest.createFunction(
  { id: 'delete-novu-users' },
  { event: 'test/delete-novu-users' },
  async ({ event, step }) => {
    // Delete all Novu subscribers, paging through results and deleting one-by-one.
    const limit = 100;
    let after: string | undefined = undefined;
    let totalDeleted = 0;

    do {
      const res = await novuClient.subscribers.search({
        limit,
        includeCursor: true,
        after,
      });

      const subscribers = res.result.data ?? [];

      for (const s of subscribers) {
        // Sleep briefly to avoid rate limits
        await step.sleep(`deleting-novu-${s.subscriberId}`, '1s');

        try {
          await novuClient.subscribers.delete(s.subscriberId);
          totalDeleted++;
        } catch (err) {
          console.error(
            'Failed to delete Novu subscriber',
            s.subscriberId,
            err,
          );
        }
      }

      after = res.result.next ?? undefined;
    } while (after);

    return { message: `Deleted ${totalDeleted} subscribers!` };
  },
);
