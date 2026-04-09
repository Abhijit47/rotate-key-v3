import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ProfileRadialChart from '@/features/my-profile/components/profile-radial-chart';

import Image from 'next/image';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { Separator } from '@/components/ui/separator';
import {
  IconBrandFacebook,
  IconBrandGoogle,
  IconBrandLinkedin,
  IconBrandX,
} from '@tabler/icons-react';
import Link from 'next/link';

const music = [
  {
    title: 'Midnight City Lights',
    artist: 'Neon Dreams',
    album: 'Electric Nights',
    duration: '3:45',
  },
  {
    title: 'Coffee Shop Conversations',
    artist: 'The Morning Brew',
    album: 'Urban Stories',
    duration: '4:05',
  },
  {
    title: 'Digital Rain',
    artist: 'Cyber Symphony',
    album: 'Binary Beats',
    duration: '3:30',
  },
];

export function ItemImage() {
  return (
    <div className='flex w-full flex-col gap-6'>
      <ItemGroup className='gap-4'>
        {music.map((song) => (
          <Item key={song.title} variant='outline' asChild role='listitem'>
            <a href='#'>
              <ItemMedia variant='image'>
                <Image
                  src={`https://avatar.vercel.sh/${song.title}`}
                  alt={song.title}
                  width={32}
                  height={32}
                  className='object-cover grayscale'
                />
              </ItemMedia>
              <ItemContent>
                <ItemTitle className='line-clamp-1'>
                  {song.title} -{' '}
                  <span className='text-muted-foreground'>{song.album}</span>
                </ItemTitle>
                <ItemDescription>{song.artist}</ItemDescription>
              </ItemContent>
              <ItemContent className='flex-none text-center'>
                <ItemDescription>{song.duration}</ItemDescription>
              </ItemContent>
            </a>
          </Item>
        ))}
      </ItemGroup>
    </div>
  );
}

export default function SocialAndNetworkPage() {
  return (
    <div className='flex flex-col gap-4 py-4 md:gap-6 md:py-6'>
      <div className='px-4 lg:px-6 space-y-6'>
        <div className={'grid grid-cols-12 gap-4'}>
          <div className={'col-span-full lg:col-span-8'}>
            <Card className={'gap-3 py-4 h-full'}>
              <CardHeader>
                <CardTitle>Social and Network</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent
                className={'space-y-4 h-full flex flex-col justify-center'}>
                <Button variant={'outline'} className={'w-full'}>
                  <IconBrandGoogle className={'size-4'} />
                  Sign in with Google
                </Button>
                <Button variant={'outline'} className={'w-full'}>
                  <IconBrandFacebook className={'size-4'} />
                  Sign in with Facebook
                </Button>
                <Button variant={'outline'} className={'w-full'}>
                  <IconBrandX className={'size-4'} />
                  Sign in with Twitter/X
                </Button>
                <Button variant={'outline'} className={'w-full'}>
                  <IconBrandLinkedin className={'size-4'} />
                  Sign in with LinkedIn
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className={'col-span-full lg:col-span-4'}>
            <ProfileRadialChart />
          </div>
        </div>
        <div className={'grid grid-cols-12'}>
          <div className={'col-span-full'}>
            <Card className={'gap-3 py-4'}>
              <CardHeader>
                <CardTitle>Recent Listening</CardTitle>
              </CardHeader>
              <CardContent className={''}>
                <ItemImage />
              </CardContent>
              <CardFooter>
                <Link
                  href={'#'}
                  className={buttonVariants({
                    variant: 'link',
                    size: 'sm',
                    className: 'w-full',
                  })}>
                  View More
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
