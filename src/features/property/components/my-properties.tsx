'use client';

import { Pagination, usePagination } from '@ark-ui/react/pagination';
import {
  ArrowUpRightFromSquareIcon,
  CheckCheckIcon,
  PenLineIcon,
} from 'lucide-react';
import type { Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useQueryStates } from 'nuqs';
import { toast } from 'sonner';

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
} from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { usePropertyFilter } from '@/contexts/property-filter-context';
import { useSession } from '@/lib/auth-client';
import { prettifyText } from '@/lib/helpers/property-helpers';
import { useDeleteProperty, useUserProperties } from '../hooks/use-property';
import { basicFilterAndPaginateParams } from '../searchParams';
import {
  EmptyPropertiesState,
  Paginate,
  SortAndLimitFilter,
} from './property-listings';

export default function MyPropertyListings() {
  const { isTransition, startTransition } = usePropertyFilter();
  const queryStates = useQueryStates(basicFilterAndPaginateParams, {
    shallow: false,
    scroll: true,
    history: 'replace',
    startTransition,
    limitUrlUpdates: {
      method: 'throttle',
      timeMs: 250,
    },
  });

  const [{ offset, limit }] = queryStates;

  const {
    data: { properties, totalProperties },
  } = useUserProperties({
    offset: offset ?? '1',
    limit: limit ?? '10',
    sort: 'asc',
  });
  const { mutateAsync, isPending } = useDeleteProperty();
  const { data } = useSession();

  const pagination = usePagination({
    type: 'button',
    count: totalProperties,
    defaultPage: Number(offset),
    pageSize: Number(limit),
    siblingCount: 2,
    boundaryCount: 1,
  });

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
        <Pagination.RootProvider value={pagination} className={''}>
          <div className='space-y-8'>
            <div className='max-w-(--breakpoint-lg) mx-auto px-4'>
              <SortAndLimitFilter
                pagination={pagination}
                queryStates={queryStates}
                isPending={isTransition}
              />
            </div>

            <div
              className={
                'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              }>
              {properties?.map((property) => {
                return (
                  <Card key={property.id} className={'py-4 gap-4'}>
                    <CardContent className={'px-4'}>
                      <Carousel>
                        <CarouselContent>
                          {property.images.map((image, index) => (
                            <CarouselItem
                              key={index}
                              className='w-full h-full aspect-video'>
                              <Image
                                src={image}
                                alt={`Property Image ${index + 1}`}
                                className={
                                  'w-full h-full object-cover rounded-md'
                                }
                                width={400}
                                height={300}
                                sizes='(min-width: 1280px) 100vw, 80vw'
                                priority={false}
                              />
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                      </Carousel>
                    </CardContent>
                    <Separator />
                    <CardHeader className={'px-4'}>
                      <CardTitle className={'capitalize'}>
                        {property.roomType}
                      </CardTitle>
                      <CardDescription className={'capitalize'}>
                        {property.streetAddress}
                      </CardDescription>
                      <CardAction className={'self-center space-x-2'}>
                        <Badge variant={'outline'}>
                          {property.author.name}
                        </Badge>
                      </CardAction>
                    </CardHeader>
                    <Separator />
                    <CardContent className={'px-4'}>
                      {property.amenities.slice(0, 4).map((amenity, index) => (
                        <p
                          key={index}
                          className={'text-sm text-muted-foreground'}>
                          <span className={'inline-flex items-center gap-1'}>
                            <CheckCheckIcon className={'size-4'} />
                            {prettifyText(amenity)}
                          </span>
                        </p>
                      ))}
                      {property.amenities.length > 4 ? (
                        <span className={'text-sm text-muted-foreground'}>
                          more...
                        </span>
                      ) : null}
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
                            })}>
                            Edit Details <PenLineIcon className={'size-4'} />
                          </Link>

                          <Button
                            variant={'destructive'}
                            size={'sm'}
                            className={'mr-4'}
                            onClick={() => handleDeleteProperty(property.id)}
                            disabled={isPending}>
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
              queryStates={queryStates}
              isPending={isTransition}
            />
          </div>
        </Pagination.RootProvider>
      )}
    </div>
  );
}
