import { useQueryStates } from 'nuqs';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { propertySurroundingsEnum } from '@/constants/property-assets-enums';
import { usePropertyFilter } from '@/contexts/property-filter-context';
import { titleCaseSkipSpecial } from '@/lib/utils';
import { advancedFilterParams } from '../../searchParams';

export default function SurroundingFilter({ itemNo }: { itemNo: string }) {
  const { startTransition } = usePropertyFilter();
  const [{ surrounding }, setValues] = useQueryStates(advancedFilterParams, {
    shallow: false,
    history: 'replace',
    startTransition,
    limitUrlUpdates: {
      method: 'throttle',
      timeMs: 300,
    },
  });

  // const [surrounding, setSurrounding] = useState<
  //   SurroundingLateral | undefined
  // >('desert');

  return (
    <AccordionItem value={`item-${itemNo}`}>
      <AccordionTrigger>Surrounding</AccordionTrigger>
      <AccordionContent>
        <div className={'flex items-center flex-wrap gap-2'}>
          {propertySurroundingsEnum.map((type, idx) => {
            return (
              <Badge
                key={idx}
                className={'cursor-pointer'}
                variant={surrounding === type ? 'default' : 'outline'}
                asChild>
                <button
                  aria-pressed={surrounding === type}
                  type='button'
                  onClick={() => {
                    setValues((prev) => ({
                      ...prev,
                      surrounding: type === surrounding ? null : type,
                    }));
                  }}>
                  {titleCaseSkipSpecial(type)}
                </button>
              </Badge>
            );
          })}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
