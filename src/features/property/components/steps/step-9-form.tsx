import { IconCalendarWeek } from '@tabler/icons-react';
import { addDays, differenceInCalendarDays, format } from 'date-fns';
import { enIN, type Locale } from 'date-fns/locale';
import { useLocale } from 'next-intl';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import {
  Controller,
  type SetValueConfig,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { toast } from 'sonner';
// import { getDefaultClassNames } from 'react-day-picker';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type WizardValues } from '@/lib/validators/property-schemas';

type PickedFormValues = Pick<
  WizardValues,
  'staysDateRange' | 'staysDurationInDays'
>;

export default function Step9Form() {
  const [isPopOverOpen, setIsPopOverOpen] = useState<boolean>(false);
  const [selectedLocale, setSelectedLocale] = useState<Locale>(() => {
    return enIN;
  });

  const today = new Date();
  const form = useFormContext<PickedFormValues>();

  const locale = useLocale();

  const watchedStaysDurationInDays = useWatch({
    name: 'staysDurationInDays',
    control: form.control,
    compute: (val) => {
      if (val) return val;
      return '0';
    },
  });

  function togglePopover() {
    setIsPopOverOpen((prev) => !prev);
  }
  return (
    <div>
      <Controller
        name='staysDateRange'
        control={form.control}
        render={({ field, fieldState }) => (
          <Field
            data-invalid={fieldState.invalid}
            aria-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>
              <span>Check-in and check-out</span>
              <small className='italic font-normal text-muted-foreground'>
                (Date range for check-in and check-out.)
              </small>
            </FieldLabel>

            <div className={cn('grid gap-2 w-full', 'className')}>
              <Popover open={isPopOverOpen} onOpenChange={setIsPopOverOpen}>
                <PopoverTrigger
                  name={field.name}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  asChild>
                  <Button
                    id={field.name}
                    variant={'outline'}
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !field.value && 'text-muted-foreground',
                    )}>
                    <IconCalendarWeek className='mr-2 h-4 w-4' />
                    {field.value.from ? (
                      field.value.to ? (
                        <span
                          className={
                            'w-full flex items-center justify-between'
                          }>
                          <span className={'block'}>
                            {format(field.value.from, 'LLL dd, y')} -{' '}
                            {format(field.value.to, 'LLL dd, y')}
                          </span>
                          <Badge className={'block text-xs'}>
                            ({watchedStaysDurationInDays} days)
                          </Badge>
                        </span>
                      ) : (
                        format(field.value.from, 'LLL dd, y')
                      )
                    ) : (
                      <span>Choose a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className='w-full p-0' align='center'>
                  <div className='rounded-md border'>
                    <Calendar
                      autoFocus
                      classNames={{ root: 'w-full md:min-w-2xl lg:min-w-3xl' }}
                      mode='range'
                      defaultMonth={today}
                      selected={field.value}
                      onSelect={(date) => {
                        // setDate(date);
                        if (!date) {
                          return toast.info('Select a start date!!!', {
                            duration: 2000,
                          });
                        }
                        field.onChange({ from: date.from, to: date.to });

                        if (date.from && date.to) {
                          if (
                            differenceInCalendarDays(date.to, date.from) < 1
                          ) {
                            return toast.error('Select a valid date range!!!', {
                              duration: 2000,
                            });
                          }
                        }

                        form.setValue(
                          'staysDurationInDays',
                          date.to && date.from
                            ? differenceInCalendarDays(
                                date.to,
                                date.from,
                              ).toString()
                            : '',
                        );
                      }}
                      numberOfMonths={2}
                      reverseMonths={false}
                      hidden={today}
                      modifiers={{
                        booked: [
                          new Date(2025, 5, 8),
                          new Date(2025, 5, 9),
                          new Date(2025, 5, 10),
                          {
                            from: new Date(2025, 5, 15),
                            to: new Date(2025, 5, 20),
                          },
                        ],
                        disabled: [
                          { before: new Date() },
                          // {
                          //   after: new Date(new Date().setDate(today.getDate() - 1)),
                          // },
                        ],
                      }}
                      lang={locale}
                      locale={enIN}
                      max={365}
                      min={1}
                      footer={<CalendarFooter togglePopover={togglePopover} />}
                      timeZone='Asia/Calcutta'
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <FieldDescription>
              Specify the date range for check-in and check-out. The duration of
              stay will be calculated based on the selected dates.
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {Object.keys(form.formState.errors.staysDateRange || {}).length > 0 && (
        <p className={'text-xs font-medium mt-2 text-destructive'}>
          Date range is required.
        </p>
      )}
    </div>
  );
}

function CalendarFooter({ togglePopover }: { togglePopover: () => void }) {
  const form = useFormContext<PickedFormValues>();
  const { systemTheme } = useTheme();

  const watchedStartDate = useWatch({
    name: 'staysDateRange.from',
    control: form.control,
    compute: (val) => {
      if (val) return val;
      return undefined;
    },
  });

  const watchedEndDate = useWatch({
    name: 'staysDateRange.to',
    control: form.control,
    compute: (val) => {
      if (val) return val;
      return undefined;
    },
  });

  // const today = new Date();
  const setValuesOptions: SetValueConfig = {
    shouldValidate: true,
    shouldDirty: true,
    shouldTouch: true,
  };

  function handleResetClick() {
    // setCheckin(undefined);
    form.setValue(
      'staysDateRange',
      {
        from: new Date(),
        to: addDays(new Date(), 30),
      },
      setValuesOptions,
    );
    form.setValue('staysDurationInDays', '', setValuesOptions);
    // setDefaultMonth(today);
    togglePopover();
  }

  let footer = (
    <div className={'space-y-2'}>
      <Separator />
      <p className={'text-sm text-center font-medium'}>
        Please pick one or more days.
      </p>
    </div>
  );

  if (watchedStartDate && watchedEndDate)
    footer = (
      <div>
        <Separator className={'my-2'} />
        <div className={'inline-flex items-center justify-center w-full gap-2'}>
          <Badge
            variant={systemTheme === 'dark' ? 'secondary' : 'default'}
            className={'text-xs font-medium'}>
            You selected{' '}
            {differenceInCalendarDays(
              // watch('staysDateRange').to,
              watchedEndDate,
              // watch('staysDateRange').from,
              watchedStartDate,
            )}{' '}
            days.
          </Badge>
          <Badge
            variant={'destructive'}
            className='cursor-pointer text-xs font-medium'
            onClick={handleResetClick}>
            Reset
          </Badge>
        </div>
      </div>
    );

  return footer;
}
