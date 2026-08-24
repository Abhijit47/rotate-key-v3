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
import { propertyRentalPeriods } from '@/constants/property-assets';
import {
  RentPeriodCategoryLateral,
  RentPeriodLateral,
} from '@/constants/property-assets-types';
import { usePropertyFilter } from '@/contexts/property-filter-context';
import { advancedFilterParams } from '../../searchParams';

export default function RentalPeriodFilter({ itemNo }: { itemNo: string }) {
  // Tabs state management
  const [rentalCategory, setRentalCategory] =
    useState<RentPeriodCategoryLateral>('short-term rentals'); // dont remove

  const { isTransition, startTransition } = usePropertyFilter();
  const [{ rentPeriod }, setValues] = useQueryStates(advancedFilterParams, {
    shallow: false,
    history: 'replace',
    startTransition,
    limitUrlUpdates: {
      method: 'throttle',
      timeMs: 300,
    },
  });

  // const [rentalPeriod, setRentalPeriod] = useState<
  //   RentPeriodLateral | undefined
  // >("weekly rental");

  const foundRentalCategory = propertyRentalPeriods
    .flatMap((period) => period.categoryTypes)
    .find(
      (category) =>
        // category.rentType.some(
        //   (rent) => rent.name.toLowerCase() === rentalCategory
        // )
        category.name.toLowerCase() === rentalCategory.toLowerCase(),
    );

  return (
    <AccordionItem value={`item-${itemNo}`}>
      <AccordionTrigger>Rental Period</AccordionTrigger>
      <AccordionContent>
        <Tabs
          defaultValue={rentalCategory}
          className='w-58.75 xs:w-[350px] sm:w-125'
          onValueChange={(val) =>
            setRentalCategory(val as RentPeriodCategoryLateral)
          }>
          <ScrollArea className='w-full whitespace-nowrap'>
            <TabsList className={'gap-2'}>
              {propertyRentalPeriods.map((rentalPeriod) => {
                return rentalPeriod.categoryTypes.map((categoryType) => (
                  <TabsTrigger
                    key={categoryType.id}
                    value={categoryType.name.toLowerCase()}
                    disabled={isTransition}>
                    {categoryType.name}
                  </TabsTrigger>
                ));
              })}
            </TabsList>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>
          <TabsContent value={rentalCategory}>
            <div className={'mt-2 space-y-4'}>
              {foundRentalCategory?.rentType?.map((type) => (
                <Card key={type.id} className='gap-2 py-2'>
                  <CardContent className={'flex items-center gap-1 px-2'}>
                    <Switch
                      id={type.name.toLowerCase()}
                      checked={
                        rentPeriod ===
                        (type.name.toLowerCase() as RentPeriodLateral)
                      }
                      onCheckedChange={(checked) => {
                        setValues((prev) => ({
                          ...prev,
                          rentPeriod: checked
                            ? (type.name.toLowerCase() as RentPeriodLateral)
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
