import { addDays, format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const isDev = process.env.NODE_ENV === 'development' ? true : false;

export default function MoveInAndOutFilter() {
  const today = new Date();
  const thirtyDaysFromNow = addDays(today, 30);

  const [startDate, setStartDate] = useState<Date | undefined>(
    isDev ? today : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    isDev ? thirtyDaysFromNow : undefined
  );

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
                'w-full pl-3 text-left font-normal',
                !startDate && 'text-muted-foreground'
              )}>
              {startDate ? format(startDate, 'PPP') : <span>Pick a date</span>}
              <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='start'>
            <Calendar
              autoFocus
              mode='single'
              defaultMonth={new Date()}
              selected={startDate}
              onSelect={setStartDate}
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
                'w-full pl-3 text-left font-normal',
                !endDate && 'text-muted-foreground'
              )}>
              {endDate ? format(endDate, 'PPP') : <span>Pick a date</span>}
              <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-auto p-0' align='end'>
            <Calendar
              autoFocus
              mode='single'
              defaultMonth={new Date()}
              selected={endDate}
              onSelect={setEndDate}
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
