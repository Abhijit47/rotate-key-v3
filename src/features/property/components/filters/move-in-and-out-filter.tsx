import { addDays, format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useQueryStates } from 'nuqs';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { usePropertyFilter } from '@/contexts/property-filter-context';
import { cn } from '@/lib/utils';
import { advancedFilterParams } from '../../searchParams';
// import { DateRange } from 'react-day-picker';

// const isDev = process.env.NODE_ENV === 'development' ? true : false;

export default function MoveInAndOutFilter() {
  // const today = new Date();
  // const thirtyDaysFromNow = addDays(today, 30);

  // const [startDate, setStartDate] = useState<Date | undefined>(
  //   isDev ? today : undefined
  // );
  // const [endDate, setEndDate] = useState<Date | undefined>(
  //   isDev ? thirtyDaysFromNow : undefined
  // );

  const { startTransition } = usePropertyFilter();
  const [values, setValues] = useQueryStates(advancedFilterParams, {
    shallow: false,
    history: 'replace',
    startTransition: startTransition,
    limitUrlUpdates: {
      method: 'throttle',
      timeMs: 300,
    },
  });

  const selectedDt = {
    from: values.from ? new Date(values.from) : addDays(new Date(), -30),
    to: values.to ? new Date(values.to) : new Date(),
  };

  function handleUpdateStartDate(date: Date | undefined) {
    if (date) {
      setValues((prev) => ({
        ...prev,
        from: date,
      }));
    }
  }

  function handleUpdateEndDate(date: Date | undefined) {
    if (date) {
      setValues((prev) => ({
        ...prev,
        to: date,
      }));
    }
  }

  return (
    <div
      className={
        'inline-grid grid-cols-1 md:grid-cols-2 items-center justify-items-center gap-4 w-full'
      }>
      <div className={'w-full'}>
        <Label className={'mb-2'}>Start Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'pl-3 w-full font-normal text-left',
                !selectedDt.from && 'text-muted-foreground',
              )}>
              {selectedDt.from ? (
                format(selectedDt.from, 'PPP')
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className='opacity-50 ml-auto w-4 h-4' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='p-0 w-auto' align='start'>
            <Calendar
              autoFocus
              mode='single'
              defaultMonth={new Date()}
              selected={selectedDt.from}
              onSelect={(date) => handleUpdateStartDate(date)}
              disabled={(date) =>
                date < new Date() || date < new Date('1900-01-01')
              }
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className={'w-full'}>
        <Label className={'mb-2'}>End Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'pl-3 w-full font-normal text-left',
                !selectedDt.to && 'text-muted-foreground',
              )}>
              {selectedDt.to ? (
                format(selectedDt.to, 'PPP')
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className='opacity-50 ml-auto w-4 h-4' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='p-0 w-auto' align='end'>
            <Calendar
              autoFocus
              mode='single'
              defaultMonth={new Date()}
              selected={selectedDt.to}
              onSelect={(date) => handleUpdateEndDate(date)}
              disabled={(date) =>
                date < new Date() || date < new Date('1900-01-01')
              }
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
