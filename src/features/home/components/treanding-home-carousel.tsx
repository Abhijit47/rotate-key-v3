'use client';

import AutoPlay from 'embla-carousel-autoplay';
import { ArrowUpRight, EyeIcon, PlusCircleIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { useGetTrendingProperties } from '@/features/engagement/hooks/use-engagements';
import { EmptyPropertiesState } from '@/features/property/components/property-listings';
import { cn, titleCaseSkipSpecial } from '@/lib/utils';

const isDev = process.env.NODE_ENV === 'development';

export default function TreandingHomeCarousel() {
  const { data } = useGetTrendingProperties();

  return (
    <div>
      {data.length === 0 ? (
        <EmptyPropertiesState
          title='No Trending Properties'
          description='Check back later to see top trending properties.'
          buttonText='Check Back Later'
          buttonLink='/swapings'
          buttonIcon={<PlusCircleIcon size={20} />}
        />
      ) : (
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
          <CarouselContent>
            {data.map((item) => (
              <CarouselItem
                key={item.id}
                className='group relative pl-4 hover:cursor-grab basis-10/12 xs:basis-8/12 sm:basis-6/12 lg:basis-4/12'>
                <div className='group relative w-full h-full aspect-square'>
                  <Badge className={'absolute top-2 right-2 z-10'}>
                    <EyeIcon /> {item?.views ?? 0}
                  </Badge>

                  <Image
                    src={item.property.images[0]}
                    alt={item.property.roomType}
                    width={300}
                    height={300}
                    className='rounded-lg w-full h-full object-cover'
                  />

                  <div
                    className={
                      'inline-flex w-full items-center justify-between gap-1 lg:gap-2 absolute left-0 bottom-0 backdrop-blur-xl bg-background/10 px-4 py-4 rounded-bl-xl rounded-br-xl'
                      // 'hidden group-hover:inline-flex translate-y-1 transition-all duration-300 delay-150 ease-in-out w-full items-center justify-between gap-1 lg:gap-2 absolute left-0 bottom-0 backdrop-blur-xl bg-background/10 px-4 py-4 rounded-bl-xl rounded-br-xl'
                    }>
                    <div className={'flex flex-col gap-y-1'}>
                      <h3 className='font-semibold text-background text-sm line-clamp-1'>
                        {titleCaseSkipSpecial(item.property.roomType)}
                      </h3>
                      <p
                        className={
                          'text-background/80 text-xs inline-flex items-center gap-2'
                        }>
                        {item.property.country.flag ? (
                          <img
                            src={item.property.country.flag}
                            alt={item.property.country.name}
                          />
                        ) : null}
                        {titleCaseSkipSpecial(item.property.country.name)}
                      </p>
                    </div>

                    <div className={''}>
                      <Link
                        href={`/property/${item.propertyId}`}
                        className={cn(
                          buttonVariants({
                            variant: 'default',
                            size: 'icon-xs',
                          }),
                        )}>
                        <span className='sr-only'>See this property</span>
                        <ArrowUpRight />
                      </Link>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}
    </div>
  );
}
