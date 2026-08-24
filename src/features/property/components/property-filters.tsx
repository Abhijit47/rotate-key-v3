import { useQueryStates } from 'nuqs';

// EXTERNAL IMPORTS
import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardDescription } from '@/components/ui/card';
import { DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

// INTERNAL IMPORTS
import { advancedFilterParams } from '../searchParams';
import AccessibilitiesFilter from './filters/accessibilities-filter';
import AccomodationFilter from './filters/accomodation-filter';
import AmmenitiesFilter from './filters/ammenities-filter';
import EnvironmentFilter from './filters/environment-filter';
import MoveInAndOutFilter from './filters/move-in-and-out-filter';
import OwnershipTypeFilter from './filters/ownership-type-filter';
import RentalPeriodFilter from './filters/rental-period-filter';
import RulesFilter from './filters/rules-filter';
import SurroundingFilter from './filters/surrounding-filter';
import SwapingTypeFilter from './filters/swaping-type-filter';

import { usePropertyFilter } from '@/contexts/property-filter-context';

export default function PropertyFilters() {
  const { isTransition, startTransition } = usePropertyFilter();
  const [_, setValues] = useQueryStates(advancedFilterParams, {
    shallow: false,
    throttleMs: 300,
    history: 'replace',
    startTransition: startTransition,
  });

  function handleClearAllFilters() {
    setValues(null);
  }

  return (
    <div>
      <ScrollArea className='p-4 border rounded-md w-full h-75 md:h-125'>
        {/* Dates */}
        <MoveInAndOutFilter />

        <Accordion
          type='single'
          collapsible
          className='w-full'
          disabled={isTransition}>
          {/* Ownerships */}
          <OwnershipTypeFilter itemNo={'1'} />

          {/* Swappings */}
          <SwapingTypeFilter itemNo={'2'} />

          {/* Rental */}
          <RentalPeriodFilter itemNo={'3'} />

          {/* Surrounding */}
          <SurroundingFilter itemNo={'4'} />

          {/* Environment */}
          <EnvironmentFilter itemNo={'5'} />

          {/* Accomodation */}
          <AccomodationFilter itemNo={'6'} />

          {/* Amenities */}
          <AmmenitiesFilter itemNo={'7'} />

          {/* Rules */}
          <RulesFilter itemNo={'8'} />

          {/* Accessibilities */}
          <AccessibilitiesFilter itemNo={'9'} />
        </Accordion>

        <Card className={'py-2 md:py-4'}>
          <CardDescription className={'px-2 md:px-4'}>
            <DialogFooter
              className={'justify-between sm:justify-between flex-wrap gap-2'}>
              <DialogTrigger asChild>
                <Button
                  size={'sm'}
                  variant={'outline'}
                  type='button'
                  onClick={handleClearAllFilters}>
                  Clear All
                </Button>
              </DialogTrigger>
              <DialogTrigger asChild>
                <Button size={'sm'}>Show {40} places</Button>
              </DialogTrigger>
            </DialogFooter>
          </CardDescription>
        </Card>
      </ScrollArea>
    </div>
  );
}
