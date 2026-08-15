import { IconHomePlus } from '@tabler/icons-react';
import { ArrowUpRightIcon } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { usePropertyContext } from '@/contexts/property-context';

export default function IntroStep() {
  const { isLoading, onNextStep, onToggleErrorDrawer } = usePropertyContext();

  return (
    <CardContent className={'space-y-4'}>
      <Empty className={'border-2 border-dashed'}>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <IconHomePlus />
          </EmptyMedia>
          <EmptyTitle>No Properties Yet!</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t created any properties yet. Get started by creating
            your first property.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className='flex flex-col md:flex-row justify-center gap-2'>
          <Button variant='outline' disabled={isLoading}>
            Import Property
          </Button>
          <Button
            onClick={() => {
              onNextStep();
              onToggleErrorDrawer();
            }}
            disabled={isLoading}>
            {isLoading ? 'Please wait...' : 'Create a new property'}
          </Button>
        </EmptyContent>
        <Button
          variant='link'
          asChild
          className='text-muted-foreground'
          size='sm'
          disabled={isLoading}>
          <Link href='/'>
            Learn More <ArrowUpRightIcon />
          </Link>
        </Button>
      </Empty>
    </CardContent>
  );
}
