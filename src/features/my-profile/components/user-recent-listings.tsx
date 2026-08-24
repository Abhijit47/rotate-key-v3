'use client';

import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { useUserProperties } from '@/features/property/hooks/use-property';
import { titleCaseSkipSpecial } from '@/lib/utils';

export default function UserRecentListings() {
  const {
    data: { properties, totalProperties },
  } = useUserProperties({
    limit: '5',
    offset: '1',
    sort: 'desc',
  });

  return (
    <Card className={'gap-3 py-4'}>
      <CardHeader>
        <CardTitle>Recent Listening ({totalProperties})</CardTitle>
      </CardHeader>
      <CardContent className={''}>
        <div className='flex flex-col gap-6 w-full'>
          <ItemGroup className='gap-4'>
            {properties.map((item) => (
              <Item key={item.id} variant='outline' asChild role='listitem'>
                <Link href='#'>
                  <ItemMedia variant='image'>
                    <Image
                      // src={`https://avatar.vercel.sh/${item.type}`}
                      src={item.images[0]}
                      alt={item.roomType}
                      width={32}
                      height={32}
                      className='grayscale object-cover'
                    />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle className='flex items-center gap-1'>
                      {titleCaseSkipSpecial(item.roomType)} -{' '}
                      <span className=''>
                        {item.country.flag ? (
                          <img
                            src={item.country.flag}
                            alt={item.country.name}
                            width={20}
                            height={20}
                          />
                        ) : null}
                      </span>
                    </ItemTitle>
                    <ItemDescription className='line-clamp-1'>
                      {item.region.name}, {item.country.name}, {item.state.name}
                      , {item.city.name},{item.streetAddress}, {item.zipcode}
                    </ItemDescription>
                  </ItemContent>
                  <ItemContent className='flex-none text-center'>
                    <ItemDescription>
                      {formatDistanceToNow(item.createdAt, {
                        addSuffix: true,
                        includeSeconds: true,
                      })}
                    </ItemDescription>
                  </ItemContent>
                </Link>
              </Item>
            ))}
          </ItemGroup>
        </div>
      </CardContent>
      <CardFooter>
        <Link
          href={'/my-properties'}
          className={buttonVariants({
            variant: 'link',
            size: 'sm',
            className: 'w-full',
          })}>
          View More
        </Link>
      </CardFooter>
    </Card>
  );
}
