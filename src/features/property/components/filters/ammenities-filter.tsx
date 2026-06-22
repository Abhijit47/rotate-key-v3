import { useState } from 'react';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';

import { Label } from '@/components/ui/label';
import { propertyAmenities } from '@/constants/property-assets';

const isDev = process.env.NODE_ENV === 'development' ? true : false;

export default function AmmenitiesFilter({ itemNo }: { itemNo: string }) {
  const [amenities, setAmenities] = useState(() => {
    return isDev
      ? [
          propertyAmenities[0].categoryTypes[0].name,
          propertyAmenities[0].categoryTypes[1].name,
          propertyAmenities[0].categoryTypes[3].name,
        ]
      : [];
  });

  return (
    <AccordionItem value={`item-${itemNo}`}>
      <AccordionTrigger>Amenities</AccordionTrigger>
      <AccordionContent>
        <div className={'grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4'}>
          {propertyAmenities.map((amenityCategoryName) => (
            <div key={amenityCategoryName.id}>
              <span className={'font-semibold underline underline-offset-2'}>
                {amenityCategoryName.categoryName}
              </span>
              <div className={'mt-2 space-y-2'}>
                {amenityCategoryName.categoryTypes.map((amenity) => (
                  <div key={amenity.id} className='flex items-center space-x-2'>
                    <Checkbox
                      id={amenity.name.toLowerCase()}
                      checked={amenities.includes(amenity.name)}
                      onCheckedChange={(checked) => {
                        setAmenities((prev) =>
                          checked
                            ? [...prev, amenity.name]
                            : prev.filter((item) => item !== amenity.name),
                        );
                      }}
                    />
                    <Label
                      htmlFor={amenity.name.toLowerCase()}
                      className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                    >
                      {amenity.name}
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
