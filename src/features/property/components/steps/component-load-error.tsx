import { Button } from '@/components/ui/button';

export default function ComponentLoadError({
  error,
  retry,
}: {
  error: Error;
  retry: (() => void) | undefined;
}) {
  return (
    <div>
      Error! {error.message}
      <Button variant={'outline'} onClick={() => retry?.()}>
        Retry
      </Button>
    </div>
  );
}
