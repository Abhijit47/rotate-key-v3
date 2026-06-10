import { zodResolver } from '@hookform/resolvers/zod';
import { RotateCcwKey } from 'lucide-react';
import { useState } from 'react';
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { toast } from 'sonner';
import { useChatContext } from 'stream-chat-react';
import z from 'zod';

import { Rating, RatingButton } from '@/components/extends/rating';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { useCustomChatContext } from '@/contexts/chat-context';
import { isPropertyDocumentAttachment } from '@/features/chat/utils/chat';
import { cn } from '@/lib/utils';

const reviewFormSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.email({ message: 'Invalid email address.' }),
  propertyCondition: z
    .number()
    .min(1, 'Property condition must be at least 1')
    .max(10, 'Property condition must be at most 10'),
  communicationWithOwner: z
    .number()
    .min(1, 'Communication with owner must be at least 1')
    .max(10, 'Communication with owner must be at most 10'),
  locationAccessibility: z
    .number()
    .min(1, 'Location accessibility must be at least 1')
    .max(10, 'Location accessibility must be at most 10'),
  amenitiesFacilities: z
    .number()
    .min(1, 'Amenities facilities must be at least 1')
    .max(10, 'Amenities facilities must be at most 10'),
  overallExperience: z
    .number()
    .min(1, 'Overall experience must be at least 1')
    .max(10, 'Overall experience must be at most 10'),
  reason: z
    .string()
    .min(10, { message: 'Reason must be at least 10 characters.' })
    .max(500, { message: 'Reason must be at most 500 characters.' }),
});

type ReviewFormData = z.infer<typeof reviewFormSchema>;

export function UnSwapDialog() {
  const { client, channel } = useChatContext();

  const { user } = useCustomChatContext();
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // const hasDocumentMessageFromCurrentUser = channel?.state.messages.some(
  //   (msg) => {
  //     const sentByCurrentUser = msg?.user?.id === client.userID;
  //     const hasDocumentAttachment = msg.attachments?.some(
  //       (att) => att.type === "file" && !!att.asset_url,
  //     );

  //     return sentByCurrentUser && hasDocumentAttachment;
  //   },
  // );
  const hasDocumentMessageFromCurrentUser = channel?.state.messages.some(
    (msg) => {
      const sentByCurrentUser = msg?.user?.id === client.userID;
      const hasDocumentAttachment = msg.attachments?.some(
        (att) => isPropertyDocumentAttachment(att), // Use the helper function to check if the attachment is a property document
      );

      return sentByCurrentUser && hasDocumentAttachment;
    },
  );

  const shouldEnable =
    user.isPropertyDocumentUploaded && hasDocumentMessageFromCurrentUser;

  return (
    <Dialog open={isFeedbackModalOpen} onOpenChange={setIsFeedbackModalOpen}>
      <DialogTrigger asChild>
        <Button
          variant={'destructive'}
          size={'sm'}
          className={'text-sm!'}
          disabled={!shouldEnable}>
          <RotateCcwKey className={'size-4'} /> UnSwap
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-100'>
        <DialogHeader>
          <DialogTitle>Why you change your mind? 😢</DialogTitle>
          <DialogDescription>
            Why do you want to un-swap this property? Please provide a reason.
            We will review your request and take appropriate action.
          </DialogDescription>
        </DialogHeader>

        <ReviewForm />
      </DialogContent>
    </Dialog>
  );
}

