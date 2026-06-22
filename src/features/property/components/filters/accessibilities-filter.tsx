import { useState } from 'react';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';

import { Label } from '@/components/ui/label';
import { propertyAccessibilities } from '@/constants/property-assets';

const isDev = process.env.NODE_ENV === 'development' ? true : false;

export default function AccessibilitiesFilter({ itemNo }: { itemNo: string }) {
  const [accessibilities, setAccessibilities] = useState(() => {
    return isDev
      ? [
          propertyAccessibilities[0].categoryTypes[0].name,
          propertyAccessibilities[0].categoryTypes[1].name,
          propertyAccessibilities[0].categoryTypes[2].name,
          propertyAccessibilities[0].categoryTypes[3].name,
        ]
      : [];
  });

  return (
    <AccordionItem value={`item-${itemNo}`}>
      <AccordionTrigger>Accessibilities</AccordionTrigger>
      <AccordionContent>
        <div className={'grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4'}>
          {propertyAccessibilities.map((accessibilityCategoryName) => (
            <div key={accessibilityCategoryName.id}>
              <span className={'font-semibold underline underline-offset-2'}>
                {accessibilityCategoryName.categoryName}
              </span>
              <div className={'mt-2 space-y-2'}>
                {accessibilityCategoryName.categoryTypes.map(
                  (accessibility) => (
                    <div
                      key={accessibility.id}
                      className='flex items-center space-x-2'
                    >
                      <Checkbox
                        id={accessibility.name.toLowerCase()}
                        checked={accessibilities.includes(accessibility.name)}
                        onCheckedChange={(checked) => {
                          setAccessibilities((prev) =>
                            checked
                              ? [...prev, accessibility.name]
                              : prev.filter(
                                  (item) => item !== accessibility.name,
                                ),
                          );
                        }}
                      />
                      <Label
                        htmlFor={accessibility.name.toLowerCase()}
                        className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                      >
                        {accessibility.name}
                      </Label>
                    </div>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
