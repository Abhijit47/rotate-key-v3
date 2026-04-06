'use client';

import { IconHomePlus } from '@tabler/icons-react';
import {
  ArrowUpRightFromSquareIcon,
  ArrowUpRightIcon,
  CheckCheckIcon,
  HeartIcon,
  PenLineIcon,
  ThumbsUpIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

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

import {
  useDeleteProperty,
  usePublicProperties,
  useUserProperty,
} from '../hooks/use-property';

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { useSession } from '@/lib/auth-client';

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
        size='sm'>
        <Link href='#'>
          Learn More <ArrowUpRightIcon />
        </Link>
      </Button>
    </Empty>
  );
}

export function PropertyListings() {
  const { data: properties } = usePublicProperties();
  const { mutateAsync, isPending } = useDeleteProperty();
  const { data } = useSession();

  // const hasUserProperty = data?.user
  //   ? properties?.some((property) => property.authorId === data.user.id)
  //   : false;

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
          {properties?.map((property) => (
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
                <CardTitle className={'capitalize'}>{property.type}</CardTitle>
                <CardDescription className={'capitalize'}>
                  {property.streetAddress}
                </CardDescription>
                <CardAction className={'self-center space-x-2'}>
                  <Button variant={'destructive'} size={'icon-xs'}>
                    <HeartIcon className={'size-4'} />
                  </Button>
                  <Button variant={'default'} size={'icon-xs'}>
                    <ThumbsUpIcon className={'size-4 text-white'} />
                  </Button>
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
                      href={`/property/${property.id}/update`}
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
          ))}
        </div>
      )}
    </div>
  );
}

export function PropertyListing({ propertyId }: { propertyId: string }) {
  const { data: property } = useUserProperty(propertyId);
  return <div>{JSON.stringify(property, null, 2)}</div>;
}
