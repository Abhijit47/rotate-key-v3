'use client';

import { addDays, format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useQueryStates } from 'nuqs';
import { useState, useTransition } from 'react';
import { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { basicFilterAddonParams } from '@/features/property/searchParams';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const selectiveRange = [0, 1, 3, 7, 15, 30] as const;

type SelectiveRange = (typeof selectiveRange)[number];

type DatePickerWithRangeSelectProps = {
  className?: string;
  id: string;
};

export default function DatePickerWithRangeSelect(
  props: DatePickerWithRangeSelectProps,
) {
  const { className, id } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [fixedRange, setFixedRange] = useState<SelectiveRange | undefined>();

  // const [date, setDate] = useState<DateRange | undefined>({
  //   from: addDays(new Date(), -20),
  //   to: new Date(),
  // });
  const today = new Date();

  const [isTransition, startTransition] = useTransition();
  const [values, setValues] = useQueryStates(basicFilterAddonParams, {
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

  function handleChangeBySelectiveRange(range: SelectiveRange) {
    switch (range) {
      case 0:
        setValues((prev) => ({
          ...prev,
          from: new Date(),
          to: null,
        }));
        setFixedRange(0);
        setIsOpen(false);
        break;

      case 1:
        // calculate from today to tomorrow
        const tomorrow = addDays(today, 1);
        setValues((prev) => ({
          ...prev,
          from: today,
          to: tomorrow,
        }));
        setFixedRange(1);
        setIsOpen(false);
        break;

      case 3:
        // calculate from today to after 3 days
        const threeDaysFromNow = addDays(today, 3);
        setValues((prev) => ({
          ...prev,
          from: today,
          to: threeDaysFromNow,
        }));
        setFixedRange(3);
        setIsOpen(false);
        break;

      case 7:
        // calculate from today to after 7 days
        const sevenDaysFromNow = addDays(today, 7);
        setValues((prev) => ({
          ...prev,
          from: today,
          to: sevenDaysFromNow,
        }));
        setFixedRange(7);
        setIsOpen(false);
        break;

      case 15:
        // calculate from today to after 15 days
        const fifteenDaysFromNow = addDays(today, 15);
        setValues((prev) => ({
          ...prev,
          from: today,
          to: fifteenDaysFromNow,
        }));
        setFixedRange(15);
        setIsOpen(false);
        break;

      case 30:
        // calculate from today to after 30 days
        const thirtyDaysFromNow = addDays(today, 30);
        setValues((prev) => ({
          ...prev,
          from: today,
          to: thirtyDaysFromNow,
        }));
        setFixedRange(30);
        setIsOpen(false);
        break;

      default:
        setValues((prev) => ({
          ...prev,
          from: addDays(new Date(), 0),
          to: addDays(new Date(), 0),
        }));
        setFixedRange(undefined);
        setIsOpen(false);
        break;
    }
  }

  function handleUpdateCalendarRange(date: DateRange | undefined) {
    if (date) {
      setValues((prev) => ({
        ...prev,
        from: date.from ? date.from : null,
        to: date.to ? date.to : null,
      }));
      setIsOpen(false);
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={isTransition}
          id={id}
          variant={'outline'}
          className={cn(
            'justify-start w-full md:w-75 font-normal text-left',
            !selectedDt && 'text-muted-foreground',
          )}>
          <CalendarIcon className='mr-2 w-4 h-4' />
          {selectedDt?.from ? (
            selectedDt.to ? (
              <>
                {format(selectedDt.from, 'LLL dd, y')} -
                {format(selectedDt.to, 'LLL dd, y')}
              </>
            ) : (
              format(selectedDt.from, 'LLL dd, y')
            )
          ) : (
            <span>Pick a date</span>
          )}

          {/* {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )} */}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-0 w-auto' align='center'>
        <Select
          value={fixedRange?.toString() || ''}
          onValueChange={(value) =>
            handleChangeBySelectiveRange(Number(value) as SelectiveRange)
          }>
          <SelectTrigger className={'w-full'}>
            <SelectValue placeholder='Select' />
          </SelectTrigger>
          <SelectContent position='popper' className={'w-full'}>
            <SelectItem value='0'>Today</SelectItem>
            <SelectItem value='1'>Tomorrow</SelectItem>
            <SelectItem value='3'>In 3 days</SelectItem>
            <SelectItem value='7'>In a week</SelectItem>
            <SelectItem value='15'>In 15 days</SelectItem>
            <SelectItem value='30'>In a month</SelectItem>
          </SelectContent>
        </Select>
        <div className='border rounded-md'>
          <Calendar
            autoFocus
            mode='range'
            // defaultMonth={date?.from}
            defaultMonth={selectedDt.from}
            // selected={date}
            selected={selectedDt}
            onSelect={(date) => handleUpdateCalendarRange(date)}
            numberOfMonths={2}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

// import * as React from 'react';

// import { addDays, format } from 'date-fns';
// import { CalendarIcon } from 'lucide-react';
// import { DateRange } from 'react-day-picker';

// import { Button } from '@/components/ui/button';
// import { Calendar } from '@/components/ui/calendar';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover';
// import { cn } from '@/lib/utils';

// export default function DatePickerWithRange({
//   className,
// }: React.HTMLAttributes<HTMLDivElement>) {
//   const [date, setDate] = React.useState<DateRange | undefined>({
//     from: new Date(2022, 0, 20),
//     to: addDays(new Date(2022, 0, 20), 20),
//   });

//   return (
//     <div className={cn('flex-1 gap-2 grid w-full', className)}>
//       <Popover>
//         <PopoverTrigger asChild>
//           <Button
//             id='date'
//             variant={'outline'}
//             className={cn(
//               'w-full justify-start text-left font-normal',
//               !date && 'text-muted-foreground'
//             )}>
//             <CalendarIcon />
//             {date?.from ? (
//               date.to ? (
//                 <>
//                   {format(date.from, 'LLL dd, y')} -{' '}
//                   {format(date.to, 'LLL dd, y')}
//                 </>
//               ) : (
//                 format(date.from, 'LLL dd, y')
//               )
//             ) : (
//               <span>Pick a date</span>
//             )}
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className='p-0 w-auto' align='end'>
//           <Calendar
//             // initialFocus
//             autoFocus
//             mode='range'
//             defaultMonth={date?.from}
//             selected={date}
//             onSelect={setDate}
//             numberOfMonths={2}
//           />
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// }
