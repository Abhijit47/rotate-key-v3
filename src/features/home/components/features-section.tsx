import Image from 'next/image';

import SectionWrapper from '@/components/shared/section-wrapper';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { features } from '@/constants';

export default function FeaturesSection() {
  return (
    <section className='bg-primary/50 dark:bg-primary/70'>
      <SectionWrapper
        className={
          'space-y-6 lg:space-y-8 xl:space-y-12 py-8 lg:py-12 xl:py-16'
        }>
        {/* <SectionHeading align='center' className={'text-muted-foreground'}>
          <span className={'block'}>Features That Set Us Apart</span>
        </SectionHeading> */}

        <h2
          className={
            'text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-bold text-center font-primary bg-linear-to-t bg-clip-text text-transparent from-primary/60 to-primary/30'
          }>
          Features That Set Us Apart
        </h2>

        <div className='gap-4 md:gap-6 lg:gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full h-full'>
          {features.map((feature) => (
            <Card
              className={
                'lg:hover:-translate-y-2 transition-all delay-150 ease-in-out cursor-pointer w-full h-full ring-1 ring-primary-400 shadow-xl hover:shadow-md gap-4 py-2'
              }
              key={feature.id}>
              <CardContent className={'p-2'}>
                <AspectRatio ratio={1 / 1}>
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    className='w-full h-full object-contain'
                    // fill={true}
                    // sizes='(max-width: 768px) 100vw, 422px'
                    width={422}
                    height={300}
                  />
                </AspectRatio>
              </CardContent>
              <Separator />
              <CardHeader className={''}>
                <CardTitle>
                  <h4 className='font-medium text-base lg:text-lg text-center'>
                    {feature.title}
                  </h4>
                </CardTitle>
                <CardDescription>
                  <p className='font-regular text-muted-foreground text-sm md:text-base text-center'>
                    {feature.description}
                  </p>
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* <div className='gap-4 md:gap-6 lg:gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full h-full'>
          {features.map((feature) => (
            <figure
              key={feature.id}
              className={
                'h-full ring-1 p-4 ring-primary-400 shadow-xl hover:shadow-md transition-all delay-300 cursor-pointer ease-in-out rounded-lg w-full space-y-6'
              }>
              <div className={'w-full h-fit aspect-square'}>
                <Image
                  src={feature.image}
                  alt={feature.title}
                  className='w-full h-full object-contain'
                  // fill={true}
                  // sizes='(max-width: 768px) 100vw, 422px'
                  width={422}
                  height={300}
                />
              </div>

              <div
                className={'px-4 space-y-2 md:space-y-4 py-4 md:py-6 lg:py-8'}>
                <h4 className='font-medium text-base lg:text-lg text-center'>
                  {feature.title}
                </h4>
                <p className='font-regular text-secondary-400 text-sm md:text-base text-center'>
                  {feature.description}
                </p>
              </div>
            </figure>
          ))}
        </div> */}
      </SectionWrapper>
    </section>
  );
}
