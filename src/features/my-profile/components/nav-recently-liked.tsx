import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';

const people = [
  {
    username: 'shadcn',
    avatar: 'https://github.com/shadcn.png',
    email: 'shadcn@vercel.com',
  },
  {
    username: 'maxleiter',
    avatar: 'https://github.com/maxleiter.png',
    email: 'maxleiter@vercel.com',
  },
  {
    username: 'evilrabbit',
    avatar: 'https://github.com/evilrabbit.png',
    email: 'evilrabbit@vercel.com',
  },
];

export function ItemGroupExample() {
  return (
    <ItemGroup className='w-full space-y-2'>
      {people.map((person) => (
        <Item key={person.username} variant='outline' size={'sm'}>
          <ItemMedia>
            <Avatar>
              <AvatarImage src={person.avatar} className='grayscale' />
              <AvatarFallback>{person.username.charAt(0)}</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent className='gap-1'>
            <ItemTitle>{person.username}</ItemTitle>
            <ItemDescription>{person.email}</ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  );
}

export default function NavRecentlyLiked() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Recently Liked Profiles</SidebarGroupLabel>
      <SidebarGroupContent className='flex flex-col gap-2'>
        <ItemGroupExample />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
