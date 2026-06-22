import { useState } from 'react';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';

import { Label } from '@/components/ui/label';
import { propertyRules } from '@/constants/property-assets';

const isDev = process.env.NODE_ENV === 'development' ? true : false;

export default function RulesFilter({ itemNo }: { itemNo: string }) {
  const [rules, setRules] = useState(() => {
    return isDev
      ? [
          propertyRules[0].categoryTypes[0].name,
          propertyRules[0].categoryTypes[1].name,
          propertyRules[0].categoryTypes[2].name,
        ]
      : [];
  });

  return (
    <AccordionItem value={`item-${itemNo}`}>
      <AccordionTrigger>Rules</AccordionTrigger>
      <AccordionContent>
        <div className={'grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4'}>
          {propertyRules.map((ruleCategoryName) => (
            <div key={ruleCategoryName.id}>
              <span className={'font-semibold underline underline-offset-2'}>
                {ruleCategoryName.categoryName}
              </span>
              <div className={'mt-2 space-y-2'}>
                {ruleCategoryName.categoryTypes.map((rule) => (
                  <div key={rule.id} className='flex items-center space-x-2'>
                    <Checkbox
                      id={rule.name.toLowerCase()}
                      checked={rules.includes(rule.name)}
                      onCheckedChange={(checked) => {
                        setRules((prev) =>
                          checked
                            ? [...prev, rule.name]
                            : prev.filter((item) => item !== rule.name),
                        );
                      }}
                    />
                    <Label
                      htmlFor={rule.name.toLowerCase()}
                      className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                    >
                      {rule.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
