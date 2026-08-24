'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetHoldedProperties } from '@/features/engagement/hooks/use-engagements';
import { titleCaseSkipSpecial } from '@/lib/utils';

export default function NavPropertyHold() {
  const { data, isLoading } = useGetHoldedProperties();

  return (
    <SidebarGroup>
      {isLoading ? (
        <SidebarGroupLabel>
          <Skeleton className='w-full h-2' />

          <SidebarGroupContent className='flex flex-col gap-2'>
            <ItemGroup className='space-y-2 w-full'>
              {Array.from({ length: 5 }).map((_, i) => (
                <Item key={i} variant='outline' size={'sm'}>
                  <Skeleton className='w-full h-2' />
                  <Skeleton className='w-full h-2' />
                  <Skeleton className='w-full h-2' />
                </Item>
              ))}
            </ItemGroup>
          </SidebarGroupContent>
        </SidebarGroupLabel>
      ) : (
        <>
          <SidebarGroupLabel>Property on Hold({data.length})</SidebarGroupLabel>
          <SidebarGroupContent className='flex flex-col gap-2'>
            <ItemGroup className='space-y-2 w-full'>
              {data.slice(0, 4).map((item) => {
                return (
                  <Item key={item.id} variant='outline' size={'sm'}>
                    <ItemMedia>
                      <ItemMedia variant='image'>
                        <Image
                          // src={`https://avatar.vercel.sh/${item.type}`}
                          src={item.property.images[0]}
                          alt={item.property.roomType}
                          width={32}
                          height={32}
                          className='grayscale object-cover'
                        />
                      </ItemMedia>
                    </ItemMedia>
                    <ItemContent className='gap-1'>
                      <ItemTitle className='flex items-center gap-1'>
                        {titleCaseSkipSpecial(item.property.roomType)} -{' '}
                        <span className=''>
                          {item.property.country.flag ? (
                            <img
                              src={item.property.country.flag}
                              alt={item.property.country.name}
                              width={20}
                              height={20}
                            />
                          ) : null}
                        </span>
                      </ItemTitle>
                      <ItemDescription className='line-clamp-1'>
                        {item.property.region.name},{' '}
                        {item.property.country.name}, {item.property.state.name}
                        , {item.property.city.name},
                        {item.property.streetAddress}, {item.property.zipcode}
                      </ItemDescription>
                    </ItemContent>
                  </Item>
                );
              })}
            </ItemGroup>
            {data.length > 4 ? (
              <div className='flex justify-center items-center'>
                <Button variant='outline' size={'xs'}>
                  View All
                </Button>
              </div>
            ) : (
              <div className='flex justify-center items-center'>
                <Button variant='outline' size={'xs'} asChild>
                  <Link href='/swapings' prefetch>
                    No Hold properties
                  </Link>
                </Button>
              </div>
            )}
          </SidebarGroupContent>
        </>
      )}
    </SidebarGroup>
  );
}
