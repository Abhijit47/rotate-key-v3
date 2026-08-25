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
    href: '/about',
  },
  {
    name: 'How it works',
    href: '/how-it-works',
  },
  {
    name: 'Swapings',
    href: '/swapings',
  },
  {
    name: 'Notifications',
    href: '/notifications',
  },
  {
    name: 'Pricing',
    href: '#',
  },
];

export const initialTags = [
  'Global Community',
  'Personalized Matches',
  'Discover Your Perfect Home Exchange',
  'Verified Profiles for Secure Swaping',
  'Affordable and Flexible Travel',
  'Earn Points While You Travel',
  '24/7 Support for a Seamless Experience',
  'Real-Time Notifications and Updates',
  'AI-Powered Recommendations',
  'Wishlist for Your Dream Destinations',
  'Easy Communication and Planning',
  'Flexible Dates for Ultimate Convenience',
  'Reviews and Ratings for Every Home',
  'Multi-Currency Support for Global Swappers',
  'Save Money on Accommodation',
];

export const features = [
  {
    id: crypto.randomUUID(),
    image: '/home/feature-1.svg',
    title: 'Trusted and Secure',
    description:
      'Your safety is our priority. Our rigorous identity verification process ensures that you can trust the Turn Keys community. Secure communication and payment systems provide peace of mind throughout the exchange process.',
  },
  {
    id: crypto.randomUUID(),
    image: '/home/feature-2.svg',
    title: 'Personalized Profiles',
    description:
      'Craft detailed profiles that showcase your property and preferences. Use our customizable search filters to find the perfect match for your next house swap adventure.',
  },
  {
    id: crypto.randomUUID(),
    image: '/home/feature-3.svg',
    title: 'User-Friendly Onboarding',
    description:
      'Our easy registration and identity verification process get you started in no time. Create your profile, add stunning photos, and begin exploring potential swaps effortlessly.',
  },
];

