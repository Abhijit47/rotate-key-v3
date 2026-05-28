'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { InfoIcon, MessageCircle, VideoIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  useWatch,
} from 'react-hook-form';
import { toast } from 'sonner';

import { Card, CardContent } from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Item, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item';
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useCreateBooking } from '@/features/booking/hooks/use-booking';
import { useProperty } from '@/features/property/hooks/use-property';
import {
  bookingFormSchema,
  BookingValues,
  stringToDate,
} from '@/lib/validators/booking-schemas';

const toDate = (value?: string | null) => {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const decodeDate = (value: string | undefined) => {
  if (!value) return undefined;
  try {
    return stringToDate.decode(value);
  } catch {
    return undefined;
  }
};

export default function BookingForm() {
  const [isGettingInOpen, setIsGettingInOpen] = useState(false);
  const [isGettingOutOpen, setIsGettingOutOpen] = useState(false);
  const params = useParams<{ id: string }>();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: property } = useProperty(params.id);
  const { mutateAsync, isPending } = useCreateBooking();

  const form = useForm<BookingValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      propertyId: params.id,
      startDate: toDate(property?.bookDetailsWithCurrentUser?.startDate),
      endDate: toDate(property?.bookDetailsWithCurrentUser?.endDate),
      guestCount: property.bookDetailsWithCurrentUser?.guestCount || '0',
    },
    mode: 'onChange',
  });

  const watchedValues = useWatch({
    control: form.control,
    name: ['startDate', 'endDate', 'guestCount'],
  });

  const gettingIn = watchedValues[0];
  const gettingOut = watchedValues[1];
  const guestCount = watchedValues[2];

  const onError: SubmitErrorHandler<BookingValues> = (errors) => {
    console.log('Form errors:', errors);
  };

  const onSubmit: SubmitHandler<BookingValues> = (values) => {
    // console.log('Form submitted with data:', values);

    if (!values.startDate || !values.endDate || values.guestCount === '0') {
      form.setError('startDate', {
        type: 'manual',
        message: 'Please select valid dates',
      });
      form.setError('endDate', {
        type: 'manual',
        message: 'Please select valid dates',
      });
      form.setError('guestCount', {
        type: 'manual',
        message: 'Please select at least 1 guest',
      });
      return;
    }

    toast.promise(mutateAsync(values), {
      loading: 'Creating booking...',
      description: 'This may take a moment.',
      descriptionClassName: 'text-[10px]',
      success: (data) => {
        return `Booking created successfully! with status: ${data.status}`;
      },
      error: (err) => {
        console.error('Error creating booking:', err);
        return err.message;
      },
    });
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit, onError)}>
          <FieldSet disabled={isPending}>
            <FieldLegend className={'sr-only'}>Booking Form</FieldLegend>

            <FieldDescription className={'sr-only'}>
              Both hosts need to be liked mutually in order to contact
            </FieldDescription>

            <FieldGroup className={'gap-3'}>
              <div>
                <div className={'grid grid-cols-1 md:grid-cols-2'}>
                  <Controller
                    name='startDate'
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Popover
                        open={isGettingInOpen}
                        onOpenChange={setIsGettingInOpen}>
                        <PopoverTrigger
                          asChild
                          data-invalid={fieldState.invalid}
                          aria-invalid={fieldState.invalid}>
                          <Button
                            type='button'
                            size={'sm'}
                            variant='outline'
                            disabled={property.isBookedByMe}
                            className={
                              'flex-col h-10 w-full border-r-0 rounded-r-none border-b-0 rounded-b-none gap-0 bg-transparent'
                            }>
                            <span>GETTING-IN</span>
                            <span className={'text-xs'}>
                              {gettingIn
                                ? format(gettingIn, 'dd/MM/yyyy')
                                : 'DD/MM/YYYY'}
                            </span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align='start'>
                          <PopoverHeader>
                            <PopoverTitle>GETTING-IN</PopoverTitle>

                            <Calendar
                              mode='single'
                              className='w-full'
                              onSelect={(date) => {
                                if (!date) {
                                  form.setError('startDate', {
                                    type: 'manual',
                                    message: 'Please select a valid date',
                                  });
                                  return;
                                }
                                field.onChange(date);
                                setIsGettingInOpen(false);
                              }}
                              selected={gettingIn}
                              disabled={(date) =>
                                //disable past dates
                                date < today || property.isBookedByMe
                              }
                            />
                          </PopoverHeader>
                        </PopoverContent>
                      </Popover>
                    )}
                  />

                  <Controller
                    name='endDate'
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Popover
                        open={isGettingOutOpen}
                        onOpenChange={setIsGettingOutOpen}>
                        <PopoverTrigger
                          asChild
                          data-invalid={fieldState.invalid}
                          aria-invalid={fieldState.invalid}>
                          <Button
                            type='button'
                            size={'sm'}
                            variant='outline'
                            disabled={property.isBookedByMe}
                            className={
                              'flex-col h-10 border-l-0 rounded-l-none w-full border-b-0 rounded-b-none gap-0 bg-transparent'
                            }>
                            <span>GETTING-OUT</span>
                            <span className={'text-xs'}>
                              {gettingOut
                                ? format(gettingOut, 'dd/MM/yyyy')
                                : 'DD/MM/YYYY'}
                            </span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align='end'>
                          <PopoverHeader>
                            <PopoverTitle>GETTING-OUT</PopoverTitle>

                            <Calendar
                              mode='single'
                              className='w-full'
                              onSelect={(date) => {
                                if (!date) {
                                  form.setError('endDate', {
                                    type: 'manual',
                                    message: 'Please select a valid date',
                                  });
                                  return;
                                }
                                field.onChange(date);
                                setIsGettingOutOpen(false);
                              }}
                              selected={gettingOut}
                              disabled={(date) =>
                                // disable past dates and dates before getting-in date
                                date < today ||
                                (gettingIn ? date <= gettingIn : false) ||
                                property.isBookedByMe
                              }
                            />
                          </PopoverHeader>
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                </div>

                <Controller
                  name='guestCount'
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      className='w-full'
                      aria-invalid={fieldState.invalid}
                      data-invalid={fieldState.invalid}>
                      <FieldLabel className={'sr-only'}>Guest</FieldLabel>
                      <Select
                        data-invalid={fieldState.invalid}
                        aria-invalid={fieldState.invalid}
                        disabled={property.isBookedByMe}
                        onValueChange={(value) => {
                          if (value === '0') {
                            form.setError('guestCount', {
                              type: 'manual',
                              message: 'Please select at least 1 guest',
                            });
                            return;
                          }
                          field.onChange(value);
                        }}
                        value={field.value}>
                        <SelectTrigger
                          data-invalid={fieldState.invalid}
                          aria-invalid={fieldState.invalid}
                          className={'border-t-0 rounded-t-none'}>
                          <SelectValue
                            className={'w-full'}
                            placeholder='Select number of guests'>
                            {guestCount === '1'
                              ? `${guestCount} Guest`
                              : `${guestCount} Guest(s)`}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className={'w-full'} align='start'>
                          <SelectGroup>
                            {Array.from({ length: 10 }, (_, i) => (
                              <SelectItem
                                key={i + 1}
                                value={(i + 1).toString()}>
                                {i + 1} Guest{i + 1 > 1 ? 's' : ''}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {fieldState.error && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              {property.isBookedByMe ? (
                <>
                  <Button type='button' className={'w-full'} asChild>
                    <Link href='/chat'>
                      <MessageCircle className={'size-4'} />
                      Go to Messages
                    </Link>
                  </Button>

                  <Button
                    type='button'
                    className={'w-full'}
                    variant={'outline'}
                    onClick={() => {
                      toast.info('Feature not implemented yet!!!', {
                        position: 'bottom-right',
                      });
                    }}>
                    <VideoIcon className={'size-4'} />
                    Request a Virtual Tour
                  </Button>
                </>
              ) : (
                <>
                  <Button type='submit' className={'w-full'}>
                    <MessageCircle className={'size-4'} />
                    Message
                  </Button>

                  <Button
                    type='button'
                    className={'w-full'}
                    variant={'outline'}
                    onClick={() => {
                      toast.info('Feature not implemented yet!!!', {
                        position: 'bottom-right',
                      });
                    }}>
                    <VideoIcon className={'size-4'} />
                    Request a Virtual Tour
                  </Button>
                </>
              )}
            </FieldGroup>

            <Item variant='outline' size='sm'>
              <ItemMedia>
                <InfoIcon className={'size-4'} />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>
                  Both hosts need to be liked mutually in order to contact
                </ItemTitle>
              </ItemContent>
            </Item>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  );
}
