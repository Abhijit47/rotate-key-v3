import { useQueryStates } from 'nuqs';
import { useState } from 'react';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { propertyAccomodations } from '@/constants/property-assets';
import {
  AccommodationCategoryLaterral,
  AccommodationLateral,
} from '@/constants/property-assets-types';
import { usePropertyFilter } from '@/contexts/property-filter-context';
import { advancedFilterParams } from '../../searchParams';

export default function AccomodationFilter({ itemNo }: { itemNo: string }) {
  // Tabs state management
  const [accomodationCategory, setAccomodationCategory] =
    useState<AccommodationCategoryLaterral>('private accommodation'); // dont remove

  const { startTransition } = usePropertyFilter();
  const [{ accomodation }, setValues] = useQueryStates(advancedFilterParams, {
    shallow: false,
    history: 'replace',
    startTransition,
    limitUrlUpdates: {
      method: 'throttle',
      timeMs: 300,
    },
  });

  // const [accomodationType, setAccomodationType] = useState<
  //   AccommodationLateral | undefined
  // >('private room');

  const foundAccomodationCategory = propertyAccomodations.find(
    (category) =>
      category.categoryName.toLowerCase() ===
      accomodationCategory.toLowerCase(),
  );

  return (
    <AccordionItem value={`item-${itemNo}`}>
      <AccordionTrigger>Accomodation</AccordionTrigger>
      <AccordionContent>
        <Tabs
          defaultValue={accomodationCategory}
          className='w-58.75 xs:w-[350px] sm:w-125'
          onValueChange={(val) =>
            setAccomodationCategory(val as AccommodationCategoryLaterral)
          }>
          <ScrollArea className='w-full whitespace-nowrap'>
            <TabsList className={'gap-2 w-full'}>
              {propertyAccomodations.map((accomodationType) => (
                <TabsTrigger
                  key={accomodationType.id}
                  value={accomodationType.categoryName.toLowerCase()}>
                  {accomodationType.categoryName}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation='horizontal' className={'bottom-4'} />
          </ScrollArea>
          <TabsContent value={accomodationCategory}>
            <div className={'mt-2 space-y-4'}>
              {foundAccomodationCategory?.categoryTypes?.map((type) => (
                <Card key={type.id} className='gap-2 py-2'>
                  <CardContent className={'flex items-center gap-1 px-2'}>
                    <Switch
                      id={type.name.toLowerCase()}
                      checked={
                        accomodation ===
                        (type.name.toLowerCase() as AccommodationLateral)
                      }
                      onCheckedChange={(checked) => {
                        // setAccomodationType(
                        //   type.name.toLowerCase() as AccommodationLateral,
                        // );

                        setValues((prev) => ({
                          ...prev,
                          accomodation: checked
                            ? (type.name.toLowerCase() as AccommodationLateral)
                            : null,
                        }));
                      }}
                    />
                    <Label htmlFor={type.name.toLowerCase()}>{type.name}</Label>
                  </CardContent>
                  <CardContent className={'px-2'}>
                    <CardDescription>{type.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </AccordionContent>
    </AccordionItem>
  );
}
