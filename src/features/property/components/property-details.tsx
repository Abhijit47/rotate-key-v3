'use client';

import {
  ArrowDownFromLineIcon,
  BadgeCheck,
  BadgeCheckIcon,
  BathIcon,
  BedDoubleIcon,
  Building2Icon,
  CheckCircle2Icon,
  ChevronsUpDownIcon,
  EyeIcon,
  HomeIcon,
  MapPinCheckInsideIcon,
  MapPinnedIcon,
  PinIcon,
  RoadIcon,
  RulerIcon,
  TagIcon,
  Users2Icon,
} from 'lucide-react';
import { useState } from 'react';

import SectionWrapper from '@/components/shared/section-wrapper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { SelectProperty } from '@/drizzle/schema';
import { cn, titleCaseSkipSpecial } from '@/lib/utils';
import { useProperty } from '../hooks/use-property';
import { PropertyCardCarousel } from './property-listings';

type WhatWeOfferedProps = {
  property: Partial<SelectProperty>;
};

export function PropertyDetails({ propertyId }: { propertyId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: property } = useProperty(propertyId);

  return (
    <Card className={'gap-4 w-full'}>
      <CardHeader>
        <CardTitle className='flex justify-start items-center'>
          <h1 className='flex items-center gap-2 bg-primary px-2.5 py-1.5 rounded-full font-semibold text-foreground'>
            <TagIcon className={'size-4 md:size-5 lg:size-6'} />
            {titleCaseSkipSpecial(property.roomType)}
          </h1>
        </CardTitle>
        <CardAction>
          <Badge>
            <EyeIcon /> {property?.propertyStats?.views ?? 0}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <PropertyCardCarousel images={property.images} type='propertyDeatils' />
      </CardContent>

      <div className={'px-4 flex flex-wrap gap-4 w-full'}>
        <Card className={'flex-auto lg:flex-1'}>
          <CardContent>
            <CardDescription>
              <Collapsible
                className='flex flex-col gap-2 w-full'
                open={isOpen}
                onOpenChange={setIsOpen}>
                <div className='flex justify-between items-center gap-4'>
                  <div
                    className={cn(
                      'font-semibold text-sm text-wrap',
                      isOpen ? 'transition-none' : 'transition-all',
                    )}>
                    {isOpen ? (
                      <strong>Description:</strong>
                    ) : (
                      <p className={'text-sm font-normal tracking-normal'}>
                        <strong>Description:</strong>{' '}
                        {property.description.slice(0, 200)} ...
                      </p>
                    )}
                  </div>
                  <CollapsibleTrigger asChild>
                    <Button variant='ghost' size='icon-sm'>
                      <ChevronsUpDownIcon />
                      <span className='sr-only'>Toggle</span>
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className='flex flex-col gap-2 overflow-hidden transition-all data-closed:animate-collapsible-up data-open:animate-collapsible-down duration-300'>
                  <p className={'text-sm font-normal tracking-normal'}>
                    {property.description}
                  </p>
                  <Button
                    variant='link'
                    className='px-0 w-fit'
                    onClick={() => setIsOpen(false)}>
                    Show Less
                  </Button>
                </CollapsibleContent>
              </Collapsible>
            </CardDescription>
          </CardContent>

          <CardContent className={'space-y-4'}>
            <Separator />
            <CardDescription>
              <p className={'text-sm font-bold flex items-center gap-2'}>
                <RoadIcon className={'size-4'} />
                {property.streetAddress}
              </p>
              <p className={'text-sm font-bold flex items-center gap-2'}>
                <Building2Icon className={'size-4'} />
                {property.city.name}
              </p>
              <p className={'text-sm font-bold flex items-center gap-2'}>
                <MapPinnedIcon className={'size-4'} />
                {property.state.name}
              </p>
              <p className={'text-sm font-bold flex items-center gap-2'}>
                <MapPinCheckInsideIcon className={'size-4'} />
                {property.country.name}
              </p>
              <p className={'text-sm font-bold flex items-center gap-2'}>
                <PinIcon className={'size-4'} />
                {property.zipcode}
              </p>
            </CardDescription>

            <Separator />

            <CardDescription>
              <div
                className={'flex items-center justify-start gap-4 flex-wrap'}>
                <p
                  className={
                    'flex items-center gap-2 ring-muted-foreground ring-1 rounded-full px-3 py-0.5 w-fit text-xs font-semibold'
                  }>
                  <RulerIcon className={'size-4'} />
                  {property.area} sqft
                </p>
                <p
                  className={
                    'flex items-center gap-2 ring-muted-foreground ring-1 rounded-full px-3 py-0.5 w-fit text-xs font-semibold'
                  }>
                  <HomeIcon className={'size-4'} />
                  {property.bedRooms}
                </p>
                <p
                  className={
                    'flex items-center gap-2 ring-muted-foreground ring-1 rounded-full px-3 py-0.5 w-fit text-xs font-semibold'
                  }>
                  <BathIcon className={'size-4'} />
                  {property.bathRooms}
                </p>
                <p
                  className={
                    'flex items-center gap-2 ring-muted-foreground ring-1 rounded-full px-3 py-0.5 w-fit text-xs font-semibold'
                  }>
                  <BedDoubleIcon className={'size-4'} />
                  {property.beds}
                </p>
                <p
                  className={
                    'flex items-center gap-2 ring-muted-foreground ring-1 rounded-full px-3 py-0.5 w-fit text-xs font-semibold'
                  }>
                  <Users2Icon className={'size-4'} />
                  {property.guests}
                </p>
              </div>
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <div className={'px-4'}>
        <Card>
          <CardContent>
            <WhatWeOffered property={property} />
          </CardContent>
          {/* <CardFooter className="justify-end">
            <ReviewDrawer propertyId={property.id} />
          </CardFooter> */}
        </Card>
      </div>
    </Card>
  );
}

