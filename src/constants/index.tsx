import { Route } from 'next';

type Navlink = {
  name: string;
  href: Route | `#${string}`;
};

export const navlinks: Navlink[] = [
  {
    name: 'Home',
    href: '/',
  },
  {
    name: 'About',
    href: '#',
  },
  {
    name: 'How it works',
    href: '#',
  },
  {
    name: 'Swapings',
    href: '/swapings',
  },
  {
    name: 'Contact',
    href: '#',
  },
];
