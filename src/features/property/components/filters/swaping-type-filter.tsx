import { useQueryStates } from 'nuqs';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { propertySwapingsEnum } from '@/constants/property-assets-enums';
import { SwapingLateral } from '@/constants/property-assets-types';
import { usePropertyFilter } from '@/contexts/property-filter-context';
import { titleCaseSkipSpecial } from '@/lib/utils';
import { advancedFilterParams } from '../../searchParams';

export default function SwappingTypeFilter({ itemNo }: { itemNo: string }) {
  const { startTransition } = usePropertyFilter();
  const [{ swaping }, setValues] = useQueryStates(advancedFilterParams, {
    shallow: false,
    history: 'replace',
    startTransition,
    limitUrlUpdates: {
      method: 'throttle',
      timeMs: 300,
    },
  });

  // const [swapping, setSwapping] = useState<SwapingLateral | undefined>(
  //   'permanent swap',
  // );

  return (
    <AccordionItem value={`item-${itemNo}`}>
      <AccordionTrigger>Swapping Type</AccordionTrigger>
      <AccordionContent>
        <Tabs
          value={swaping ?? undefined}
          className='w-58.75 xs:w-[350px] sm:w-107.5 md:w-full'
          onValueChange={(val) =>
            setValues((prev) => ({
              ...prev,
              swaping: val as SwapingLateral | undefined,
            }))
          }>
          <ScrollArea className='w-full whitespace-nowrap'>
            <TabsList className={'gap-2 w-full'}>
              {propertySwapingsEnum.map((type, idx) => {
                return (
                  <TabsTrigger key={idx} value={type}>
                    {titleCaseSkipSpecial(type)}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
        </Tabs>
      </AccordionContent>
    </AccordionItem>
  );
}
