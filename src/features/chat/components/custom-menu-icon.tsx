import { Button } from '@/components/ui/button';
import { ChevronLeftCircleIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CustomMenuIcon() {
  const router = useRouter();
  return (
    <Button
      type='button'
      variant={'outline'}
      size={'icon-sm'}
      aria-label='Back to chat list'
      onClick={() => router.push('/chat')}
      className='inline-flex items-center justify-center'>
      <ChevronLeftCircleIcon className='h-5 w-5' aria-hidden='true' />
    </Button>
  );
}
