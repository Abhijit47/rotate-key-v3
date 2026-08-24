import { useQueryStates } from 'nuqs';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { propertyAccessibilities } from '@/constants/property-assets';
import { AccessibilitiesLateral } from '@/constants/property-assets-types';
import { usePropertyFilter } from '@/contexts/property-filter-context';
import { advancedFilterParams } from '../../searchParams';

export default function AccessibilitiesFilter({ itemNo }: { itemNo: string }) {
  const { startTransition } = usePropertyFilter();
  const [{ accessibilities }, setValues] = useQueryStates(
    advancedFilterParams,
    {
      shallow: false,
      history: 'replace',
      startTransition,
      limitUrlUpdates: {
        method: 'throttle',
        timeMs: 300,
      },
    },
  );

  // const items = accessibilities;

  // const [accessibilities, setAccessibilities] = useState<
  //   AccessibilitiesLateral[]
  // >(() => {
  //   return isDev ? ['adjustable bed', 'braille signage', 'grab bars'] : [];
  // });

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
                      className='flex items-center space-x-2'>
                      <Checkbox
                        id={accessibility.name.toLowerCase()}
                        checked={accessibilities?.includes(
                          accessibility.name.toLowerCase() as AccessibilitiesLateral,
                        )}
                        onCheckedChange={(checked) => {
                          // setAccessibilities((prev) =>
                          //   checked
                          //     ? [
                          //         ...prev,
                          //         accessibility.name.toLowerCase() as AccessibilitiesLateral,
                          //       ]
                          //     : prev.filter(
                          //         (item) =>
                          //           (item.toLowerCase() as AccessibilitiesLateral) !==
                          //           (accessibility.name.toLowerCase() as AccessibilitiesLateral),
                          //       ),
                          // );

                          setValues((prev) => ({
                            ...prev,
                            accessibilities: checked
                              ? [
                                  ...(prev.accessibilities || []),
                                  accessibility.name.toLowerCase() as AccessibilitiesLateral,
                                ]
                              : (prev.accessibilities || []).filter(
                                  (item) =>
                                    (item.toLowerCase() as AccessibilitiesLateral) !==
                                    (accessibility.name.toLowerCase() as AccessibilitiesLateral),
                                ),
                          }));
                        }}
                      />
                      <Label
                        htmlFor={accessibility.name.toLowerCase()}
                        className='peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed'>
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
