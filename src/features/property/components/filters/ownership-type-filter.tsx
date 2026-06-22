import { useState } from 'react';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ownershipConstantTypes } from '@/lib/helpers/property-helpers';

export default function OwnershipTypeFilter({ itemNo }: { itemNo: string }) {
  const [ownership, setOwnership] = useState('freehold');

  return (
    <AccordionItem value={`item-${itemNo}`}>
      <AccordionTrigger>Ownership Type</AccordionTrigger>
      <AccordionContent>
        <Tabs
          defaultValue={ownership}
          className='w-[235px] xs:w-[350px] sm:w-[430px] md:w-[493px]'
          onValueChange={setOwnership}
        >
          <ScrollArea className='w-full whitespace-nowrap'>
            <TabsList className={'gap-2'}>
              {ownershipConstantTypes.map((type, idx) => (
                <TabsTrigger key={idx} value={type.toLowerCase()}>
                  {type}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        </Tabs>
      </AccordionContent>
    </AccordionItem>
  );
}
