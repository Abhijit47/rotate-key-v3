'use client';

import { IconHomePlus } from '@tabler/icons-react';
import { TRPCClientError } from '@trpc/client';
import {
  ArrowUpRightFromSquareIcon,
  ArrowUpRightIcon,
  CheckCheckIcon,
  HeartIcon,
  PenLineIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Settings2,
  Loader2,
} from 'lucide-react';
import { Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AutoPlay from 'embla-carousel-autoplay';
import { useQueryStates } from 'nuqs';
import { useTransition } from 'react';

import SwappingBannerBG from '../../../../public/swaping/banner.jpg';

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
} from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';

import {
  useDeleteProperty,
  useProperty,
  usePublicProperties,
  useUserProperties,
} from '../hooks/use-property';

// import AutoPlay from 'embla-carousel-autoplay';
// import { type EmblaOptionsType } from 'embla-carousel';

import { propertyTypes } from '@/constants/property-assets';
import { swappingSearchParams } from '../searchParams';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useUpgradeModal } from '@/features/common/hooks/use-upgrade-modal';
import { useSession } from '@/lib/auth-client';
import { useLikeProperty } from '@/features/engagement/hooks/use-engagements';
import SectionWrapper from '@/components/shared/section-wrapper';
import SectionHeadingGroup from '@/components/shared/section-heading-group';
import SectionHeading from '@/components/shared/section-heading';
import SectionDescription from '@/components/shared/section-description';
import { rooms } from '@/constants/dummy-data';
import { ModalProvider } from '@/contexts/modal-context';
import DatePickerWithRange from '@/components/shared/date-picker-with-range-select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import PropertyFilters from './property-filters';

