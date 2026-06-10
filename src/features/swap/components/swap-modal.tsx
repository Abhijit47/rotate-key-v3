import {
  RotateCcwKey,
  RefreshCcw,
  PartyPopperIcon,
  XCircleIcon,
} from "lucide-react";
import { useChatContext } from "stream-chat-react";
import { useState } from "react";
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  useWatch,
} from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, differenceInMonths } from "date-fns";
import { toast } from "sonner";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useCustomChatContext } from "@/contexts/chat-context";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCreateSwap } from "../hooks/use-swap";
import { Spinner } from "@/components/ui/spinner";
import { TRPCClientError } from "@trpc/client";
import { useRouter } from "next/navigation";

function toDate(value?: string | null) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export const swapSchema = z
  .object({
    // which property select from dropdown by user
    choosenPropertyId: z.string().nonempty("Please select a property"),
    startDate: z.date(),
    endDate: z.date(),
    guestCount: z
      .string()
      .regex(/^[1-9]\d*$/, "Please select at least 1 guest"),
  })
  .superRefine((value, ctx) => {
    if (value.choosenPropertyId === "none") {
      ctx.addIssue({
        code: "custom",
        path: ["choosenPropertyId"],
        message: "Please select a property",
      });
      return;
    }
    const now = new Date();
    if (value.startDate < now) {
      ctx.addIssue({
        code: "custom",
        path: ["startDate"],
        message: "Start date must be in the future",
      });
    }
    if (value.endDate <= value.startDate) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date must be after start date",
      });
    }

    // from startDate to endDate gap min 6 months
    // if (differenceInMonths(value.endDate, value.startDate) < 6) {
    //   ctx.addIssue({
    //     code: "custom",
    //     path: ["endDate"],
    //     message: `End date must be at least 6 months after start date`,
    //   });
    // }
  });

type SwapValues = z.infer<typeof swapSchema>;

