'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconTrashX, IconUpload } from '@tabler/icons-react';
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const personalInformationForm = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  languagePreference: z
    .array(z.string())
    .min(1, 'Select at least one language'),
  country: z.string().min(1, 'Country is required'),
  about: z.string().max(500, 'About me must be less than 500 characters'),
});

type PersonalInformationValues = z.infer<typeof personalInformationForm>;

export default function PersonalInformationForm() {
  const form = useForm<PersonalInformationValues>({
    resolver: zodResolver(personalInformationForm),
    defaultValues: {
      firstName: '',
      lastName: '',
      languagePreference: [],
      country: '',
      about: '',
    },
  });

  const onError: SubmitErrorHandler<PersonalInformationValues> = (errors) => {
    // console.log('Form errors:', errors);
    Object.keys(errors).forEach((field) => {
      const error = errors[field as keyof PersonalInformationValues];
      if (error) {
        toast.error(error.message);
      }
    });
  };

  const onSubmit: SubmitHandler<PersonalInformationValues> = (data) => {
    console.log('Form data:', data);
    toast.success('Personal information saved successfully!');
  };

  return (
    <div className='w-full h-full'>
      <form onSubmit={form.handleSubmit(onSubmit, onError)}>
        <FieldSet className={'gap-3'}>
          <FieldLegend>Personal Information</FieldLegend>
          <FieldSeparator />

          <FieldGroup className={'grid grid-cols-2 gap-4'}>
            <div className={'flex items-center justify-center gap-6'}>
              <div className={'size-30'}>
                <Avatar className={'w-full h-full rounded-full'}>
                  <AvatarImage
                    src='https://github.com/shadcn.png'
                    className={'w-full h-full rounded-full '}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>

              <div className={'flex flex-col gap-4'}>
                <Button variant='outline' size={'sm'} type='button'>
                  <IconUpload className='size-4' />
                  Edit or Upload
                </Button>
                <Button variant='outline' size={'sm'} type='button'>
                  <IconTrashX className='size-4' />
                  Remove
                </Button>
              </div>
            </div>

            <FieldGroup className={'gap-2'}>
              <Field>
                <FieldLabel htmlFor='firstName'>First Name</FieldLabel>
                <Input id='firstName' placeholder='Evil' required />
              </Field>
              <Field>
                <FieldLabel htmlFor='lastName'>Last Name</FieldLabel>
                <Input id='lastName' placeholder='Rabbit' required />
              </Field>
            </FieldGroup>
          </FieldGroup>

          <div className='grid grid-cols-2 gap-4'>
            <Field>
              <FieldLabel htmlFor='checkout-exp-month-ts6'>
                Language Preference
              </FieldLabel>
              <Select defaultValue=''>
                <SelectTrigger id='checkout-exp-month-ts6'>
                  <SelectValue placeholder='MM' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value='01'>01</SelectItem>
                    <SelectItem value='02'>02</SelectItem>
                    <SelectItem value='03'>03</SelectItem>
                    <SelectItem value='04'>04</SelectItem>
                    <SelectItem value='05'>05</SelectItem>
                    <SelectItem value='06'>06</SelectItem>
                    <SelectItem value='07'>07</SelectItem>
                    <SelectItem value='08'>08</SelectItem>
                    <SelectItem value='09'>09</SelectItem>
                    <SelectItem value='10'>10</SelectItem>
                    <SelectItem value='11'>11</SelectItem>
                    <SelectItem value='12'>12</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor='checkout-7j9-exp-year-f59'>
                Country
              </FieldLabel>
              <Select defaultValue=''>
                <SelectTrigger id='checkout-7j9-exp-year-f59'>
                  <SelectValue placeholder='YYYY' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value='2024'>2024</SelectItem>
                    <SelectItem value='2025'>2025</SelectItem>
                    <SelectItem value='2026'>2026</SelectItem>
                    <SelectItem value='2027'>2027</SelectItem>
                    <SelectItem value='2028'>2028</SelectItem>
                    <SelectItem value='2029'>2029</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor='about'>About me</FieldLabel>
            <Textarea
              id='about'
              placeholder='Write a short description about yourself...'
              className='resize-none min-h-30'
            />
          </Field>
          <FieldSeparator />

          <Field orientation='horizontal' className='justify-end gap-2'>
            <Button type='submit' size={'sm'}>
              Save
            </Button>
            <Button variant='outline' type='button' size={'sm'}>
              Cancel
            </Button>
          </Field>
        </FieldSet>
      </form>
    </div>
  );
}
