'use client';

import { Button } from '@/components/ui/button';
import {
  Field,
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
  InputGroupInput,
} from '@/components/ui/input-group';
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
import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const confidentialInformationForm = z.object({
  yearOfBirth: z.string().min(4, 'Year of birth must be 4 digits'),
  contactNumber: z
    .string()
    .min(10, 'Contact number must be at least 10 digits'),
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z
    .string()
    .min(8, 'Confirm password must be at least 8 characters'),
  document: z.string(),
});

type ConfidentialInformationValues = z.infer<
  typeof confidentialInformationForm
>;

export default function ConfidentialForm() {
  const form = useForm<ConfidentialInformationValues>({
    resolver: zodResolver(confidentialInformationForm),
    defaultValues: {
      yearOfBirth: '',
      contactNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
      document: '',
    },
  });

  const onError: SubmitErrorHandler<ConfidentialInformationValues> = (
    errors,
  ) => {
    // console.log('Form errors:', errors);
    Object.keys(errors).forEach((field) => {
      const error = errors[field as keyof ConfidentialInformationValues];
      if (error) {
        toast.error(error.message);
      }
    });
  };

  const onSubmit: SubmitHandler<ConfidentialInformationValues> = (data) => {
    console.log('Form data:', data);
    toast.success('Personal information saved successfully!');
  };

  return (
    <div className=''>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className='w-full h-full'>
        <FieldSet className={'gap-3'}>
          <FieldLegend>Confidential Information</FieldLegend>
          <FieldSeparator />

          <div className='grid grid-cols-2 gap-4'>
            <Field>
              <FieldLabel htmlFor='yearOfBirth'>Year of Birth</FieldLabel>
              <Select defaultValue=''>
                <SelectTrigger id='yearOfBirth'>
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

            <Field>
              <FieldLabel htmlFor='contactNumber'>Contact Number</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id='contactNumber'
                  placeholder='+1 234 567 890'
                  type='tel'
                />
                <InputGroupAddon align='inline-end'>
                  <InputGroupButton variant='outline' type='button'>
                    Verify
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor='email'>Email</FieldLabel>
            <Input id='email' placeholder='someone@gmail.com' type='email' />
          </Field>

          <div className='grid grid-cols-2 gap-4'>
            <Field>
              <FieldLabel htmlFor='password'>Password</FieldLabel>
              <Input id='password' placeholder='********' type='password' />
            </Field>

            <Field>
              <FieldLabel htmlFor='confirmPassword'>
                Confirm Password
              </FieldLabel>
              <Input
                id='confirmPassword'
                placeholder='********'
                type='password'
              />
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor='checkout-7j9-optional-comments'>
              Upload Document{' '}
              <span className={'text-xs'}>(for profile verification)</span>
            </FieldLabel>
            <Textarea
              id='checkout-7j9-optional-comments'
              placeholder='Add any additional comments'
              className='resize-none'
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
