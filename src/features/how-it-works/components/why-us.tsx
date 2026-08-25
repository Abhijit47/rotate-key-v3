import Image from 'next/image';

import SectionBadge from '@/components/shared/section-badge';
import SectionWrapper from '@/components/shared/section-wrapper';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Marker, MarkerContent } from '@/components/ui/marker';
import { Separator } from '@/components/ui/separator';
import { whyRotateKeys } from '@/constants';
import { cn } from '@/lib/utils';

export default function WhyUs() {
  return (
    <section className={'py-8 sm:py-12 md:py-16 lg-py-20'}>
      <SectionWrapper className={'space-y-8 md:space-y-12 lg:space-y-16'}>
        <div className={'space-y-4 md:space-y-6 lg:space-y-8'}>
          <SectionBadge align='center' className={'bg-muted'}>
            Uniqueness of Us
          </SectionBadge>
          <Marker variant='separator' className='mx-auto w-full max-w-3xl'>
            <MarkerContent>
              <h2
                className={cn(
                  'text-muted-foreground',
                  'text-center col-span-3 2xl:col-span-1 text-xl xs:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-medium xs:font-semibold lg:font-bold',
                )}>
                Why <span className={'inline-block text-primary'}>R</span>
                otate <span className={'inline-block text-primary'}>K</span>
                eys?
              </h2>
            </MarkerContent>
          </Marker>
        </div>
        <div
          className={
            'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8'
          }>
          {whyRotateKeys.map((item) => (
            <Card
              key={item.id}
              className={
                'shadow-md hover:shadow-lg hover:cursor-pointer transition-all delay-150 ease-in-out'
              }>
              <CardContent>
                <AspectRatio ratio={1 / 1}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    className={'w-full h-full object-contain'}
                    width={324}
                    height={320}
                  />
                </AspectRatio>
              </CardContent>

              <Separator />

              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
          {/* {whyTurnKeys.map((item) => (
            <figure
              key={item.id}
              className={
                'flex flex-col p-2 items-center justify-center aspect-square space-y-2 md:space-y-4 lg:space-y-6'
              }>
              <Image
                src={item.image}
                alt={item.title}
                className={'w-full h-full object-contain'}
                width={324}
                height={320}
              />
              <figcaption
                className={'text-base lg:text-xl font-semibold lg:font-bold'}>
                {item.title}
              </figcaption>
              <p className={'text-sm sm:text-base md:text-lg text-center'}>
                {item.description}
              </p>
            </figure>
          ))} */}
        </div>
      </SectionWrapper>
    </section>
  );
}
