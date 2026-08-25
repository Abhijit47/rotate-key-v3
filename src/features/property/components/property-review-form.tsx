'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Sparkles } from 'lucide-react';
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  propertyReviewFormSchema,
  PropertyReviewFormValues,
} from '@/lib/validators/property-review-schemas';

export default function PropertyReviewForm({
  propertyId,
}: {
  propertyId: string;
}) {
  const form = useForm<PropertyReviewFormValues>({
    resolver: zodResolver(propertyReviewFormSchema),
    defaultValues: {
      title: 'test title',
      rating: 1,
      description: 'test description for the review form for testing purposes',
    },
  });

  const onError: SubmitErrorHandler<PropertyReviewFormValues> = (errors, e) => {
    e?.preventDefault();
    e?.stopPropagation();

    console.log('ReviewForm errors:', JSON.stringify(errors, null, 2));
    Object.entries(errors).forEach(([key, value]) => {
      // console.log(key, value);
      toast.error(`${key} - ${value?.message}`);
      return;
    });
    return;
  };

  const onSubmit: SubmitHandler<PropertyReviewFormValues> = (values, e) => {
    e?.preventDefault();
    e?.stopPropagation();

    toast('submitting values:', {
      description: (
        <pre className='mt-2 p-4 rounded-md w-[320px] h-72 overflow-y-auto font-mono text-wrap'>
          <code className={'font-serif'}>
            {JSON.stringify(values, null, 2)}
          </code>
        </pre>
      ),
      // position: 'bottom-right',
      // classNames: {
      //   content: 'flex flex-col gap-2',
      // },
      // style: {
      //   '--border-radius': 'calc(var(--radius)  + 4px)',
      // } as React.CSSProperties,
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit, onError)} className='space-y-8'>
      <Controller
        name='title'
        control={form.control}
        render={({ field, fieldState }) => (
          <Field
            data-invalid={fieldState.invalid}
            aria-invalid={fieldState.invalid}>
            <FieldLabel htmlFor='title'>Title</FieldLabel>
            <Input
              id='title'
              placeholder='shadcn'
              {...field}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.error ? (
              <FieldError errors={[fieldState.error]} />
            ) : null}
          </Field>
        )}
      />
      <Controller
        name='rating'
        control={form.control}
        render={({ field, fieldState }) => (
          <Field
            data-invalid={fieldState.invalid}
            aria-invalid={fieldState.invalid}>
            <FieldLabel htmlFor='rating'>Rating</FieldLabel>
            <Select value={String(field.value)} onValueChange={field.onChange}>
              <SelectTrigger
                className='w-full'
                id='rating'
                aria-invalid={fieldState.invalid}>
                <SelectValue placeholder='Rating' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='1'>
                  1 <Sparkles className={'stroke-yellow-400'} />
                </SelectItem>
                <SelectItem value='2'>
                  2
                  <span className={'inline-flex items-center gap-1'}>
                    <Sparkles className={'stroke-yellow-400'} />
                    <Sparkles className={'stroke-yellow-400'} />
                  </span>
                </SelectItem>
                <SelectItem value='3'>
                  3
                  <span className={'inline-flex items-center gap-1'}>
                    <Sparkles className={'stroke-yellow-400'} />
                    <Sparkles className={'stroke-yellow-400'} />
                    <Sparkles className={'stroke-yellow-400'} />
                  </span>
                </SelectItem>
                <SelectItem value='4'>
                  4
                  <span className={'inline-flex items-center gap-1'}>
                    <Sparkles className={'stroke-yellow-400'} />
                    <Sparkles className={'stroke-yellow-400'} />
                    <Sparkles className={'stroke-yellow-400'} />
                    <Sparkles className={'stroke-yellow-400'} />
                  </span>
                </SelectItem>
                <SelectItem value='5'>
                  5
                  <span className={'inline-flex items-center gap-1'}>
                    <Sparkles className={'stroke-yellow-400'} />
                    <Sparkles className={'stroke-yellow-400'} />
                    <Sparkles className={'stroke-yellow-400'} />
                    <Sparkles className={'stroke-yellow-400'} />
                    <Sparkles className={'stroke-yellow-400'} />
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>

            {fieldState.error ? (
              <FieldError errors={[fieldState.error]} />
            ) : null}
          </Field>
        )}
      />
      <Controller
        name='description'
        control={form.control}
        render={({ field, fieldState }) => (
          <Field
            data-invalid={fieldState.invalid}
            aria-invalid={fieldState.invalid}>
            <FieldLabel htmlFor='description'>Description</FieldLabel>
            <Textarea
              id='description'
              placeholder='Description'
              {...field}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.error ? (
              <FieldError errors={[fieldState.error]} />
            ) : null}
          </Field>
        )}
      />

      <Button type='submit' className={'w-full'}>
        Submit
      </Button>
    </form>
  );
}
