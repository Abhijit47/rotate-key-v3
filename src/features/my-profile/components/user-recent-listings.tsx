'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import { useUserProperties } from '@/features/property/hooks/use-property';

export default function UserRecentListings() {
  const { data } = useUserProperties();
  return (
    <Card className={'gap-3 py-4'}>
      <CardHeader>
        <CardTitle>Recent Listening</CardTitle>
      </CardHeader>
      <CardContent className={''}>
        <div className='flex w-full flex-col gap-6'>
          <ItemGroup className='gap-4'>
            {data.map((item) => (
              <Item key={item.id} variant='outline' asChild role='listitem'>
                <Link href='#'>
                  <ItemMedia variant='image'>
                    <Image
                      // src={`https://avatar.vercel.sh/${item.type}`}
                      src={item.images[0]}
                      alt={item.type}
                      width={32}
                      height={32}
                      className='object-cover grayscale'
                    />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle className='line-clamp-1'>
                      {item.type} -{' '}
                      <span className='text-muted-foreground'>
                        {item.author.name}
                      </span>
                    </ItemTitle>
                    <ItemDescription>{item.streetAddress}</ItemDescription>
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
          })}
        >
          View More
        </Link>
      </CardFooter>
    </Card>
  );
}
