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

export default function RentalPeriodFilter({ itemNo }: { itemNo: string }) {
  // Tabs state management
  const [rentalCategory, setRentalCategory] =
    useState<string>('short-term rentals'); // dont remove

  const [rentalPeriod, setRentalPeriod] = useState('weekly rental');

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
          className='w-[235px] xs:w-[350px] sm:w-[430px] md:w-[493px]'
          onValueChange={setRentalCategory}
        >
          <ScrollArea className='w-full whitespace-nowrap'>
            <TabsList className={'gap-2'}>
              {propertyRentalPeriods.map((rentalPeriod) => {
                return rentalPeriod.categoryTypes.map((categoryType) => (
                  <TabsTrigger
                    key={categoryType.id}
                    value={categoryType.name.toLowerCase()}
                  >
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
                <Card key={type.id} className='py-2 gap-2'>
                  <CardContent className={'flex items-center gap-1 px-2'}>
                    <Switch
                      id={type.name.toLowerCase()}
                      checked={rentalPeriod === type.name.toLowerCase()}
                      onCheckedChange={() => {
                        setRentalPeriod(type.name.toLowerCase());
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