export default function WhatWeOffered(props: WhatWeOfferedProps) {
  const { property } = props;

  return (
    <section>
      <SectionWrapper>
        <div className={'space-y-2 md:space-y-6'}>
          <h4
            className={'text-2xl font-semibold inline-flex items-center gap-2'}>
            <span>
              <BadgeCheckIcon
                className={'size-6 inline-block text-primary-500'}
              />
            </span>
            <span>What this place offer</span>
          </h4>

          <ul className={'grid grid-cols-2 gap-2 max-w-lg w-full'}>
            {property?.amenities?.slice(0, 6).map((amenity) => (
              <li
                key={amenity}
                className={
                  'text-sm font-medium capitalize inline-flex items-center gap-2'
                }>
                <span>
                  <CheckCircle2Icon
                    className={'inline-block size-4 text-primary-500'}
                  />
                </span>
                <span>{amenity}</span>
              </li>
            ))}
          </ul>
          <PropertyDetailsModal property={property} />
        </div>
      </SectionWrapper>
    </section>
  );
}

type PropertyDetailsModalProps = {
  property: Partial<SelectProperty>;
};

export function PropertyDetailsModal(props: PropertyDetailsModalProps) {
  const { property } = props;

  return (
    <Dialog defaultOpen={false}>
      <DialogTrigger asChild>
        <Button variant='outline'>
          Show more <ArrowDownFromLineIcon />{' '}
        </Button>
      </DialogTrigger>
      <DialogOverlay className='z-50 fixed inset-0 bg-black/30' />

      <DialogContent className='max-w-sm md:max-w-2xl h-full max-h-9/12'>
        <DialogHeader>
          <DialogTitle>Property Information</DialogTitle>
          <DialogDescription>
            Here is the list of all amenities and features of this property.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className='pr-4 w-full h-full overflow-y-auto'>
          <div className={'py-4 space-y-4'}>
            <Card className={'p-2'}>
              <CardContent className={'p-2'}>
                <dl className={'space-y-1 inline-grid grid-cols-2 gap-2'}>
                  <dt className={'text-sm font-semibold'}>Region: </dt>
                  <dd className={'text-sm capitalize'}>
                    {property?.region?.name}
                  </dd>

                  <dt className={'text-sm font-semibold'}>
                    Country / Nation:{' '}
                  </dt>
                  <dd className={'text-sm capitalize flex items-center gap-2'}>
                    {property?.country?.flag ? (
                      <img
                        src={property.country.flag}
                        alt={property.country.name}
                        className={'h-4 w-auto rounded-md'}
                      />
                    ) : null}

                    {property?.country?.name}
                  </dd>

                  <dt className={'text-sm font-semibold'}>
                    State / Province:{' '}
                  </dt>
                  <dd className={'text-sm capitalize'}>
                    {property?.state?.name}
                  </dd>

                  <dt className={'text-sm font-semibold'}>City / Town: </dt>
                  <dd className={'text-sm capitalize'}>
                    {property?.city?.name}
                  </dd>

                  <dt className={'text-sm font-semibold'}>Street Address: </dt>
                  <dd className={'text-sm capitalize'}>
                    {property.streetAddress}
                  </dd>

                  <dt className={'text-sm font-semibold'}>Zipcode: </dt>
                  <dd className={'text-sm capitalize'}>{property.zipcode}</dd>

                  <dt className={'text-sm font-semibold'}>Area:</dt>
                  <dd className={'text-sm capitalize'}>
                    {property.area} {property.areaUnit}
                  </dd>

                  <dt className={'text-sm font-semibold'}>Room: </dt>
                  <dd className={'text-sm capitalize'}>{property.roomType}</dd>

                  <dt className={'text-sm font-semibold'}>Ownership: </dt>
                  <dd className={'text-sm capitalize'}>{property.ownership}</dd>

                  <dt className={'text-sm font-semibold'}>Swaping: </dt>
                  <dd className={'text-sm capitalize'}>{property.swaping}</dd>

                  <dt className={'text-sm font-semibold'}>Accomodation: </dt>
                  <dd className={'text-sm capitalize'}>
                    {property.accommodation}
                  </dd>

                  <dt className={'text-sm font-semibold'}>Surrounding: </dt>
                  <dd className={'text-sm capitalize'}>
                    {property.surrounding}
                  </dd>

                  <dt className={'text-sm font-semibold'}>Environment: </dt>
                  <dd className={'text-sm capitalize'}>
                    {property.environment}
                  </dd>

                  <dt className={'text-sm font-semibold'}>Rent Period: </dt>
                  <dd className={'text-sm capitalize'}>
                    {property.rentPeriod}
                  </dd>
                </dl>
              </CardContent>
            </Card>

            <Card className={'p-2 gap-0 divide-y-2 divide-y-primary-500'}>
              <CardHeader className={'px-0 space-y-2'}>
                <h3 className={'font-semibold'}>
                  Property Amenities & Features
                </h3>
              </CardHeader>
              <CardContent className={'p-2'}>
                <ul className={'grid grid-cols-1 sm:grid-cols-2 gap-2'}>
                  {property?.amenities?.map((amenity) => (
                    <li
                      key={crypto.randomUUID()}
                      className={
                        'text-sm font-medium capitalize inline-flex items-center gap-2'
                      }>
                      <span>
                        <BadgeCheckIcon
                          className={'inline-block size-4 text-primary-500'}
                        />
                      </span>
                      <span>{amenity}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className={'p-2 gap-0 divide-y-2 divide-y-primary-500'}>
              <CardHeader className={'px-0 space-y-2'}>
                <h3 className={'font-semibold'}>Property Accessibilities</h3>
              </CardHeader>
              <CardContent className={'p-2'}>
                <ul className={'grid grid-cols-1 sm:grid-cols-2 gap-2'}>
                  {property?.accessibilities?.map((accessibility) => (
                    <li
                      key={crypto.randomUUID()}
                      className={
                        'text-sm font-medium capitalize inline-flex items-center gap-2'
                      }>
                      <span>
                        <BadgeCheck
                          className={'inline-block size-4 text-primary-500'}
                        />
                      </span>
                      <span>{accessibility}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className={'p-2 gap-0 divide-y-2 divide-y-primary-500'}>
              <CardHeader className={'px-0 space-y-2'}>
                <h3 className={'font-semibold'}>Property Rules</h3>
              </CardHeader>
              <CardContent className={'p-2'}>
                <ul className={'grid grid-cols-1 sm:grid-cols-2 gap-2'}>
                  {property?.rules?.map((rule) => (
                    <li
                      key={crypto.randomUUID()}
                      className={
                        'text-sm font-medium capitalize inline-flex items-center gap-2'
                      }>
                      <span>
                        <BadgeCheck
                          className={'inline-block size-4 text-primary-500'}
                        />
                      </span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className={'p-2 gap-0 divide-y-2 divide-y-primary-500'}>
              <CardHeader className={'px-0 space-y-2'}>
                <h3 className={'font-semibold'}>Host Languages</h3>
              </CardHeader>
              <CardContent className={'p-2'}>
                <ul className={'grid grid-cols-1 sm:grid-cols-2 gap-2'}>
                  {property?.knownLanguages?.map((language) => (
                    <li
                      key={crypto.randomUUID()}
                      className={
                        'text-sm font-medium capitalize inline-flex items-center gap-2'
                      }>
                      <span>
                        <BadgeCheck
                          className={'inline-block size-4 text-primary-500'}
                        />
                      </span>
                      <span>{language}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <DialogFooter className='sm:justify-end'>
          <DialogClose asChild>
            <Button type='button' variant='outline'>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
