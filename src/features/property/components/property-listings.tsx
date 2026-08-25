'use client';

import { Pagination, UsePaginationReturn } from '@ark-ui/react/pagination';
import { IconHomePlus } from '@tabler/icons-react';
import AutoPlay from 'embla-carousel-autoplay';
import {
  AlertCircleIcon,
  ArrowLeftRightIcon,
  ArrowUpRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react';
import { Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UseQueryStatesReturn } from 'nuqs';
import { ErrorBoundary, getErrorMessage } from 'react-error-boundary';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Field, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { sortOrderEnum } from '@/constants/property-assets-enums';
import { cn } from '@/lib/utils';
import {
  basicFilterAddonParams,
  basicFilterAndPaginateParams,
} from '../searchParams';

const isDev = process.env.NODE_ENV === 'development';

interface EmptyPropertiesProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: Route;
  buttonIcon: React.ReactNode;
}

export function EmptyPropertiesState(props: EmptyPropertiesProps) {
  const { title, description, buttonText, buttonLink, buttonIcon } = props;
  return (
    <Empty className='mx-auto border border-dashed min-w-sm'>
      <EmptyHeader>
        <EmptyMedia variant='icon'>
          <IconHomePlus />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className='flex-wrap justify-center items-center gap-2'>
        <Button asChild size={'sm'}>
          <Link href={buttonLink}>
            {buttonIcon}
            {buttonText}
          </Link>
        </Button>
        <Button variant='outline' asChild size={'sm'}>
          <Link href='/swapings'>
            Explore Swapings <ArrowLeftRightIcon />
          </Link>
        </Button>
      </EmptyContent>
      <Button
        variant='link'
        asChild
        className='text-muted-foreground'
        size='sm'>
        <Link href='#'>
          Learn More <ArrowUpRightIcon />
        </Link>
      </Button>
    </Empty>
  );
}

type SortAndLimitFilterProps = {
  pagination: UsePaginationReturn;
  queryStates: UseQueryStatesReturn<
    typeof basicFilterAndPaginateParams | typeof basicFilterAddonParams
  >;
  isPending?: boolean;
  isLabelShow?: boolean;
};

