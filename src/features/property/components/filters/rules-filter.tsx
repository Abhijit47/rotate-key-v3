import { useQueryStates } from 'nuqs';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { propertyRules } from '@/constants/property-assets';
import { RulesLateral } from '@/constants/property-assets-types';
import { usePropertyFilter } from '@/contexts/property-filter-context';
import { advancedFilterParams } from '../../searchParams';

export default function RulesFilter({ itemNo }: { itemNo: string }) {
  const { startTransition } = usePropertyFilter();
  const [{ rules }, setValues] = useQueryStates(advancedFilterParams, {
    shallow: false,
    history: 'replace',
    startTransition,
    limitUrlUpdates: {
      method: 'throttle',
      timeMs: 300,
    },
  });

  // const [rules, setRules] = useState<RulesLateral[]>(() => {
  //   return isDev
  //     ? ['alcohol consumption', 'food disposal', 'clean up after pets']
  //     : [];
  // });

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
                      checked={rules?.includes(
                        rule.name.toLowerCase() as RulesLateral,
                      )}
                      onCheckedChange={(checked) => {
                        // setRules((prev) =>
                        //   checked
                        //     ? [...prev, rule.name.toLowerCase() as RulesLateral]
                        //     : prev.filter(
                        //         (item) =>
                        //           (item.toLowerCase() as RulesLateral) !==
                        //           (rule.name.toLowerCase() as RulesLateral),
                        //       ),
                        // );

                        setValues((prev) => ({
                          ...prev,
                          rules: checked
                            ? [
                                ...(prev.rules || []),
                                rule.name.toLowerCase() as RulesLateral,
                              ]
                            : (prev.rules || []).filter(
                                (item) =>
                                  (item.toLowerCase() as RulesLateral) !==
                                  (rule.name.toLowerCase() as RulesLateral),
                              ),
                        }));
                      }}
                    />
                    <Label
                      htmlFor={rule.name.toLowerCase()}
                      className='peer-disabled:opacity-70 font-medium text-sm leading-none peer-disabled:cursor-not-allowed'>
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
