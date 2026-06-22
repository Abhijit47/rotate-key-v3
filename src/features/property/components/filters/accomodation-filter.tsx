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

export default function AccomodationFilter({ itemNo }: { itemNo: string }) {
  // Tabs state management
  const [accomodationCategory, setAccomodationCategory] = useState<string>(
    'private accommodation',
  ); // dont remove

  const [accomodationType, setAccomodationType] =
    useState<string>('private room');

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
          className='w-[235px] xs:w-[350px] sm:w-[430px] md:w-[493px]'
          onValueChange={setAccomodationCategory}
        >
          <ScrollArea className='w-full whitespace-nowrap'>
            <TabsList className={'gap-2 w-full'}>
              {propertyAccomodations.map((accomodationType) => (
                <TabsTrigger
                  key={accomodationType.id}
                  value={accomodationType.categoryName.toLowerCase()}
                >
                  {accomodationType.categoryName}
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation='horizontal' className={'bottom-4'} />
          </ScrollArea>
          <TabsContent value={accomodationCategory}>
            <div className={'mt-2 space-y-4'}>
              {foundAccomodationCategory?.categoryTypes?.map((type) => (
                <Card key={type.id} className='py-2 gap-2'>
                  <CardContent className={'flex items-center gap-1 px-2'}>
                    <Switch
                      id={type.name.toLowerCase()}
                      checked={accomodationType === type.name.toLowerCase()}
                      onCheckedChange={() => {
                        setAccomodationType(type.name.toLowerCase());
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