export function SwapDialog() {
  const [isGettingInOpen, setIsGettingInOpen] = useState(false);
  const [isGettingOutOpen, setIsGettingOutOpen] = useState(false);

  const { client, channel } = useChatContext();

  const { mutateAsync, isPending: isSwapping, mutate } = useCreateSwap();

  const router = useRouter();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const {
    user,
    isSwapModalOpen,
    onSwapModal,
    isOppositeUserDataPending,
    oppositeUserId,
    oppositeUserProperties,
  } = useCustomChatContext();

  const form = useForm<SwapValues>({
    resolver: zodResolver(swapSchema),
    defaultValues: {
      choosenPropertyId: "",
      startDate: undefined,
      endDate: undefined,
      guestCount: "0",
    },
    mode: "onChange",
  });

  const watchedValues = useWatch({
    control: form.control,
    name: ["startDate", "endDate", "guestCount", "choosenPropertyId"],
  });

  const gettingIn = watchedValues[0];
  const gettingOut = watchedValues[1];
  const guestCount = watchedValues[2];

  const choosenPropertyDetails = oppositeUserProperties?.find(
    (item) => item.property.id === watchedValues[3],
  );

  console.log("choosenPropertyDetails", choosenPropertyDetails);

  const hasDocumentMessageFromCurrentUser = channel?.state.messages.some(
    (msg) => {
      const sentByCurrentUser = msg?.user?.id === client.userID;
      const hasDocumentAttachment = msg.attachments?.some(
        (att) =>
          att.type === "file" &&
          !!att.asset_url &&
          att.title === "Property Document",
      );

      return sentByCurrentUser && hasDocumentAttachment;
    },
  );

  const shouldEnable =
    user.isPropertyDocumentUploaded &&
    hasDocumentMessageFromCurrentUser &&
    !isOppositeUserDataPending &&
    oppositeUserProperties;

  const opts = {
    shouldDirty: true,
    shouldTouch: true,
    shouldValidate: true,
  };

  const onError: SubmitErrorHandler<SwapValues> = (errors) => {
    Object.entries(errors).forEach(([key, value]) => {
      toast.error(`${key}: ${value.message}`);
    });
  };

  const onSubmit: SubmitHandler<SwapValues> = async (values) => {
    // console.log('Form submitted with data:', values);

    if (!choosenPropertyDetails) {
      toast.error("Please select a property");
      return;
    }
    const sentToApi = {
      bookingId: choosenPropertyDetails.id,
      startDate: values.startDate,
      endDate: values.endDate,
      guestCount: values.guestCount,
      partnerId: oppositeUserId,
      partnerPropertyId: choosenPropertyDetails.property.id,
    };

    toast.promise(mutateAsync(sentToApi), {
      loading: "Please wait...",
      success: () => {
        form.reset();
        onSwapModal(false);
        router.push("/my-profile");
        return "Swap request sent successfully";
      },
      error: (err) => {
        console.error(err);
        if (err instanceof TRPCClientError) {
          return err.message;
        }
        return "Swapping failed, please try again later";
      },
      description: `Swapping your property with ${choosenPropertyDetails?.property.authorId}`,
      descriptionClassName: "text-[10px]",
    });

    // toast.success("You submitted the following values:", {
    //   description: (
    //     <pre className="mt-2 w-[320px] overflow-x-auto rounded-md bg-code p-4 font-mono text-code-foreground">
    //       <code className="font-mono">
    //         {JSON.stringify(sentToApi, null, 2)}
    //       </code>
    //     </pre>
    //   ),
    //   position: "bottom-right",
    //   classNames: {
    //     content: "flex flex-col gap-2 font-mono",
    //   },
    //   style: {
    //     "--border-radius": "calc(var(--radius)  + 4px)",
    //   } as React.CSSProperties,
    // });
  };

  return (
    <Dialog
      open={isSwapModalOpen}
      onOpenChange={(open) => {
        // prevent the close, during swap process
        if (!isSwapping) {
          onSwapModal(open);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={"default"}
          size={"sm"}
          className={"text-sm!"}
          disabled={!shouldEnable}
        >
          <RotateCcwKey className={"size-4"} /> Swap
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-105">
        <DialogHeader>
          <DialogTitle>Want to swap your current property?</DialogTitle>
          <DialogDescription>
            Kindly choose a property from the list of available properties to
            swap with. If you have any questions, please contact our support
            team for assistance.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className="space-y-4"
        >
          <FieldSet disabled={isSwapping}>
            <FieldLegend className={"sr-only"}>Swap Form</FieldLegend>
            <FieldDescription className={"sr-only"}>
              Choose a property to swap with.
            </FieldDescription>

            <Button
              size="icon-xs"
              variant={"destructive"}
              type="button"
              onClick={() => {
                form.reset();
              }}
            >
              <RefreshCcw className="size-4" />
            </Button>

            <FieldGroup className={"gap-3"}>
              <Controller
                name="choosenPropertyId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    aria-invalid={fieldState.invalid}
                  >
                    <Label htmlFor="choose-property">Choose a Property</Label>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={(val) => {
                        field.onChange(val);
                        form.setValue(
                          "startDate",
                          toDate(choosenPropertyDetails?.startDate!) ??
                            new Date(),
                          opts,
                        );
                        form.setValue(
                          "endDate",
                          toDate(choosenPropertyDetails?.endDate!) ??
                            new Date(),
                          opts,
                        );
                        form.setValue(
                          "guestCount",
                          choosenPropertyDetails?.guestCount ?? "0",
                          opts,
                        );
                      }}
                    >
                      <SelectTrigger
                        id="choose-property"
                        className="w-full max-w-full"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Select a property" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Properties</SelectLabel>
                          <SelectItem value="none">
                            Select a property
                          </SelectItem>
                          {oppositeUserProperties?.map((item) => (
                            <SelectItem
                              key={item.id}
                              value={item.property.id}
                              className="flex items-center justify-between flex-wrap w-full"
                            >
                              <span className="flex items-center justify-start flex-wrap gap-1">
                                {item.property.streetAddress},
                                {item.property.city},{item.property.state},
                                {item.property.zipCode},
                                {item.property.type.toUpperCase()}
                              </span>
                              <Badge
                                variant={
                                  item.property.isAvailable
                                    ? "default"
                                    : "destructive"
                                }
                              >
                                {item.property.isAvailable
                                  ? "(Available)"
                                  : "(Not Available)"}
                              </Badge>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />

              {Object.keys(choosenPropertyDetails || {}).length > 0 ? (
                <div>
                  <div className={"grid grid-cols-1 md:grid-cols-2"}>
                    <Controller
                      name="startDate"
                      control={form.control}
                      render={({ field, fieldState }) => {
                        return (
                          <Field
                            data-invalid={fieldState.invalid}
                            aria-invalid={fieldState.invalid}
                          >
                            <FieldLabel
                              htmlFor={field.name}
                              className={"sr-only"}
                            >
                              Getting-In
                            </FieldLabel>
                            <Popover
                              open={isGettingInOpen}
                              onOpenChange={setIsGettingInOpen}
                            >
                              <PopoverTrigger asChild>
                                <Button
                                  type="button"
                                  size={"sm"}
                                  variant="outline"
                                  // disabled={property.isBookedByMe}
                                  className={cn(
                                    "flex-col h-10 w-full border-r-0 rounded-r-none border-b-0 rounded-b-none gap-0 bg-transparent",
                                    fieldState.invalid && "border-red-500",
                                    fieldState.error && "border-red-500",
                                    !fieldState.isValidating &&
                                      "border-red-500",
                                  )}
                                >
                                  <span>GETTING-IN</span>
                                  <span className={"text-xs"}>
                                    {gettingIn
                                      ? format(gettingIn, "dd/MM/yyyy")
                                      : "DD/MM/YYYY"}
                                  </span>
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent align="start">
                                <PopoverHeader>
                                  <PopoverTitle>GETTING-IN</PopoverTitle>

                                  <Calendar
                                    mode="single"
                                    className="w-full"
                                    onSelect={(date) => {
                                      if (!date) {
                                        form.setError("startDate", {
                                          type: "manual",
                                          message: "Please select a valid date",
                                        });
                                        return;
                                      }
                                      field.onChange(date);
                                      setIsGettingInOpen(false);
                                    }}
                                    selected={gettingIn}
                                    disabled={
                                      (date) =>
                                        //disable past dates
                                        date < today
                                      // date < today || property.isBookedByMe
                                    }
                                  />
                                </PopoverHeader>
                              </PopoverContent>
                            </Popover>
                          </Field>
                        );
                      }}
                    />

                    <Controller
                      name="endDate"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field
                          data-invalid={fieldState.invalid}
                          aria-invalid={fieldState.invalid}
                        >
                          <FieldLabel
                            htmlFor={field.name}
                            className={"sr-only"}
                          >
                            Getting-Out
                          </FieldLabel>
                          <Popover
                            open={isGettingOutOpen}
                            onOpenChange={setIsGettingOutOpen}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                type="button"
                                size={"sm"}
                                variant="outline"
                                // disabled={property.isBookedByMe}
                                className={
                                  "flex-col h-10 border-l-0 rounded-l-none w-full border-b-0 rounded-b-none gap-0 bg-transparent"
                                }
                              >
                                <span>GETTING-OUT</span>
                                <span className={"text-xs"}>
                                  {gettingOut
                                    ? format(gettingOut, "dd/MM/yyyy")
                                    : "DD/MM/YYYY"}
                                </span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent align="end">
                              <PopoverHeader>
                                <PopoverTitle>GETTING-OUT</PopoverTitle>

                                <Calendar
                                  mode="single"
                                  className="w-full"
                                  onSelect={(date) => {
                                    if (!date) {
                                      form.setError("endDate", {
                                        type: "manual",
                                        message: "Please select a valid date",
                                      });
                                      return;
                                    }
                                    field.onChange(date);
                                    setIsGettingOutOpen(false);
                                  }}
                                  selected={gettingOut}
                                  disabled={
                                    (date) =>
                                      // disable past dates and dates before getting-in date
                                      date < today ||
                                      (gettingIn ? date <= gettingIn : false)
                                    // date < today ||
                                    // (gettingIn ? date <= gettingIn : false) ||
                                    // property.isBookedByMe
                                  }
                                />
                              </PopoverHeader>
                            </PopoverContent>
                          </Popover>
                        </Field>
                      )}
                    />
                  </div>

                  <Controller
                    name="guestCount"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field
                        className="w-full"
                        aria-invalid={fieldState.invalid}
                        data-invalid={fieldState.invalid}
                      >
                        <FieldLabel className={"sr-only"}>Guest</FieldLabel>
                        <Select
                          data-invalid={fieldState.invalid}
                          aria-invalid={fieldState.invalid}
                          // disabled={property.isBookedByMe}
                          onValueChange={(value) => {
                            if (value === "0") {
                              form.setError("guestCount", {
                                type: "manual",
                                message: "Please select at least 1 guest",
                              });
                              return;
                            }
                            field.onChange(value);
                          }}
                          value={field.value}
                        >
                          <SelectTrigger
                            data-invalid={fieldState.invalid}
                            aria-invalid={fieldState.invalid}
                            className={"border-t-0 rounded-t-none"}
                          >
                            <SelectValue
                              className={"w-full"}
                              placeholder="Select number of guests"
                            >
                              {guestCount === "1"
                                ? `${guestCount} Guest`
                                : `${guestCount} Guest(s)`}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className={"w-full"} align="start">
                            <SelectGroup>
                              {Array.from({ length: 10 }, (_, i) => (
                                <SelectItem
                                  key={i + 1}
                                  value={(i + 1).toString()}
                                >
                                  {i + 1} Guest{i + 1 > 1 ? "s" : ""}
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
              ) : null}
            </FieldGroup>
          </FieldSet>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={isSwapping}>
                {isSwapping ? (
                  <span className="inline-flex items-center gap-2">
                    Cancel
                    <Spinner />
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    Cancel <XCircleIcon className="size-4" />
                  </span>
                )}
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSwapping}>
              {isSwapping ? (
                <span className="inline-flex items-center gap-2">
                  Swapping...
                  <Spinner />
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  Swap <PartyPopperIcon className="size-4" />
                </span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
