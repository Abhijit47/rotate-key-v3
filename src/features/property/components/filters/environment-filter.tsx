import { useQueryStates } from 'nuqs';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { propertyEnvironmentsEnum } from '@/constants/property-assets-enums';
import { usePropertyFilter } from '@/contexts/property-filter-context';
import { titleCaseSkipSpecial } from '@/lib/utils';
import { advancedFilterParams } from '../../searchParams';

export default function EnvironmentFilter({ itemNo }: { itemNo: string }) {
  const { startTransition } = usePropertyFilter();
  const [{ environment }, setValues] = useQueryStates(advancedFilterParams, {
    shallow: false,
    history: 'replace',
    startTransition,
    limitUrlUpdates: {
      method: 'throttle',
      timeMs: 300,
    },
  });

  // const [environment, setEnvironment] = useState<
  //   EnvironmentLateral | undefined
  // >('town');

  return (
    <AccordionItem value={`item-${itemNo}`}>
      <AccordionTrigger>Environment</AccordionTrigger>
      <AccordionContent>
        <div className={'flex items-center flex-wrap gap-2'}>
          {propertyEnvironmentsEnum.map((type, idx) => {
            return (
              <Badge
                key={idx}
                className={'cursor-pointer'}
                variant={environment === type ? 'default' : 'outline'}
                onClick={() => {
                  setValues((prev) => ({
                    ...prev,
                    environment: type === environment ? null : type,
                  }));
                }}>
                {titleCaseSkipSpecial(type)}
              </Badge>
            );
          })}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
