'use client';

import { testimonials } from '@/constants';
import AutoPlay from 'embla-carousel-autoplay';
import { Star, StarHalf } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
  Card,
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
  type CarouselApi,
} from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export default function Testimonials() {
  const [api, setApi] = useState<CarouselApi>();
  // const [current, setCurrent] = useState(0);
  //  const [count, setCount] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    //  setCount(api.scrollSnapList().length);
    // setCurrent(api.selectedScrollSnap() + 1);

    // api.on('select', () => {
    //   setCurrent(api.selectedScrollSnap() + 1);
    // });

    api.on('slidesInView', () => {
      // console.log('slidesInView', api.selectedScrollSnap());
      setCurrentSlide(api.selectedScrollSnap());
      // setCurrentSlide(api.selectedScrollSnap() + 1);
      // setCurrent(api.selectedScrollSnap() + 1);
    });

    return () => {
      api.destroy();
    };
  }, [api]);

  return (
    <div className='mx-auto w-full'>
      <Carousel
        plugins={[AutoPlay({ delay: 3000 })]}
        opts={{
          loop: true,
          align: 'start',
          skipSnaps: true,
          startIndex: 0,
          active: true,
        }}
        setApi={setApi}
        className='w-full'>
        <CarouselContent>
          {testimonials.map((testimonial, idx) => (
            <CarouselItem
              key={testimonial.id}
              className='sm:basis-1/2 md:basis-1/4'>
              <Card
                className={cn(
                  currentSlide === idx &&
                    'bg-primary dark:bg-primary ring-primary',
                  'gap-4 aspect-auto lg:aspect-square',
                )}>
                <CardHeader>
                  <CardTitle>
                    <h5
                      className={cn(
                        currentSlide === idx
                          ? 'text-background dark:text-foreground'
                          : 'text-primary',
                      )}>
                      {testimonial.name}
                    </h5>
                  </CardTitle>
                </CardHeader>
                <Separator />
                <CardContent>
                  <CardDescription>
                    <p
                      className={cn(
                        currentSlide === idx
                          ? 'text-accent dark:text-accent-foreground'
                          : 'text-foreground dark:text-muted-foreground',
                      )}>
                      {testimonial.message}
                    </p>
                  </CardDescription>
                </CardContent>

                <CardFooter>
                  <Star className={'size-4 stroke-yellow-400'} />
                  <Star className={'size-4 stroke-yellow-400'} />
                  <Star className={'size-4 stroke-yellow-400'} />
                  <Star className={'size-4 stroke-yellow-400'} />
                  <StarHalf className={'size-4 stroke-yellow-400'} />
                </CardFooter>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      {/* <div className='py-2 text-muted-foreground text-sm text-center'>
        Slide {current} of {count}
      </div> */}
    </div>
  );
}
