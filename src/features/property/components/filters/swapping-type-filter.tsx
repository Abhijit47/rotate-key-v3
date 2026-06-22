import { useState } from 'react';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { swappingConstantTypes } from '@/lib/helpers/property-helpers';

export default function SwappingTypeFilter({ itemNo }: { itemNo: string }) {
  const [swapping, setSwapping] = useState('permanent swap');

  return (
    <AccordionItem value={`item-${itemNo}`}>
      <AccordionTrigger>Swapping Type</AccordionTrigger>
      <AccordionContent>
        <Tabs
          defaultValue={swapping}
          className='w-[235px] xs:w-[350px] sm:w-[430px] md:w-full'
          onValueChange={setSwapping}
        >
          <ScrollArea className='w-full whitespace-nowrap'>
            <TabsList className={'gap-2 w-full'}>
              {swappingConstantTypes.map((type, idx) => (
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