export const howItWorks = [
  {
    id: crypto.randomUUID(),
    title: 'Registration and Verification',
    stepNumber: 1,
    steps: [
      {
        id: crypto.randomUUID(),
        title: 'Sign up for free with basic details.',
      },
      {
        id: crypto.randomUUID(),
        title:
          'Complete our identity verification process for a secure and trusted community.',
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    title: 'Create your Profile',
    stepNumber: 2,
    steps: [
      {
        id: crypto.randomUUID(),
        title:
          'Browse through a diverse range of properties from around the world.',
      },
      {
        id: crypto.randomUUID(),
        title: 'Use customizable search filters to narrow down your options.',
      },
      {
        id: crypto.randomUUID(),
        title:
          'In fact our AI schema will assist you to shortlist your desired home.',
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    title: 'Explore Listings',
    stepNumber: 3,
    steps: [
      {
        id: crypto.randomUUID(),
        title: 'Sign up for free with basic details.',
      },
      {
        id: crypto.randomUUID(),
        title:
          'Complete our identity verification process for a secure and trusted community.',
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    title: 'Swaping',
    stepNumber: 4,
    steps: [
      {
        id: crypto.randomUUID(),
        title: 'Get lots of Exchanging Home option by our AI based filter.',
      },
      {
        id: crypto.randomUUID(),
        title:
          'Discuss potential swaps and get to know your exchange partners.',
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    title: 'Initiate Contact and Confirm',
    stepNumber: 5,
    steps: [
      {
        id: crypto.randomUUID(),
        title: 'Connect with homeowners through secure messaging.',
      },
      {
        id: crypto.randomUUID(),
        title: 'Finalize the details and terms of your house swap.',
      },
      {
        id: crypto.randomUUID(),
        title: 'Enjoy a seamless and secure exchange experience.',
      },
    ],
  },
];

export const whyRotateKeys = [
  {
    id: crypto.randomUUID(),
    title: 'Exploring Virtual Tour',
    description:
      "At Turn Keys, we understand that seeing is believing. That's why we've introduced a cutting-edge feature that lets you explore properties like never before. When you find a listing that catches your eye, take your experience to the next level by requesting a virtual tour!",
    image: '/how-it-works/why-img-1.svg',
  },
  {
    id: crypto.randomUUID(),
    title: 'Secure and Trusted',
    description:
      'Ensure a trusted community with our identity verification process. Communicate securely with fellow homeowners through our encrypted messaging system. Experience safe and secure financial transactions with our reliable payment systems.',
    image: '/how-it-works/why-img-2.svg',
  },
  {
    id: crypto.randomUUID(),
    title: 'User-Friendly Experience',
    description:
      'Sign up effortlessly with our quick and straightforward registration process. Navigate our platform seamlessly with an intuitive interface. Begin your house-swapping journey with a hassle-free onboarding experience.',
    image: '/how-it-works/why-img-3.svg',
  },
];

export const faqs = [
  {
    id: crypto.randomUUID(),
    question: 'How to create an account?',
    answer:
      'To create an account, find the "Sign up" or "Create account" button, fill out the registration form with your personal information, and click "Create account" or "Sign up". Verify your email address if needed, and then log in to start using the platform.',
  },
  {
    id: crypto.randomUUID(),
    question: 'Have any trust issue?',
    answer:
      'Our focus on providing robust and user-friendly content management capabilities ensures that you can manage your content with confidence, and achieve your content marketing goals with ease.',
  },
  {
    id: crypto.randomUUID(),
    question: 'How can I reset my password?',
    answer:
      'Our focus on providing robust and user-friendly content management capabilities ensures that you can manage your content with confidence, and achieve your content marketing goals with ease.',
  },
  {
    id: crypto.randomUUID(),
    question: 'What is the payment process?',
    answer:
      'Our focus on providing robust and user-friendly content management capabilities ensures that you can manage your content with confidence, and achieve your content marketing goals with ease.',
  },
];

export const testimonials = [
  {
    id: crypto.randomUUID(),
    name: 'Amit & Manjit',
    message:
      "Turn Keys made our dream vacation a reality! Swapping homes with another family was not only cost-effective but also added a personal touch to our travels. We're now part of a community that values trust and shared experiences.",
    rating: 5,
  },
  {
    id: crypto.randomUUID(),
    name: 'Ramesh & Binod',
    message:
      "Our Turn Keys experience was fantastic. The platform's security measures gave us peace of mind, and connecting with fellow homeowners was seamless. We've made friends across borders, all thanks to Turn Keys!",
    rating: 5,
  },
  {
    id: crypto.randomUUID(),
    name: 'Karan & Kumbh',
    message:
      'As avid travelers, Turn Keys has become our go-to platform for unique accommodations. The personalized profiles helped us find the perfect match for our preferences. Our house swapping adventures have been nothing short of amazing.',
    rating: 5,
  },
  {
    id: crypto.randomUUID(),
    name: 'Amit & Manjit',
    message:
      "Turn Keys made our dream vacation a reality! Swapping homes with another family was not only cost-effective but also added a personal touch to our travels. We're now part of a community that values trust and shared experiences.",
    rating: 5,
  },
  {
    id: crypto.randomUUID(),
    name: 'Ramesh & Binod',
    message:
      "Our Turn Keys experience was fantastic. The platform's security measures gave us peace of mind, and connecting with fellow homeowners was seamless. We've made friends across borders, all thanks to Turn Keys!",
    rating: 5,
  },
  {
    id: crypto.randomUUID(),
    name: 'Karan & Kumbh',
    message:
      'As avid travelers, Turn Keys has become our go-to platform for unique accommodations. The personalized profiles helped us find the perfect match for our preferences. Our house swapping adventures have been nothing short of amazing.',
    rating: 5,
  },
  {
    id: crypto.randomUUID(),
    name: 'Amit & Manjit',
    message:
      "Turn Keys made our dream vacation a reality! Swapping homes with another family was not only cost-effective but also added a personal touch to our travels. We're now part of a community that values trust and shared experiences.",
    rating: 5,
  },
  {
    id: crypto.randomUUID(),
    name: 'Ramesh & Binod',
    message:
      "Our Turn Keys experience was fantastic. The platform's security measures gave us peace of mind, and connecting with fellow homeowners was seamless. We've made friends across borders, all thanks to Turn Keys!",
    rating: 5,
  },
  {
    id: crypto.randomUUID(),
    name: 'Karan & Kumbh',
    message:
      'As avid travelers, Turn Keys has become our go-to platform for unique accommodations. The personalized profiles helped us find the perfect match for our preferences. Our house swapping adventures have been nothing short of amazing.',
    rating: 5,
  },
];

export const teams = [
  {
    id: crypto.randomUUID(),
    name: 'Mr. Mahesh Kamale',
    role: 'Founder',
    image: '/teams/team-1.jpeg',
  },
  {
    id: crypto.randomUUID(),
    name: 'Miss Manasa Kamale',
    role: 'General manager',
    image: '/teams/team-2.jpeg',
  },
  {
    id: crypto.randomUUID(),
    name: 'Miss Shobhana R',
    role: 'Project manager',
    image: '/teams/team-3.jpg',
  },
  {
    id: crypto.randomUUID(),
    name: 'Mr. Abhijit Karmakar',
    role: 'Developer',
    image: '/teams/team-4.jpg',
  },
];