function prettifyText(text: string) {
  return text
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function EmptyPropertiesState() {
  return (
    <Empty className='border border-dashed mt-auto'>
      <EmptyHeader>
        <EmptyMedia variant='icon'>
          <IconHomePlus />
        </EmptyMedia>
        <EmptyTitle>No Properties Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any properties yet. Get started by creating
          your first property listing.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className='flex-row justify-center gap-2'>
        <Button asChild>
          <Link href='/property/new'>Create Property</Link>
        </Button>
        <Button variant='outline' asChild>
          <Link href='/swapings'>Explore Swapings</Link>
        </Button>
      </EmptyContent>
      <Button
        variant='link'
        asChild
        className='text-muted-foreground'
        size='sm'
      >
        <Link href='#'>
          Learn More <ArrowUpRightIcon />
        </Link>
      </Button>
    </Empty>
  );
}

export function PropertyListings() {
  const { data: properties } = usePublicProperties();
  const { mutateAsync: likeProperty, isPending: isLikePending } =
    useLikeProperty();
  const { handleError, modal } = useUpgradeModal();
  const { data } = useSession();

  const router = useRouter();

  function handleLikeProperty(propertyId: string) {
    toast.promise(likeProperty({ propertyId: propertyId, path: 'swapings' }), {
      loading: 'In progress...',
      success: (data) => {
        router.push(`/property/${propertyId}` as Route);
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

  return (
    <div>
      {modal}
      {properties?.length === 0 ? (
        <EmptyPropertiesState />
      ) : (
        <SectionWrapper>
          <div
            className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}
          >
            {properties?.map((property) => {
              // const isSelfProperty =
              //   property.authorId === data?.user?.id || false;

              const isLikedByMe = property.receivedLikes.some(
                (like) => like.fromUserId === data?.user?.id,
              );

              return (
                <Card key={property.id} className={'py-4 gap-4'}>
                  <CardContent className={'px-4'}>
                    <Carousel>
                      <CarouselContent>
                        {property.images.map((image, index) => (
                          <CarouselItem key={index}>
                            <Image
                              src={image}
                              alt={`Property Image ${index + 1}`}
                              className={
                                'w-full h-full object-cover rounded-md'
                              }
                              width={400}
                              height={300}
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </Carousel>
                  </CardContent>
                  <Separator />
                  <CardHeader className={'px-4'}>
                    <CardTitle className={'capitalize'}>
                      {property.type}
                    </CardTitle>
                    <CardDescription className={'capitalize'}>
                      {property.streetAddress}
                    </CardDescription>
                    <CardDescription className={'capitalize'}>
                      Owner:
                      <Badge variant={'secondary'}>
                        {property.author.name}
                      </Badge>
                    </CardDescription>
                    <CardAction className={'self-center space-x-2'}>
                      {/* TODO: Added in future */}
                      <Button
                        variant={'destructive'}
                        size={'icon-sm'}
                        disabled
                        aria-label={'Save property (currently unavailable)'}
                        title={'Save property (currently unavailable)'}
                      >
                        <HeartIcon className={'size-4'} />
                      </Button>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={isLikedByMe ? 'default' : 'outline'}
                            size={'icon-sm'}
                            disabled={isLikePending}
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
                            }
                          >
                            {isLikedByMe ? (
                              <ThumbsDownIcon className={'size-4 text-white'} />
                            ) : (
                              <ThumbsUpIcon className={'size-4 text-primary'} />
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
                  <CardContent className={'px-4'}>
                    {property.amenities.map((amenity, index) => (
                      <p
                        key={index}
                        className={'text-sm text-muted-foreground'}
                      >
                        <span className={'inline-flex items-center gap-1'}>
                          <CheckCheckIcon className={'size-4'} />
                          {prettifyText(amenity)}
                        </span>
                      </p>
                    ))}
                  </CardContent>
                  <CardFooter className={'px-4 justify-end mt-auto'}>
                    <Link
                      prefetch={'auto'}
                      href={`/property/${property.id}`}
                      className={buttonVariants({
                        variant: 'outline',
                        size: 'sm',
                      })}
                    >
                      View Details{' '}
                      <ArrowUpRightFromSquareIcon className={'size-4'} />
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </SectionWrapper>
      )}
    </div>
  );
}

export function MyPropertyListings() {
  const { data: properties } = useUserProperties();
  const { mutateAsync, isPending } = useDeleteProperty();
  const { data } = useSession();

  // function handlePreventLikeOwnProperty() {
  //   toast.error('You cannot like your own property.', {
  //     description: 'This action is not allowed.',
  //     icon: '⚠️',
  //   });
  //   return;
  // }

  function handleDeleteProperty(propertyId: string) {
    if (confirm('Are you sure you want to delete this property?')) {
      toast.promise(mutateAsync({ id: propertyId }), {
        loading: 'Deleting property...',
        success: 'Property deleted successfully!',
        error: (err) => err.message,
      });
    }
  }

  return (
    <div>
      {properties?.length === 0 ? (
        <EmptyPropertiesState />
      ) : (
        <div className={'grid grid-cols-3 gap-6'}>
          {properties?.map((property) => {
            return (
              <Card key={property.id} className={'py-4 gap-4'}>
                <CardContent className={'px-4'}>
                  <Carousel>
                    <CarouselContent>
                      {property.images.map((image, index) => (
                        <CarouselItem key={index}>
                          <Image
                            src={image}
                            alt={`Property Image ${index + 1}`}
                            className={'w-full h-full object-cover rounded-md'}
                            width={400}
                            height={300}
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </CardContent>
                <Separator />
                <CardHeader className={'px-4'}>
                  <CardTitle className={'capitalize'}>
                    {property.type}
                  </CardTitle>
                  <CardDescription className={'capitalize'}>
                    {property.streetAddress}
                  </CardDescription>
                  <CardAction className={'self-center space-x-2'}>
                    <Badge variant={'outline'}>{property.author.name}</Badge>
                  </CardAction>
                </CardHeader>
                <Separator />
                <CardContent className={'px-4'}>
                  {property.amenities.map((amenity, index) => (
                    <p key={index} className={'text-sm text-muted-foreground'}>
                      <span className={'inline-flex items-center gap-1'}>
                        <CheckCheckIcon className={'size-4'} />
                        {prettifyText(amenity)}
                      </span>
                    </p>
                  ))}
                </CardContent>
                <CardFooter className={'px-4 justify-end mt-auto'}>
                  {property.authorId === data?.user?.id ? (
                    <>
                      <Link
                        prefetch={'auto'}
                        href={`/property/${property.id}/update` as Route}
                        className={buttonVariants({
                          variant: 'outline',
                          size: 'sm',
                          className: 'mr-4',
                        })}
                      >
                        Edit Details <PenLineIcon className={'size-4'} />
                      </Link>

                      <Button
                        variant={'destructive'}
                        size={'sm'}
                        className={'mr-4'}
                        onClick={() => handleDeleteProperty(property.id)}
                        disabled={isPending}
                      >
                        {isPending ? 'Deleting...' : 'Delete'}
                      </Button>
                    </>
                  ) : null}
                  <Link
                    prefetch={'auto'}
                    href={`/property/${property.id}`}
                    className={buttonVariants({
                      variant: 'outline',
                      size: 'sm',
                    })}
                  >
                    View Details{' '}
                    <ArrowUpRightFromSquareIcon className={'size-4'} />
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function PropertyListing({ propertyId }: { propertyId: string }) {
  const { data: property } = useProperty(propertyId);
  return <div>{JSON.stringify(property, null, 2)}</div>;
}

export function SwappingBanner() {
  return (
    <section
      className={
        'bg-primary-100 dark:bg-primary-500/30 pt-12 md:pt-16 lg:pt-20 rounded-2xl'
      }
    >
      <SectionWrapper>
        <div
          className={
            'h-dvh sm:h-dvh lg:h-auto w-full sm:aspect-square md:aspect-video lg:aspect-video xl:aspect-22/9 rounded-2xl overflow-hidden bg-secondary-950 relative'
          }
        >
          <Image
            src={SwappingBannerBG}
            alt={'Swapping Banner'}
            // width={3192}
            // height={2128}
            fill
            sizes='(min-width: 1280px) 100vw, 80vw'
            placeholder='blur'
            className={'w-full h-full object-cover opacity-40 brightness-80'}
            blurDataURL={SwappingBannerBG.blurDataURL}
          />

          <SwappingBannerHeading />

          <ModalProvider>
            <SwappingFilter />
          </ModalProvider>
        </div>
      </SectionWrapper>
    </section>
  );
}

export function SwappingBannerHeading() {
  return (
    <div
      className={
        'absolute w-full h-full grid place-items-start lg:place-items-center lg:content-center px-4 mt-16 md:mt-8 lg:mt-0'
      }
    >
      <SectionHeadingGroup
        className={'text-center space-y-4 md:space-y-6 lg:space-y-8'}
      >
        <SectionHeading align='center' className={'text-primary-300'}>
          DISCOVER YOUR DESIRED HOUSE
        </SectionHeading>
        <SectionDescription className={'text-primary-100'}>
          Welcome to Swapping Place, where finding your dream home is as easy as
          a swipe! Discover a world of possibilities as you browse through our
          diverse range of properties. Swipe right for the homes you love and
          let the adventure begin.
        </SectionDescription>
      </SectionHeadingGroup>
    </div>
  );
}

export default function CarouselOverlay() {
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
    roomlocation: string;
    userLocation: string;
    date: string;
    rating: number;
    images: string[];
  };
}

export function CarouselDetails({ carousel }: CarouselDetailsProps) {
  return (
    <div
      className={
        'absolute left-0 bottom-0 sm:bottom-4 w-full px-2 sm:px-8 py-2 xs:py-4 sm:py-6 z-20'
      }
    >
      <div className={'flex items-center justify-between'}>
        <div className={'text-tertiary-50 inline-grid gap-2 ml-4'}>
          <h3
            className={
              'text-yellow-500 text-sm sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold lg:font-bold'
            }
          >
            {carousel.type}
          </h3>
          <p
            className={
              'text-white dark:text-foreground text-base md:text-lg lg:text-xl'
            }
          >
            {carousel.state}
          </p>
          <p className={'text-white dark:text-foreground text-xs sm:text-sm'}>
            {carousel.country}
          </p>
        </div>
        <div className={'z-20'}>
          <Button
            onClick={() => toast.info('Feature coming soon...')}
            size={'sm'}
            className='inline-flex items-center gap-2 rounded-md bg-transparent py-1.5 px-3 text-sm/6 font-semibold text-yellow-500 focus:outline-none ring-2 ring-yellow-500 data-hover:bg-yellow-600 data-hover:text-tertiary-50 data-open:bg-gray-700 data-focus:outline-1 data-focus:outline-yellow-500'
          >
            Hold for now
          </Button>
        </div>
      </div>
    </div>
  );
}

const isDev = process.env.NODE_ENV === 'development' ? true : false;

export function SwappingCarousel() {
  return (
    <section>
      <SectionWrapper>
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
          }}
        >
          <CarouselContent className={'h-full w-full rounded-lg'}>
            {rooms.map((carousel, idx) => (
              <CarouselItem
                key={carousel.id}
                className={
                  'aspect-square sm:aspect-square md:aspect-video lg:aspect-20/9 h-full w-full relative'
                }
              >
                <div className='relative'>
                  <Image
                    src={carousel.images[idx]}
                    alt={crypto.randomUUID()}
                    className={
                      'object-cover w-full h-full rounded-lg brightness-50'
                    }
                    width={500}
                    height={300}
                    priority={true}
                  />
                  <CarouselOverlay />
                </div>
                <CarouselDetails carousel={carousel} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </SectionWrapper>
    </section>
  );
}

export function SwappingFilter() {
  return (
    <div
      className={'absolute left-0 bottom-0 sm:bottom-4 lg:bottom-8 w-full px-8'}
    >
      <div
        className={
          'bg-primary-200/50 w-fit mx-auto backdrop-blur-sm rounded-2xl lg:rounded-full p-4'
        }
      >
        <Card
          className={
            'p-2 rounded-2xl lg:rounded-full ring ring-primary-500 max-w-2xl mx-auto'
          }
        >
          <CardContent className={'p-2 flex items-center flex-wrap gap-2'}>
            <Input
              type='text'
              id='where'
              placeholder='Where to go ?'
              className={'w-full flex-1 rounded-2xl'}
            />

            <DatePickerWithRange />

            <Button
              size={'sm'}
              className={'lg:rounded-full w-full lg:w-fit hover:cursor-pointer'}
            >
              View Home
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size={'sm'}
                  className={'w-full lg:w-fit hover:cursor-pointer'}
                >
                  <Settings2 className={'size-4'} />
                  <span className={'sr-only'}>more settings</span>
                </Button>
              </DialogTrigger>
              <DialogContent
                className={'max-w-xs xs:max-w-md sm:max-w-lg md:max-w-xl'}
              >
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function SwappingFilterByType() {
  const types = propertyTypes.map((type) => type.categoryTypes).flat();
  const [isTransition, startTransition] = useTransition();

  const [{ type: selectedType }, setValues] = useQueryStates(
    swappingSearchParams,
    {
      shallow: false,
      throttleMs: 300,
      history: 'replace',
    },
  );

  return (
    <SectionWrapper>
      <div className={'flex items-center gap-4'}>
        <Card className={'p-2 gap-2 w-full'}>
          <Carousel
            // plugins={[AutoPlay({ delay: 3000 })]}
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
            }}
          >
            <CarouselContent className={'-ml-4'}>
              {types.map((type, index) => (
                <CarouselItem
                  key={index}
                  className='pl-4 basis-6/12 sm:basis-3/12 lg:basis-2/12 group'
                >
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
                      'w-full h-full ring-1 ring-primary-500 flex flex-col gap-1 items-center group-hover:ring-1 group-hover:ring-primary-500 px-3 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed',
                    )}
                    onClick={() => {
                      startTransition(() => {
                        // setSelectedType(type.name.toLowerCase());
                        setValues((prev) => ({
                          ...prev,
                          type: type.name.toLowerCase(),
                        }));
                      });
                    }}
                  >
                    {isTransition ? (
                      <span>
                        <Loader2 className={'size-4 md:size-6 animate-spin'} />
                      </span>
                    ) : (
                      <span className=''>
                        {
                          <type.icon
                            className={cn(
                              'size-8 text-primary-500 group-hover:text-primary-500 dark:group-hover:text-primary-100',
                              selectedType === type.name.toLowerCase() &&
                                'text-muted-foreground',
                            )}
                          />
                        }
                      </span>
                    )}

                    <span
                      className={cn(
                        'text-xs font-medium text-wrap text-clip text-primary-500 dark:group-hover:text-primary-100',
                        selectedType === type.name.toLowerCase() &&
                          'font-semibold text-white',
                      )}
                    >
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
    </SectionWrapper>
  );
}
