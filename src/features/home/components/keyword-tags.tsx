'use client';

import Autoplay from 'embla-carousel-autoplay';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { initialTags } from '@/constants';

const isDev = process.env.NODE_ENV === 'development';

export default function KeywordTags() {
  // const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <Carousel
      plugins={
        isDev
          ? undefined
          : [
              Autoplay({
                delay: 2000,
                stopOnMouseEnter: true,
                stopOnInteraction: false,
                stopOnFocusIn: true,
                active: true,
              }),
            ]
      }
      opts={{
        active: true,
        align: 'start',
        loop: true,
        slidesToScroll: 1,
        skipSnaps: true,
        watchSlides: (emblaApi) => {
          console.log('watchSlides', emblaApi);
        },
        startIndex: 0,
      }}
      orientation='vertical'
      className='w-full h-full'>
      <CarouselContent className='px-1 h-16'>
        {initialTags.map((tag, index) => (
          <CarouselItem
            key={index}
            className='mt-1 pt-1 basis-2/4 md:basis-1/2'>
            <div
              // className={cn(
              //   currentSlide === index
              //     ? 'bg-primary-500 ring-primary-100 text-tertiary-50'
              //     : 'bg-background ring-secondary-500 text-muted-foreground',
              //   'w-full h-full inline-flex justify-center items-center rounded-lg px-4 py-2 font-semibold text-sm sm:text-base lg:text-lg shadow-lg'
              // )}
              className={
                'w-full h-16 inline-flex justify-center items-center rounded-lg px-4 py-2 font-semibold text-sm sm:text-base shadow-lg bg-background ring-secondary-500 text-muted-foreground hover:cursor-grab'
              }>
              {tag}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