export function SortAndLimitFilter(props: SortAndLimitFilterProps) {
  const { pagination, queryStates, isPending, isLabelShow } = props;
  // const { isTransition, startTransition } = usePropertyFilter();
  // const [{ limit, sort }, setValues] = useQueryStates(
  //   basicFilterAndPaginateParams,
  //   {
  //     shallow: false,
  //     scroll: true,
  //     history: "replace",
  //     startTransition,
  //     limitUrlUpdates: {
  //       method: "throttle",
  //       timeMs: 250,
  //     },
  //   },
  // );

  const [{ limit, sort }, setValues] = queryStates;

  return (
    <div className='flex flex-wrap md:flex-nowrap items-center gap-3'>
      <Field className='gap-2'>
        <FieldLabel
          htmlFor='per-page'
          className={cn(isLabelShow ? '' : 'sr-only')}>
          Items per page:
        </FieldLabel>
        <Select
          disabled={isPending}
          value={String(pagination.pageSize)}
          onValueChange={(value) => {
            setValues((prev) => {
              return {
                ...prev,
                limit: value,
              };
            });
            pagination.setPageSize(Number(value));
          }}>
          <SelectTrigger className='w-full' id='per-page' size='sm'>
            <SelectValue placeholder={`show ${limit} properties`}>
              Show {limit} properties
            </SelectValue>
          </SelectTrigger>
          <SelectContent position='popper'>
            <SelectGroup>
              <SelectLabel>Per Page</SelectLabel>
              <SelectItem value='5'>5</SelectItem>
              <SelectItem value='10'>10</SelectItem>
              <SelectItem value='20'>20</SelectItem>
              <SelectItem value='50'>50</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      <Field className='gap-2'>
        <FieldLabel
          htmlFor='sort-order'
          className={cn(isLabelShow ? '' : 'sr-only')}>
          Sort
        </FieldLabel>
        <Select
          disabled={isPending}
          value={sort}
          onValueChange={(value) => {
            setValues((prev) => {
              return {
                ...prev,
                sort: value as 'asc' | 'desc',
              };
            });
          }}>
          <SelectTrigger className='w-full' id='sort-order' size='sm'>
            <SelectValue placeholder={`Order by ${sort}`}>
              Order by {sort}
            </SelectValue>
          </SelectTrigger>
          <SelectContent position='popper'>
            <SelectGroup>
              <SelectLabel>Sort Order</SelectLabel>
              {Object.entries(sortOrderEnum).map(([key, value]) => (
                <SelectItem key={key} value={value}>
                  {key}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </div>
  );
}

type PaginateProps = {
  pagination: UsePaginationReturn;
  queryStates: UseQueryStatesReturn<
    typeof basicFilterAndPaginateParams | typeof basicFilterAddonParams
  >;
  isPending?: boolean;
};

export function Paginate(props: PaginateProps) {
  const { pagination, queryStates, isPending } = props;

  // const { isTransition, startTransition } = usePropertyFilter();
  // const [{ offset }, setValues] = useQueryStates(basicFilterAndPaginateParams, {
  //   shallow: false,
  //   scroll: true,
  //   history: "replace",
  //   startTransition,
  //   limitUrlUpdates: {
  //     method: "throttle",
  //     timeMs: 250,
  //   },
  // });

  const [{ offset }, setValues] = queryStates;

  const currentOffset = Number(offset) || 1;

  const disablePrevTrigger = currentOffset <= 1 || isPending;
  const disableNextTrigger =
    currentOffset >= pagination.totalPages || isPending;

  return (
    <div className={'w-full flex items-center justify-center'}>
      <div className='space-y-2'>
        <div className='flex items-center gap-2'>
          <Pagination.PrevTrigger asChild>
            <Button
              disabled={disablePrevTrigger}
              variant={disablePrevTrigger ? 'ghost' : 'outline'}
              onClick={() => {
                setValues((prev) => {
                  const nextOffset = Math.max(1, Number(prev.offset) - 1);
                  return {
                    ...prev,
                    offset: String(nextOffset),
                  };
                });
              }}>
              <ChevronLeftIcon />
              Prev
            </Button>
          </Pagination.PrevTrigger>
          {pagination.pages.map((page, index) =>
            page.type === 'page' ? (
              <Pagination.Item key={index} {...page} asChild>
                <Button
                  variant={page.value === currentOffset ? 'default' : 'outline'}
                  onClick={() => {
                    setValues((prev) => {
                      return { ...prev, offset: String(page.value) };
                    });
                  }}>
                  {page.value}
                </Button>
              </Pagination.Item>
            ) : (
              <Pagination.Ellipsis
                key={index}
                index={index}
                className={buttonVariants()}>
                &#8230;
              </Pagination.Ellipsis>
            ),
          )}
          <Pagination.NextTrigger asChild>
            <Button
              disabled={disableNextTrigger}
              variant={disableNextTrigger ? 'ghost' : 'outline'}
              onClick={() => {
                setValues((prev) => {
                  // we can go pagination.totalPages upto
                  const nextOffset = Math.min(
                    pagination.totalPages,
                    Number(prev.offset || 1) + 1,
                  );
                  return {
                    ...prev,
                    offset: String(nextOffset),
                  };
                });
              }}>
              Next <ChevronRightIcon />
            </Button>
          </Pagination.NextTrigger>
        </div>

        <p className={'text-muted-foreground text-center text-sm'}>
          Page {pagination.page} of {pagination.totalPages}
        </p>
      </div>
    </div>
  );
}

type PropertyErrorBoundaryProps = {
  children: React.ReactNode;
  fallBackText?: string;
};

export function PropertyErrorBoundary(props: PropertyErrorBoundaryProps) {
  const { children, fallBackText } = props;
  const router = useRouter();

  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <div className='flex justify-center items-center w-full h-dvh'>
          <Alert variant='destructive' className='mx-auto max-w-lg'>
            <AlertCircleIcon />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {fallBackText || 'Something went wrong.'}
            </AlertDescription>

            <AlertDescription>
              <pre className='font-sans text-sm'>{getErrorMessage(error)}</pre>
            </AlertDescription>
            <div className='mt-4 w-full'>
              <Button
                size='sm'
                variant='outline'
                onClick={() => {
                  resetErrorBoundary();
                  router.refresh();
                }}>
                Try again
              </Button>
            </div>
          </Alert>
        </div>
      )}
      onError={(error, info) => {
        // Log the error to your error reporting service
        console.error('Profile Error:', error);
      }}
      onReset={() => {
        // Reset any state that may have caused the error
        router.refresh();
      }}>
      {/* Components protected by this boundary */}
      {children}
    </ErrorBoundary>
  );
}

type PropertyCardCarouselProps = {
  images: string[];
  type: 'propertyCard' | 'propertyDeatils';
};

export function PropertyCardCarousel(props: PropertyCardCarouselProps) {
  const { images, type } = props;

  switch (type) {
    case 'propertyCard':
      if (images.length === 0) {
        return (
          <CardContent className={'px-4'}>
            <div className={'aspect-video w-full h-full'}>
              <Image
                src={'https://placehold.co/600x600/png?text=No+Image'}
                alt='no-image-available'
                width={500}
                height={500}
                className={'w-full h-full object-cover'}
              />
            </div>
          </CardContent>
        );
      }
      return (
        <CardContent className={'px-4'}>
          <Carousel
            plugins={isDev ? undefined : [AutoPlay({ delay: 3000 })]}
            opts={{
              loop: true,
              direction: 'ltr',
              dragFree: true,
              dragThreshold: 10,
              duration: 500,
              startIndex: 0,
              slidesToScroll: 'auto',
            }}>
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index} className='aspect-video'>
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
      );

    case 'propertyDeatils':
      if (images.length === 0) {
        return (
          <div className={'aspect-20/9 object-cover w-full h-full'}>
            <Card className={'w-full h-full'}>No images available</Card>
          </div>
        );
      }
      return (
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
          <CarouselContent className={'aspect-video w-full h-full'}>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <Image
                  src={image}
                  alt={`Carousel Image for property index ${index}`}
                  className={'object-cover w-full h-full rounded-lg'}
                  width={500}
                  height={300}
                  priority={true}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className='-left-2' />
          <CarouselNext className='-right-px' />
        </Carousel>
      );

    default:
      return (
        <div>
          <Card className={'w-full h-full'}>No images available</Card>
        </div>
      );
  }
}
