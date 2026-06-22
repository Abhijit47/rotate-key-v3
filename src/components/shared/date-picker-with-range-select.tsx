'use client';

import { addDays, format } from 'date-fns';
import * as React from 'react';
import { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export default function DatePickerWithRangeSelect({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -20),
    to: new Date(),
  });
  const today = new Date();

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id='date'
            variant={'outline'}
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}>
            <CalendarIcon className='mr-2 h-4 w-4' />
            {date?.from ? (
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
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Select
            onValueChange={(value) =>
              // setDate(addDays(new Date(), parseInt(value)))
              // setDate({
              //   from: addDays(new Date(), parseInt(value)),
              //   to: addDays(new Date(), parseInt(value)),
              // })
              {
                switch (value) {
                  case value:
                    setDate({
                      from: new Date(),
                      to: undefined,
                    });
                    break;

                  case '1':
                    // calculate from today to tomorrow
                    const tomorrow = addDays(today, 1);
                    setDate({
                      from: today,
                      to: tomorrow,
                    });
                    break;

                  case '3':
                    // calculate from today to after 3 days
                    const threeDaysFromNow = addDays(today, 3);
                    setDate({
                      from: today,
                      to: threeDaysFromNow,
                    });
                    break;

                  case '7':
                    const sevenDaysFromNow = addDays(today, 3);
                    setDate({
                      from: today,
                      to: sevenDaysFromNow,
                    });
                    break;

                  default:
                    setDate({
                      from: addDays(new Date(), 0),
                      to: addDays(new Date(), 0),
                    });
                    break;
                }
              }
            }>
            <SelectTrigger className={'w-full'}>
              <SelectValue placeholder='Select' />
            </SelectTrigger>
            <SelectContent position='popper' className={'w-full'}>
              <SelectItem value='0'>Today</SelectItem>
              <SelectItem value='1'>Tomorrow</SelectItem>
              <SelectItem value='3'>In 3 days</SelectItem>
              <SelectItem value='7'>In a week</SelectItem>
            </SelectContent>
          </Select>
          <div className='rounded-md border'>
            <Calendar
              autoFocus
              mode='range'
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
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
//     <div className={cn('grid gap-2 w-full flex-1', className)}>
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
//         <PopoverContent className='w-auto p-0' align='end'>
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
