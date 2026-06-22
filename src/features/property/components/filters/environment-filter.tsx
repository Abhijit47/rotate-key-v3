import { useState } from 'react';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { environmentConstantTypes } from '@/lib/helpers/property-helpers';

export default function EnvironmentFilter({ itemNo }: { itemNo: string }) {
  const [environment, setEnvironment] = useState('town');

  return (
    <AccordionItem value={`item-${itemNo}`}>
      <AccordionTrigger>Environment</AccordionTrigger>
      <AccordionContent>
        <div className={'flex items-center flex-wrap gap-2'}>
          {environmentConstantTypes.map((type, idx) => (
            <Badge
              key={idx}
              className={'cursor-pointer'}
              variant={
                environment === type.toLowerCase() ? 'default' : 'outline'
              }
              onClick={() => setEnvironment(type.toLowerCase())}
            >
              {type}
            </Badge>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
