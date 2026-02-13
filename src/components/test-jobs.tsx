'use client';

import { mockSignUpWithInngest, mockSignUpWithOutInngest } from '@/lib/actions';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';

export default function TestJobs() {
  const [isPending1, startWithoutBGJobs] = useTransition();
  const [isPending2, startWithBGJobs] = useTransition();

  function handleWithoutBGJobs() {
    startWithoutBGJobs(async () => {
      const result = await mockSignUpWithOutInngest();
      toast.info(
        `Finished processing in ${Math.round((result.endTime - result.startTime) / 1000)} seconds!`,
        {
          duration: 5000,
        },
      );
    });
  }

  function handleWithBGJobs() {
    startWithBGJobs(async () => {
      await mockSignUpWithInngest();
      toast.warning(
        `Event sent to Inngest! Check your terminal or Inngest dashboard to see the result.`,
        { duration: 5000 },
      );
    });
  }

  return (
    <div className={'space-x-4'}>
      <Button onClick={handleWithoutBGJobs} disabled={isPending1}>
        {isPending1 ? 'Processing...' : 'Without BG JOBS'}
      </Button>
      <Button onClick={handleWithBGJobs} disabled={isPending2}>
        {isPending2 ? 'Processing...' : 'With BG JOBS'}
      </Button>
    </div>
  );
}
