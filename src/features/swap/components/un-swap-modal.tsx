import { zodResolver } from '@hookform/resolvers/zod';
import { RotateCcwKey } from 'lucide-react';
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { toast } from 'sonner';
import { useChatContext } from 'stream-chat-react';

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
import { useCreateReview } from '@/features/reviews/hooks/use-review';
import { cn } from '@/lib/utils';
import {
  ReviewFormValues,
  reviewFormSchema,
} from '@/lib/validators/reviews-schema';
import { TRPCClientError } from '@trpc/client';

export function UnSwapDialog() {
  const { client, channel } = useChatContext();

  const { user, isUnSwapModalOpen, onUnSwapModal } = useCustomChatContext();
  // const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const reviewMutation = useCreateReview();
  const { isPending } = reviewMutation;

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
    user.isPropertyDocumentUploaded &&
    hasDocumentMessageFromCurrentUser &&
    !isPending;

  return (
    <Dialog
      open={isUnSwapModalOpen}
      onOpenChange={(open) => {
        // Prevent close during pending state
        if (!isPending) {
          onUnSwapModal(open);
        }
      }}>
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
        <ReviewForm reviewMutation={reviewMutation} />
      </DialogContent>
    </Dialog>
  );
}

const isDev = process.env.NODE_ENV === 'development';

function ReviewForm({
  reviewMutation,
}: {
  reviewMutation: ReturnType<typeof useCreateReview>;
}) {
  const { mutateAsync, isPending } = reviewMutation;
  const { onUnSwapModal } = useCustomChatContext();

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      fullName: isDev ? 'Alan Turing' : '',
      email: isDev ? 'alanturing@gmail.com' : '',
      propertyCondition: 0,
      communicationWithOwner: 0,
      locationAccessibility: 0,
      amenitiesFacilities: 0,
      overallExperience: 0,
      reason: isDev ? 'your reason here' : '',
    },
    mode: 'onChange',
  });

  const onError: SubmitErrorHandler<ReviewFormValues> = (errors) => {
    Object.entries(errors).forEach(([key, value]) => {
      toast.error(`${key}: ${value.message}`);
    });
  };

  const onSubmit: SubmitHandler<ReviewFormValues> = (values) => {
    toast.promise(mutateAsync(values), {
      loading: 'Processing...',
      success: () => {
        onUnSwapModal(false);
        return `Submitted!`;
      },
      error: (err) => {
        if (err instanceof TRPCClientError) {
          return err.message;
        }
        return err.message ?? 'Please try again later.';
      },
      description: 'We will review your request and take appropriate action.',
      descriptionClassName: 'text-[10px]',
    });

    // toast.success('Implement Soon:', {
    //   description: (
    //     <pre className='mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 font-mono! text-code-foreground'>
    //       <code className='font-mono'>{JSON.stringify(values, null, 2)}</code>
    //     </pre>
    //   ),
    //   position: 'bottom-right',
    //   classNames: {
    //     content: 'flex flex-col gap-2 font-mono!',
    //   },
    //   style: {
    //     '--border-radius': 'calc(var(--radius)  + 4px)',
    //   } as React.CSSProperties,
    // });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit, onError)} className='space-y-4'>
      <ScrollArea className='max-h-96 h-full pr-4'>
        <FieldGroup className='gap-3'>
          <FieldSet className='gap-3' disabled={isPending}>
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
          <Button variant='outline' type='button' disabled={isPending}>
            Cancel
          </Button>
        </DialogClose>
        <Button type='submit' variant={'destructive'} disabled={isPending}>
          UnSwap
        </Button>
      </DialogFooter>
    </form>
  );
}
