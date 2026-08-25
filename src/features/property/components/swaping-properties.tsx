'use client';

import { Pagination, usePagination } from '@ark-ui/react/pagination';
import { IconBath, IconBedFlat, IconHome } from '@tabler/icons-react';
import { TRPCClientError } from '@trpc/client';
import AutoPlay from 'embla-carousel-autoplay';
import {
  ArrowUpRightFromSquareIcon,
  CheckCheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  HeartIcon,
  PlusCircleIcon,
  Settings2Icon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Trash2Icon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQueryStates } from 'nuqs';
import { useState } from 'react';
import { toast } from 'sonner';
import { IconUser } from 'stream-chat-react';

import SwappingBannerBG from '../../../../public/swaping/banner.jpg';

import DatePickerWithRangeSelect from '@/components/shared/date-picker-with-range-select';
import SectionDescription from '@/components/shared/section-description';
import SectionHeading from '@/components/shared/section-heading';
import SectionHeadingGroup from '@/components/shared/section-heading-group';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from '@/components/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { propertyTypes } from '@/constants/property-assets';
import { RoomTypeLateral } from '@/constants/property-assets-types';
import {
  PropertyFilterProvider,
  usePropertyFilter,
} from '@/contexts/property-filter-context';
import { useUpgradeModal } from '@/features/common/hooks/use-upgrade-modal';
import {
  useAddHoldToProperty,
  useAddToFavorite,
  useLikeProperty,
} from '@/features/engagement/hooks/use-engagements';
import { useSession } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { usePublicProperties } from '../hooks/use-property';
import { basicFilterAddonParams } from '../searchParams';
import PropertyFilters from './property-filters';
import {
  EmptyPropertiesState,
  Paginate,
  PropertyCardCarousel,
  SortAndLimitFilter,
} from './property-listings';

const isDev = process.env.NODE_ENV === 'development';

