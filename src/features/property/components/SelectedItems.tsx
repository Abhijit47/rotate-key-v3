'use client';

import { ChevronsUpDown, ChevronUp } from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export default function SelectedItems({ items }: { items: string[] }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      {items.length > 0 ? (
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className='w-full space-y-2 space-x-2'>
          {items.slice(0, 4).map((rule, index) => (
            <Badge
              key={index}
              variant='outline'
              className='rounded-full capitalize'>
              {rule}
            </Badge>
          ))}
          <CollapsibleContent className='space-y-2'>
            {items.slice(4).map((rule, index) => (
              <Badge
                key={index}
                variant='outline'
                className='rounded-full capitalize'>
                {rule}
              </Badge>
            ))}
          </CollapsibleContent>
          {items.length > 4 ? (
            <>
              <CollapsibleTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  className='data-[state=open]:hidden'>
                  Show more <ChevronsUpDown />
                </Button>
              </CollapsibleTrigger>
            </>
          ) : null}
          <CollapsibleTrigger asChild>
            <Button
              variant='outline'
              size='sm'
              className='data-[state=open]:inline-flex hidden'>
              Show less <ChevronUp />
            </Button>
          </CollapsibleTrigger>
        </Collapsible>
      ) : null}
    </>
  );
}
