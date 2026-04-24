import { ChevronLeftCircleIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CustomMenuIcon() {
  const router = useRouter();
  return (
    <ChevronLeftCircleIcon
      className='h-5 w-5'
      onClick={() => {
        router.push('/chat');
      }}
    />
  );
}
