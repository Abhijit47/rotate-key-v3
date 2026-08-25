'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { MessageCircleQuestion } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  newsLetterFormSchema,
  NewsLetterFormValues,
} from '@/lib/validators/newsletter-schema';

export default function NewsLetterForm() {
  // 1. Define your form.
  const form = useForm<NewsLetterFormValues>({
    resolver: zodResolver(newsLetterFormSchema),
    defaultValues: {
      email: '',
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: NewsLetterFormValues) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your email</FormLabel>
              <FormControl>
                <Input
                  type='email'
                  className={'rounded-full w-full'}
                  placeholder='someone@example.com'
                  {...field}
                />
              </FormControl>
              {form.formState.errors ? (
                <FormMessage />
              ) : (
                <FormDescription className={'text-xs'}>
                  We will send you an email when we have news about our project.
                </FormDescription>
              )}
            </FormItem>
          )}
        />
        <Button
          size={'sm'}
          type='submit'
          className={'cursor-pointer rounded-full'}>
          {' '}
          Let&apos;s Talk <MessageCircleQuestion className={'size-4'} />
        </Button>
      </form>
    </Form>
  );
}
