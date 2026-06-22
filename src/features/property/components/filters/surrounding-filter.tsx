import { useState } from 'react';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { surroundingConstantTypes } from '@/lib/helpers/property-helpers';

export default function SurroundingFilter({ itemNo }: { itemNo: string }) {
  const [surrounding, setSurrounding] = useState('island');

  return (
    <AccordionItem value={`item-${itemNo}`}>
      <AccordionTrigger>Surrounding</AccordionTrigger>
      <AccordionContent>
        <div className={'flex items-center flex-wrap gap-2'}>
          {surroundingConstantTypes.map((type, idx) => (
            <Badge
              key={idx}
              className={'cursor-pointer'}
              variant={
                surrounding === type.toLowerCase() ? 'default' : 'outline'
              }
              onClick={() => setSurrounding(type.toLowerCase())}
            >
              {type}
            </Badge>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