export function SwapingsPropertyListings() {
  const { isTransition, startTransition } = usePropertyFilter();
  const [filters, setFilters] = useQueryStates(basicFilterAddonParams, {
    shallow: false,
    scroll: true,
    history: 'push',
    startTransition,
    // limitUrlUpdates: {
    //   method: "throttle",
    //   timeMs: 250,
    // },
  });

  const {
    data: { properties, totalProperties },
  } = usePublicProperties({
    limit: filters.limit,
    offset: filters.offset,
    sort: filters.sort,
    roomType: filters.roomType,
    from: filters.from,
    to: filters.to,
    goto: filters.goto,
  });

  const { mutateAsync: likeProperty, isPending: isLikePending } =
    useLikeProperty();
  const { mutateAsync: addToFavorite, isPending: isAddToFavoritePending } =
    useAddToFavorite();
  const { handleError, modal } = useUpgradeModal();
  const { data } = useSession();

  const router = useRouter();

  const pagination = usePagination({
    type: 'button',
    count: totalProperties,
    defaultPage: Number(filters.offset),
    pageSize: Number(filters.limit),
    siblingCount: 2,
    boundaryCount: 1,
  });

  function handleLikeProperty(propertyId: string) {
    toast.promise(likeProperty({ propertyId: propertyId, path: '/swapings' }), {
      loading: 'In progress...',
      success: (data) => {
        // router.push(`/property/${propertyId}` as Route);
        router.push(`/property/${propertyId}` as any);
        return data.message;
      },
      error: (err) => {
        if (err instanceof TRPCClientError) {
          handleError(err);
        }
        return err.message || 'Failed to engage with this property.';
      },
    });
    return;
  }

  function handleAddToFavorite(propertyId: string) {
    toast.promise(
      addToFavorite({ propertyId: propertyId, path: '/swapings' }),
      {
        loading: 'Adding to favorites...',
        success: 'Added to favorites successfully.',
        error: (err) => {
          if (err instanceof TRPCClientError) {
            handleError(err);
          }
          return err.message || 'Failed to add to favorites.';
        },
      },
    );
    return;
  }

  return (
    <div>
      {modal}
      {properties?.length === 0 ? (
        <EmptyPropertiesState
          title='No Swapings Found'
          description="Click 'Create Property' button below to create your first property and start making swapings."
          buttonText='Create Property'
          buttonLink='/property/new'
          buttonIcon={<PlusCircleIcon size={20} />}
        />
      ) : (
        <Pagination.RootProvider value={pagination} className=''>
          <div className={'space-y-6'}>
            <div
              className={
                'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              }>
              {properties?.map((property) => {
                // const isSelfProperty =
                //   property.authorId === data?.user?.id || false;

                const isLikedByMe = property.receivedLikes.some(
                  (like) => like.fromUserId === data?.user?.id,
                );

                const markedAsFavByMe = property.propertyFavorites.some(
                  (like) => like.favoriteBy === data?.user?.id,
                );

                return (
                  <Card key={property.id} className={'py-4 gap-4 relative'}>
                    {isDev ? (
                      <span className={'capitalize absolute top-0 left-0 z-10'}>
                        <Badge variant={'outline'}>
                          Owner: {property.author.name}
                        </Badge>
                      </span>
                    ) : null}

                    <Badge className='top-4 right-4 z-10 absolute'>
                      <EyeIcon /> {property?.propertyStats?.views ?? 0}
                    </Badge>

                    <PropertyCardCarousel
                      images={property.images}
                      type='propertyCard'
                    />

                    <Separator />
                    <CardHeader className={'px-4'}>
                      <CardTitle className={'capitalize'}>
                        {property.roomType}
                      </CardTitle>
                      <CardDescription
                        className={'capitalize text-xs text-muted-foreground'}>
                        {property.streetAddress}, {property.country.name}
                      </CardDescription>

                      <CardAction className={'self-center space-x-2'}>
                        <Button
                          variant={markedAsFavByMe ? 'destructive' : 'outline'}
                          size={'icon-sm'}
                          disabled={
                            isLikePending ||
                            markedAsFavByMe ||
                            isAddToFavoritePending
                          }
                          onClick={() => handleAddToFavorite(property.id)}
                          aria-label={
                            markedAsFavByMe
                              ? 'Already added to favorite'
                              : 'Save property (currently unavailable)'
                          }
                          title={
                            markedAsFavByMe
                              ? 'Already added to favorite'
                              : 'Save property (currently unavailable)'
                          }>
                          <HeartIcon
                            className={cn(
                              'size-4',
                              markedAsFavByMe ? '' : 'stroke-destructive',
                            )}
                          />
                        </Button>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={isLikedByMe ? 'default' : 'outline'}
                              size={'icon-sm'}
                              disabled={isLikePending || isAddToFavoritePending}
                              aria-label={
                                isLikedByMe ? 'Already Liked' : 'Like property'
                              }
                              title={
                                isLikedByMe ? 'Already Liked' : 'Like property'
                              }
                              onClick={
                                isLikedByMe
                                  ? undefined
                                  : () => handleLikeProperty(property.id)
                              }>
                              {isLikedByMe ? (
                                <ThumbsDownIcon
                                  className={'size-4 text-white'}
                                />
                              ) : (
                                <ThumbsUpIcon
                                  className={'size-4 text-primary'}
                                />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {isLikedByMe
                                ? 'You have already liked this property.'
                                : 'Like this property to show your interest to the owner.'}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </CardAction>
                    </CardHeader>
                    <Separator />
                    <CardContent className={'px-4 space-y-4'}>
                      <div className='gap-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4'>
                        <p className='inline-flex items-center gap-2'>
                          <span className='bg-muted p-1 rounded-full'>
                            <IconBedFlat className={'size-4 stroke-primary'} />
                          </span>
                          <span className={'text-xs text-muted-foreground'}>
                            {property.beds} Bed{property.beds > 1 ? 's' : ''}
                          </span>
                        </p>
                        <p className='inline-flex items-center gap-2'>
                          <span className='bg-muted p-1 rounded-full'>
                            <IconBath className={'size-4 stroke-primary'} />
                          </span>
                          <span className={'text-xs text-muted-foreground'}>
                            {property.bathRooms} Bath
                            {property.bathRooms > 1 ? 's' : ''}
                          </span>
                        </p>
                        <p className='inline-flex items-center gap-2'>
                          <span className='bg-muted p-1 rounded-full'>
                            <IconUser className={'size-4 stroke-primary'} />
                          </span>
                          <span className={'text-xs text-muted-foreground'}>
                            {property.guests} Guest
                            {property.guests > 1 ? 's' : ''}
                          </span>
                        </p>
                        <p className='inline-flex items-center gap-2'>
                          <span className='bg-muted p-1 rounded-full'>
                            <IconHome className={'size-4 stroke-primary'} />
                          </span>
                          <span className={'text-xs text-muted-foreground'}>
                            {property.bedRooms} Bed Room
                            {property.bedRooms > 1 ? 's' : ''}
                          </span>
                        </p>
                      </div>

                      <div className='flex flex-col gap-2'>
                        <p className='inline-flex items-center gap-2'>
                          <CheckCheckIcon className={'size-4 stroke-primary'} />
                          <span className='font-medium text-muted-foreground text-sm'>
                            {property.amenities.length}+ Amenities
                          </span>
                        </p>
                        <p className='inline-flex items-center gap-2'>
                          <CheckCheckIcon className={'size-4 stroke-primary'} />
                          <span className='font-medium text-muted-foreground text-sm'>
                            {property.accessibilities.length}+ Accessibilities
                          </span>
                        </p>
                        <p className='inline-flex items-center gap-2'>
                          <CheckCheckIcon className={'size-4 stroke-primary'} />
                          <span className='font-medium text-muted-foreground text-sm'>
                            {property.rules.length}+ Rules
                          </span>
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className={'px-4 justify-end mt-auto'}>
                      <Link
                        prefetch={'auto'}
                        href={`/property/${property.id}`}
                        className={buttonVariants({
                          variant: 'outline',
                          size: 'sm',
                        })}>
                        View Details{' '}
                        <ArrowUpRightFromSquareIcon className={'size-4'} />
                      </Link>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            <Paginate
              pagination={pagination}
              queryStates={[filters, setFilters]}
              isPending={isTransition}
            />
          </div>
        </Pagination.RootProvider>
      )}
    </div>
  );
}

export function SwappingBannerHeading() {
  return (
    <SectionHeadingGroup
      className={
        'text-center space-y-4 md:space-y-6 w-full max-w-5xl mx-auto wrap-anywhere px-2'
      }>
      <SectionHeading
        align='center'
        className={'text-primary backdrop-blur-xs'}>
        DISCOVER YOUR DESIRED HOUSE
      </SectionHeading>
      <SectionDescription
        className={'text-secondary dark:text-muted-foreground'}>
        Welcome to Swapping Place, where finding your dream home is as easy as a
        swipe! Discover a world of possibilities as you browse through our
        diverse range of properties. Swipe right for the homes you love and let
        the adventure begin.
      </SectionDescription>
    </SectionHeadingGroup>
  );
}

export function SwappingBanner() {
  return (
    <section
    // className={
    //   "bg-primary-100 dark:bg-primary-500/30 pt-12 md:pt-16 lg:pt-20"
    // }
    >
      <div
        className={
          'bg-secondary-950 relative w-full h-100 sm:h-110 lg:h-120 ring-2 ring-primary overflow-hidden rounded-2xl'
        }>
        <Image
          src={SwappingBannerBG}
          alt={'Swapping Banner'}
          // width={3192}
          // height={2128}
          fill
          sizes='(min-width: 1280px) 100vw, 80vw'
          placeholder='blur'
          className={'w-full h-full object-cover brightness-40 -z-10'}
          blurDataURL={SwappingBannerBG.blurDataURL}
        />

        <div className='top-0 left-0 absolute content-center gap-4 md:gap-6 lg:gap-8 grid w-full h-full'>
          <SwappingBannerHeading />

          <PropertyFilterProvider>
            <SwappingFilter />
          </PropertyFilterProvider>
        </div>
      </div>
    </section>
  );
}

export function SwappingFilter() {
  const {
    isTransition,
    startTransition,
    isFilterModalOpen,
    onToggleFilterModal,
  } = usePropertyFilter();

  const [{ goto }, setValues] = useQueryStates(basicFilterAddonParams, {
    shallow: false,
    history: 'replace',
    startTransition: startTransition,
    limitUrlUpdates: {
      method: 'throttle',
      timeMs: 300,
    },
  });

  const [query, setQuery] = useState(goto);

  function handleUpdateSearchParams(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();

    setValues((prev) => ({
      ...prev,
      goto: query,
      // from: date?.from,
      // to: date?.to,
    }));
  }

  return (
    <div
    // className={
    //   "bg-primary/10 w-fit mx-auto backdrop-blur-sm rounded-2xl lg:rounded-full"
    // }
    >
      <Card
        className={
          // "p-0 md:p-2 rounded-2xl lg:rounded-full ring ring-primary-500 max-w-fit md:max-w-2xl mx-auto"
          'p-0 md:p-2 rounded-2xl lg:rounded-full ring ring-primary/50 max-w-full md:max-w-3xl mx-auto'
        }>
        <CardContent className={'p-2 w-full grid grid-cols-12 gap-2'}>
          <form
            className={
              'w-full col-span-full lg:col-span-11 grid grid-cols-12 items-center gap-2 lg:gap-4'
            }
            onSubmit={(e) => handleUpdateSearchParams(e)}>
            <Field className='col-span-full md:col-span-6 lg:col-span-5'>
              <FieldLabel htmlFor='where-to-go' className='sr-only'>
                Search your location
              </FieldLabel>
              <Input
                type='search'
                id='where-to-go'
                placeholder='Where to go?'
                className={'w-full lg:rounded-2xl'}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </Field>

            <Field className='col-span-full md:col-span-6 lg:col-span-5'>
              <FieldLabel htmlFor='search-by-date' className='sr-only'>
                Search by date
              </FieldLabel>
              <DatePickerWithRangeSelect id={'search-by-date'} />
            </Field>

            <Button
              disabled={isTransition}
              variant={isTransition ? 'outline' : 'default'}
              size={'sm'}
              className={
                'lg:rounded-full w-full lg:w-fit hover:cursor-pointer col-span-full lg:col-span-2'
              }>
              View Home
            </Button>
          </form>

          <div className='justify-self-center self-center col-span-full lg:col-span-1'>
            <Dialog open={isFilterModalOpen} onOpenChange={onToggleFilterModal}>
              <DialogTrigger asChild>
                <Button
                  type='button'
                  disabled={isTransition}
                  variant={isTransition ? 'outline' : 'default'}
                  size={'sm'}
                  className={'w-full lg:w-fit hover:cursor-pointer'}>
                  <Settings2Icon className={'size-4'} />
                  <span className={'sr-only'}>more settings</span>
                </Button>
              </DialogTrigger>
              <DialogContent
                className={'max-w-xs xs:max-w-md sm:max-w-lg md:max-w-xl'}>
                <DialogHeader>
                  <DialogTitle>
                    Property Filters{' '}
                    <span className={'text-xs text-secondary-300'}>
                      (optional)
                    </span>
                  </DialogTitle>
                  <DialogDescription>
                    Set your preferences to find the best property matches for
                    your needs.{' '}
                    <span className={'text-xs text-secondary-300'}>
                      (optional)
                    </span>
                  </DialogDescription>
                </DialogHeader>

                <PropertyFilters />
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function SwappingFilterByType() {
  const types = propertyTypes.map((type) => type.categoryTypes).flat();

  // const { isTransition, startTransition } = usePropertyFilter();

  // const [{ roomType: selectedType }, setValues] = useQueryStates(
  //   basicFilterAddonParams,
  //   {
  //     shallow: false,
  //     throttleMs: 300,
  //     history: "replace",
  //   },
  // );

  const { isTransition, startTransition } = usePropertyFilter();
  const queryStates = useQueryStates(basicFilterAddonParams, {
    shallow: false,
    scroll: false,
    history: 'push',
    startTransition,
    // limitUrlUpdates: {
    //   method: "throttle",
    //   timeMs: 250,
    // },
  });

  const searchParams = useSearchParams();

  const [values, setValues] = queryStates;

  const { roomType: selectedType, offset, limit } = values;

  const {
    data: { totalProperties },
  } = usePublicProperties(values);

  const pagination = usePagination({
    type: 'button',
    count: totalProperties,
    defaultPage: Number(offset),
    pageSize: Number(limit),
    siblingCount: 2,
    boundaryCount: 1,
  });

  // if (totalProperties <= 0) {
  //   return null;
  // }

  return (
    <div className='space-y-4 max-w-(--breakpoint-xl) mx-auto px-9'>
      <div className='flex flex-wrap justify-end items-center gap-2'>
        <SortAndLimitFilter
          pagination={pagination}
          queryStates={queryStates}
          isPending={isTransition}
          isLabelShow={false}
        />
        <Button
          variant={'destructive'}
          size='sm'
          onClick={() => {
            setValues(null);
          }}>
          <Trash2Icon /> Clear All ({Array.from(searchParams.keys()).length})
        </Button>
      </div>

      <div className={'flex items-center gap-4'}>
        <Card className={'p-2 gap-2 w-full'}>
          <Carousel
            plugins={isDev ? undefined : [AutoPlay({ delay: 3000 })]}
            opts={{
              // align: 'center',
              // containScroll: 'keepSnaps',
              loop: true,
              direction: 'ltr',
              dragFree: true,
              dragThreshold: 10,
              duration: 200,
              startIndex: 0,
              slidesToScroll: 'auto',
            }}>
            <CarouselContent className={'-ml-4'}>
              {types.map((type, index) => (
                <CarouselItem
                  key={index}
                  className='group pl-4 basis-6/12 sm:basis-3/12 lg:basis-2/12'>
                  <Button
                    disabled={isTransition}
                    variant={
                      selectedType === type.name.toLowerCase()
                        ? 'default'
                        : 'outline'
                    }
                    // defaultChecked={type.name.toLowerCase() === selectedType}
                    value={type.name}
                    className={cn(
                      'flex flex-col items-center gap-1 disabled:opacity-50 px-3 ring-1 ring-primary-500 group-hover:ring-1 group-hover:ring-primary-500 w-full h-full transition-all duration-200 ease-in-out disabled:cursor-not-allowed',
                    )}
                    onClick={() => {
                      startTransition(() => {
                        // setSelectedType(type.name.toLowerCase());
                        setValues((prev) => ({
                          ...prev,
                          roomType: type.name.toLowerCase() as RoomTypeLateral,
                        }));
                      });
                    }}>
                    {isTransition ? (
                      <span>
                        <Skeleton className={'size-6 md:size-8 rounded-full'} />
                      </span>
                    ) : (
                      <span className=''>
                        {
                          <type.icon
                            className={cn(
                              'size-8 text-muted-foreground',
                              selectedType === type.name.toLowerCase() &&
                                'text-white',
                            )}
                          />
                        }
                      </span>
                    )}

                    <span
                      className={cn(
                        'font-medium text-primary-500 dark:group-hover:text-primary-100 text-xs text-clip text-wrap',
                        selectedType === type.name.toLowerCase() &&
                          'font-semibold text-white',
                      )}>
                      {type.name}
                    </span>
                  </Button>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </Card>
      </div>
    </div>
  );
}

export function CarouselOverlay() {
  return (
    <div
      className={
        'bg-linear-to-t from-background to-foreground absolute opacity-35 h-full left-0 bottom-0 w-full z-10 rounded-lg'
      }
    />
  );
}

interface CarouselDetailsProps {
  carousel: {
    id: string;
    type: string;
    description: string;
    state: string;
    country: string;
    countryFlag?: string;
    roomlocation: string;
    userLocation: string;
    date: string;
    rating: number;
    images: string[];
    isHeldAlready: boolean;
  };
}

export function CarouselDetails({ carousel }: CarouselDetailsProps) {
  const { mutateAsync, isPending } = useAddHoldToProperty();

  function handleHoldingProperty() {
    toast.promise(mutateAsync({ propertyId: carousel.id, path: '/swapings' }), {
      loading: 'Holding property...',
      success: 'Property held successfully!',
      error: 'Failed to hold property',
    });
  }

  return (
    <div
      className={
        'absolute left-0 bottom-0 sm:bottom-4 w-full px-4 sm:px-8 py-4 sm:py-6 z-20'
      }>
      <div className={'flex items-center justify-between'}>
        <div className={'text-tertiary-50 inline-grid gap-1 ml-4'}>
          <h3
            className={
              'text-yellow-500 capitalize text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold lg:font-bold'
            }>
            {carousel.type}
          </h3>
          <p
            className={
              'text-white dark:text-foreground text-base md:text-lg lg:text-xl'
            }>
            {carousel.state}
          </p>
          <p className={'text-white dark:text-foreground text-xs sm:text-sm'}>
            {carousel.countryFlag ? (
              <span className='inline-flex items-center gap-2'>
                <img
                  src={carousel.countryFlag}
                  alt={carousel.country}
                  width={24}
                  height={24}
                />
                {carousel.country}
              </span>
            ) : (
              <span>{carousel.country}</span>
            )}
          </p>
        </div>
        <div className={'z-20'}>
          <Button
            onClick={handleHoldingProperty}
            size={'sm'}
            disabled={isPending || carousel.isHeldAlready}
            className='inline-flex items-center gap-2 bg-transparent data-hover:bg-yellow-600 data-open:bg-gray-700 px-3 py-1.5 rounded-md data-focus:outline-1 data-focus:outline-yellow-500 focus:outline-none ring-2 ring-yellow-500 font-semibold text-yellow-500 data-hover:text-tertiary-50 text-sm/6 hover:cursor-pointer'>
            {isPending
              ? 'Holding...'
              : carousel.isHeldAlready
                ? 'Already held by you'
                : 'Hold for now'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function SwappingCarouselBtns() {
  const { scrollNext, canScrollNext, scrollPrev, canScrollPrev } =
    useCarousel();

  return (
    <div className='flex justify-center items-center gap-2 mt-4 w-full'>
      <Button
        data-slot='carousel-previous'
        variant={'outline'}
        size={'icon-sm'}
        className='rounded-full'
        disabled={!canScrollPrev}
        onClick={scrollPrev}>
        <ChevronLeftIcon />
        <span className='sr-only'>Previous slide</span>
      </Button>

      <Button
        data-slot='carousel-next'
        variant={'outline'}
        size={'icon-sm'}
        className='rounded-full'
        disabled={!canScrollNext}
        onClick={scrollNext}>
        <ChevronRightIcon />
        <span className='sr-only'>Next slide</span>
      </Button>
    </div>
  );
}

export function SwappingCarousel() {
  const [filters, _] = useQueryStates(basicFilterAddonParams);
  const {
    data: { properties, totalProperties },
  } = usePublicProperties(filters);

  const { data } = useSession();

  return (
    <section>
      <Carousel
        plugins={isDev ? undefined : [AutoPlay({ delay: 3000 })]}
        opts={{
          loop: true,
          direction: 'ltr',
          dragFree: true,
          dragThreshold: 10,
          duration: 200,
          startIndex: 0,
          slidesToScroll: 'auto',
        }}>
        <CarouselContent className={'h-full w-full rounded-lg'}>
          {properties.map((property, idx) => {
            const isHeldAlready = property.propertyHolds.some(
              (hold) => hold.holdBy === data?.user.id,
            );

            return (
              <CarouselItem
                key={property.id}
                className='relative cursor-grab select-none'>
                <div className='relative w-full h-full aspect-square sm:aspect-video md:aspect-video lg:aspect-20/9'>
                  {property.images[0] ? (
                    <Image
                      src={property.images[0]}
                      alt={`${property.roomType} in ${property.state.name}`}
                      className={
                        'object-cover w-full h-full rounded-lg brightness-45'
                      }
                      width={500}
                      height={300}
                      priority={true}
                    />
                  ) : null}
                  {/* <CarouselOverlay /> */}
                </div>
                <CarouselDetails
                  carousel={{
                    id: property.id,
                    type: property.roomType,
                    description: property.description,
                    state: property.state.name,
                    country: property.country.name,
                    countryFlag: property.country.flag,
                    roomlocation: property.streetAddress,
                    userLocation: '',
                    date: property.createdAt.toString(),
                    rating: 0,
                    images: property.images,
                    isHeldAlready,
                  }}
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {totalProperties > 0 ? <SwappingCarouselBtns /> : null}
      </Carousel>
    </section>
  );
}