function ReviewForm() {
  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      fullName: 'Alan Turing',
      email: 'alanturing@gmail.com',
      propertyCondition: 0,
      communicationWithOwner: 0,
      locationAccessibility: 0,
      amenitiesFacilities: 0,
      overallExperience: 0,
      reason: 'your reason here',
    },
    mode: 'onChange',
  });

  const onError: SubmitErrorHandler<ReviewFormData> = (errors) => {
    Object.entries(errors).forEach(([key, value]) => {
      toast.error(`${key}: ${value.message}`);
    });
  };

  const onSubmit: SubmitHandler<ReviewFormData> = (values) => {
    toast.success('Implement Soon:', {
      description: (
        <pre className='mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 font-mono! text-code-foreground'>
          <code className='font-mono'>{JSON.stringify(values, null, 2)}</code>
        </pre>
      ),
      position: 'bottom-right',
      classNames: {
        content: 'flex flex-col gap-2 font-mono!',
      },
      style: {
        '--border-radius': 'calc(var(--radius)  + 4px)',
      } as React.CSSProperties,
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit, onError)} className='space-y-4'>
      <ScrollArea className='max-h-96 h-full pr-4'>
        <FieldGroup className='gap-3'>
          <FieldSet className='gap-3'>
            <Controller
              name='fullName'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  aria-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <Input
                    id={field.name}
                    placeholder='Alan Turing'
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name='email'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  aria-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    id={field.name}
                    placeholder='someone@gmail.com'
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name='propertyCondition'
              control={form.control}
              render={({ field, fieldState, formState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  aria-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Property Condition
                  </FieldLabel>
                  <Rating
                    className={'text-primary'}
                    defaultValue={field.value}
                    onValueChange={field.onChange}>
                    {Array.from({ length: 10 }).map((_, index) => (
                      <RatingButton
                        id={field.name}
                        key={index}
                        index={index}
                        {...field}
                        className={cn(
                          'text-primary',
                          fieldState?.error && 'text-destructive',
                        )}
                      />
                    ))}
                  </Rating>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name='communicationWithOwner'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  aria-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Communication with Owner
                  </FieldLabel>
                  <Rating
                    className={'text-primary'}
                    defaultValue={field.value}
                    onValueChange={field.onChange}>
                    {Array.from({ length: 10 }).map((_, index) => (
                      <RatingButton
                        id={field.name}
                        key={index}
                        index={index}
                        {...field}
                        className={cn(
                          'text-primary',
                          fieldState?.error && 'text-destructive',
                        )}
                      />
                    ))}
                  </Rating>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name='locationAccessibility'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  aria-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Location & Accessibility
                  </FieldLabel>
                  <Rating
                    className={'text-primary'}
                    defaultValue={field.value}
                    onValueChange={field.onChange}>
                    {Array.from({ length: 10 }).map((_, index) => (
                      <RatingButton
                        id={field.name}
                        key={index}
                        index={index}
                        {...field}
                        className={cn(
                          'text-primary',
                          fieldState?.error && 'text-destructive',
                        )}
                      />
                    ))}
                  </Rating>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name='amenitiesFacilities'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  aria-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Amenities & Facilities
                  </FieldLabel>
                  <Rating
                    className={'text-primary'}
                    defaultValue={field.value}
                    onValueChange={field.onChange}>
                    {Array.from({ length: 10 }).map((_, index) => (
                      <RatingButton
                        id={field.name}
                        key={index}
                        index={index}
                        {...field}
                        className={cn(
                          'text-primary',
                          fieldState?.error && 'text-destructive',
                        )}
                      />
                    ))}
                  </Rating>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name='overallExperience'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  aria-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Overall Experience
                  </FieldLabel>
                  <Rating
                    className={'text-primary'}
                    defaultValue={field.value}
                    onValueChange={field.onChange}>
                    {Array.from({ length: 10 }).map((_, index) => (
                      <RatingButton
                        id={field.name}
                        key={index}
                        index={index}
                        {...field}
                        className={cn(
                          'text-primary',
                          fieldState?.error && 'text-destructive',
                        )}
                      />
                    ))}
                  </Rating>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            <Controller
              name='reason'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  aria-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Reason</FieldLabel>
                  <Textarea
                    id={field.name}
                    placeholder='Add any additional reason'
                    className='resize-none min-h-37.5'
                    {...field}
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </FieldSet>
        </FieldGroup>
      </ScrollArea>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant='outline' type='button'>
            Cancel
          </Button>
        </DialogClose>
        <Button type='submit' variant={'destructive'}>
          Un Swap
        </Button>
      </DialogFooter>
    </form>
  );
}
