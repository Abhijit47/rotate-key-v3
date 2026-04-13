'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { IconPhoto, IconRefresh } from '@tabler/icons-react';
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  useWatch,
} from 'react-hook-form';
import { toast } from 'sonner';

import {
  propertySchema,
  PropertyValues,
} from '@/lib/validators/property-schema';

import { MultiSelect } from '@/components/extends/multi-select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useUpgradeModal } from '@/features/common/hooks/use-upgrade-modal';
import { TRPCClientError } from '@trpc/client';
import { useCreateProperty, useTestPremium } from '../hooks/use-property';

const propertyTypes = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'House' },
  { value: 'condo', label: 'Condo' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'villa', label: 'Villa' },
  { value: 'cabin', label: 'Cabin' },
  { value: 'bungalow', label: 'Bungalow' },
  { value: 'loft', label: 'Loft' },
  { value: 'studio', label: 'Studio' },
  { value: 'duplex', label: 'Duplex' },
];

const images = [
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1592595896616-c37162298647?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1434082033009-b81d41d32e1c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
];

function getRandomImages(count: number) {
  const shuffled = [...images].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const amenitiesOptions = [
  { value: 'wifi', label: 'Wi-Fi' },
  { value: 'air-conditioning', label: 'Air Conditioning' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'washer', label: 'Washer' },
  { value: 'dryer', label: 'Dryer' },
  { value: 'free-parking', label: 'Free Parking' },
  { value: 'pool', label: 'Pool' },
  { value: 'hot-tub', label: 'Hot Tub' },
  { value: 'gym', label: 'Gym' },
  { value: 'pet-friendly', label: 'Pet Friendly' },
  { value: 'wheelchair-accessible', label: 'Wheelchair Accessible' },
  { value: 'breakfast-included', label: 'Breakfast Included' },
];

// function getRandomAmenities(count: number) {
//   const shuffled = amenitiesOptions.sort(() => 0.5 - Math.random());
//   return shuffled.slice(0, count);
// }

export default function NewPropertyForm() {
  const form = useForm<PropertyValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      type: '',
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      images: undefined,
      amenities: undefined,
    },
    mode: 'onChange',
  });
  const { handleError, modal } = useUpgradeModal();
  const watchAll = useWatch({ control: form.control });

  const { mutateAsync, isPending } = useCreateProperty();
  // TODO: this is just for testing, will remove later, we can use this to gate any premium features in the future
  const { mutateAsync: testMutate } = useTestPremium();

  const onError: SubmitErrorHandler<PropertyValues> = (errors) => {
    console.error({ errors });
    Object.entries(errors).forEach(([field, error]) => {
      // console.error(`Error in field ${field}: ${error.message}`);
      toast.error(`Error in field ${field}`, {
        description: `${error.message}`,
      });
    });
  };

  const onSubmit: SubmitHandler<PropertyValues> = (data) => {
    // console.log({ data });
    toast.promise(mutateAsync(data), {
      loading: 'Creating property...',
      success: () => {
        form.reset();
        return 'Property created successfully';
      },
      error: (err) => {
        if (err instanceof TRPCClientError) {
          handleError(err);
        }
        return err.message || 'Failed to create property';
      },
    });
  };

  return (
    <div className={'relative'}>
      {modal}
      <div className='w-full max-w-lg mx-auto py-6'>
        <form onSubmit={form.handleSubmit(onSubmit, onError)}>
          <FieldGroup className={'gap-4'}>
            <FieldSet className={'gap-4'} disabled={isPending}>
              <FieldLegend>New Property</FieldLegend>
              <FieldDescription>
                Fill in the details of your property to create a new listing
              </FieldDescription>
              <FieldGroup className={'gap-4'}>
                <Controller
                  name='type'
                  control={form.control}
                  render={({ field }) => (
                    <Field className={'gap-2'}>
                      <FieldLabel htmlFor='property-type'>
                        Property Type
                      </FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}>
                        <SelectTrigger className='w-full max-w-full'>
                          <SelectValue placeholder='Select property type...' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Available types</SelectLabel>
                            {propertyTypes.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />

                <Controller
                  name='streetAddress'
                  control={form.control}
                  render={({ field }) => (
                    <Field className={'gap-2'}>
                      <FieldLabel htmlFor='property-street-address'>
                        Street Address
                      </FieldLabel>
                      <Input
                        id='property-street-address'
                        placeholder='e.g., 123 Main St'
                        {...field}
                      />
                      <FieldDescription className={'text-xs'}>
                        The street address of your property, including house
                        number and street name
                      </FieldDescription>
                    </Field>
                  )}
                />

                <Controller
                  name='city'
                  control={form.control}
                  render={({ field }) => (
                    <Field className={'gap-2'}>
                      <FieldLabel htmlFor='property-city'>City</FieldLabel>
                      <Input
                        id='property-city'
                        placeholder='e.g., New York'
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </Field>
                  )}
                />

                <Controller
                  name='state'
                  control={form.control}
                  render={({ field }) => (
                    <Field className={'gap-2'}>
                      <FieldLabel htmlFor='property-state'>State</FieldLabel>
                      <Input
                        id='property-state'
                        placeholder='e.g., NY'
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </Field>
                  )}
                />

                <Controller
                  name='zipCode'
                  control={form.control}
                  render={({ field }) => (
                    <Field className={'gap-2'}>
                      <FieldLabel htmlFor='property-zipcode'>
                        Zipcode
                      </FieldLabel>
                      <Input
                        id='property-zipcode'
                        placeholder='e.g., 10001'
                        value={field.value ?? ''}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </Field>
                  )}
                />

                <Controller
                  name='images'
                  control={form.control}
                  render={({ field }) => (
                    <Field className={'gap-2'}>
                      <FieldLabel htmlFor='property-images'>Images</FieldLabel>
                      <FieldDescription className={'text-xs'}>
                        Add image URLs of your property. You can add multiple
                        images to showcase different views and features of your
                        property.
                      </FieldDescription>
                      <InputGroup>
                        <InputGroupTextarea
                          id='textarea-code-32'
                          placeholder='Enter image URLs, one per line'
                          className='min-h-50'
                          // {...field}

                          value={field.value?.join('\n') ?? ''}
                          onChange={(e) => {
                            const urls = e.target.value
                              .split('\n')
                              .map((url) => url.trim())
                              .filter(Boolean);
                            field.onChange(urls);
                          }}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                        <InputGroupAddon align='block-end' className='border-t'>
                          <InputGroupText>
                            {field.value?.length ?? 0} images
                          </InputGroupText>
                        </InputGroupAddon>
                        <InputGroupAddon
                          align='block-start'
                          className='border-b'>
                          <InputGroupText className='font-sans font-medium'>
                            <IconPhoto />
                            Add Images
                          </InputGroupText>
                          <InputGroupButton
                            className='ml-auto'
                            size='icon-xs'
                            type='button'
                            onClick={() => {
                              const randomImages = getRandomImages(3);
                              field.onChange(randomImages);
                            }}>
                            <IconRefresh />
                          </InputGroupButton>
                        </InputGroupAddon>
                      </InputGroup>
                    </Field>
                  )}
                />

                <Controller
                  name='amenities'
                  control={form.control}
                  render={({ field }) => (
                    <Field className={'gap-2'}>
                      <FieldLabel htmlFor='property-amenities'>
                        Amenities
                      </FieldLabel>
                      <MultiSelect
                        options={amenitiesOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder='Choose amenities...'
                        // autoSize={true}
                        singleLine={true}
                        animation={0}
                      />
                    </Field>
                  )}
                />

                <Field className={'gap-2'}>
                  <FieldLabel htmlFor='property-description'>
                    Description
                  </FieldLabel>
                  <Textarea
                    id='property-description'
                    placeholder='Write a detailed description of your property, including its unique features and nearby attractions.'
                    className='resize-none placeholder:text-xs'
                  />
                </Field>

                <Field orientation='horizontal' className={'gap-2 items-start'}>
                  <Checkbox id='accept-terms' defaultChecked />
                  <FieldLabel
                    htmlFor='accept-terms'
                    className='font-normal text-xs'>
                    I confirm that the information provided is accurate and I
                    agree to the terms and conditions of listing my property on
                    RotateKey.
                  </FieldLabel>
                </Field>
              </FieldGroup>
            </FieldSet>
            <FieldSeparator />

            <Field orientation='horizontal' className={'justify-end gap-2'}>
              {/* TODO: this is just for testing, will remove later, we can use this to gate any premium features in the future */}
              <Button
                type='button'
                onClick={() => {
                  toast.promise(testMutate(), {
                    loading: 'Testing premium access...',
                    success: (data) => {
                      console.log('Premium test result:', data);
                      return data.message;
                    },
                    error: (err) => {
                      console.error('Premium test error:', err);
                      if (err instanceof TRPCClientError) {
                        handleError(err);
                      }
                      return err.message;
                    },
                  });
                }}>
                Test Premium
              </Button>

              <Button
                variant='outline'
                type='button'
                onClick={() => form.reset()}>
                Cancel
              </Button>
              <Button type='submit'>Create Property</Button>
            </Field>
          </FieldGroup>
        </form>
      </div>

      <div className={'absolute top-0 right-0 w-96 h-96'}>
        <h2 className='text-lg font-semibold mb-2'>Preview</h2>
        <pre className='bg-gray-100 p-4 rounded-md overflow-x-auto text-xs font-sans'>
          {JSON.stringify(watchAll, null, 2)}
        </pre>
      </div>
    </div>
  );
}
