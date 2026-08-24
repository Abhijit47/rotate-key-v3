import { useQueryStates } from 'nuqs';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { propertyAmenities } from '@/constants/property-assets';
import { AmenitiesLateral } from '@/constants/property-assets-types';
import { usePropertyFilter } from '@/contexts/property-filter-context';
import { advancedFilterParams } from '../../searchParams';

export default function AmmenitiesFilter({ itemNo }: { itemNo: string }) {
  const { startTransition } = usePropertyFilter();
  const [{ amenities }, setValues] = useQueryStates(advancedFilterParams, {
    shallow: false,
    history: 'replace',
    startTransition,
    limitUrlUpdates: {
      method: 'throttle',
      timeMs: 300,
    },
  });

  // const [amenities, setAmenities] = useState<AmenitiesLateral[]>(() => {
  //   return isDev ? ["air conditioning", "alarm clock", "bbq grill"] : [];
  // });
  // console.log("🚀 ~ AmmenitiesFilter ~ amenities:", amenities);

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
                      checked={amenities?.includes(
                        amenity.name.toLowerCase() as AmenitiesLateral,
                      )}
                      onCheckedChange={(checked) => {
                        setValues((prev) => ({
                          ...prev,
                          amenities: checked
                            ? [
                                ...(prev.amenities || []),
                                amenity.name.toLowerCase() as AmenitiesLateral,
                              ]
                            : (prev.amenities || []).filter(
                                (item) =>
                                  (item.toLowerCase() as AmenitiesLateral) !==
                                  (amenity.name.toLowerCase() as AmenitiesLateral),
                              ),
                        }));
                      }}
                    />
                    <Label
                      htmlFor={amenity.name.toLowerCase()}
                      className='peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed'>
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
