// CORE LIBRARY
import { randomBytes } from 'crypto';

// EXTERNAL LIBRARY
// import axios from 'axios';
import patterns from './countries-regex';

// CONSANTS
import {
  propertyRentalPeriods,
  hostLanguages,
  propertyAccessibilities,
  propertyAccomodations,
  propertyAmenities,
  propertyEnvironments,
  propertyOwnerships,
  propertyRules,
  propertySurroundings,
  propertySwappings,
  propertyTypes,
} from '@/constants/property-assets';

// Function to help with conditional classnames
export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

// Function to shuffle an array
export function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

// Generate Random IDs
export function generateRandomIds(count: number): string[] {
  const randomIds = [];
  for (let i = 0; i < count; i++) {
    randomIds.push(crypto.randomUUID());
  }
  return randomIds;
}

// Function to generate a UUID-like random string
export function generateRandomString(length: number): string {
  return randomBytes(length)
    .toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, length);
}

// Function to generate start_at timestamp
export function generateStartAt(): number {
  // const startAt = Math.floor(Date.now() / 1000) + 10; // Add 10 seconds buffer
  const startAt = Math.floor(Date.now() / 1000) + 60; // Add 10 seconds buffer
  console.log('Generated start_at timestamp:', startAt);
  console.log(
    'Starts at:',
    new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'medium',
    }).format(startAt * 1000),
  );
  return startAt;
}

// Function to generate expire_by timestamp
export function generateExpireBy(days: number): number {
  const expireBy = Math.floor(Date.now() / 1000) + days * 24 * 60 * 60; // Add days in seconds
  console.log('Generated expire_by timestamp:', expireBy);
  console.log(
    'Expires in:',
    new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'medium',
    }).format(expireBy * 1000),
  );
  return expireBy;
}

export function generateTimestampAfterSixMonths(): number {
  const currentDate = new Date();
  const futureDate = new Date(currentDate.setMonth(currentDate.getMonth() + 6));
  const timestamp = Math.floor(futureDate.getTime() / 1000); // Convert to Unix timestamp
  console.log('Generated timestamp for 6 months later:', timestamp);
  console.log(
    'Date 6 months later:',
    new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'medium',
    }).format(futureDate),
  );
  return timestamp;
}

export function generateTimestampAfterSixMonthsWithTimezone(): string {
  const currentDate = new Date();
  const futureDate = new Date(currentDate.setMonth(currentDate.getMonth() + 6));
  const timestampWithTimezone = futureDate.toISOString(); // Convert to ISO 8601 format
  console.log(
    'Generated timestamp for 6 months later with timezone:',
    timestampWithTimezone,
  );
  console.log(
    'Date 6 months later:',
    new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'medium',
    }).format(futureDate),
  );
  return timestampWithTimezone;
}

export function generateCurrentTimestampWithTimezone(): string {
  const currentDate = new Date();
  const timestampWithTimezone = currentDate.toISOString(); // Convert to ISO 8601 format
  console.log(
    'Generated current timestamp with timezone:',
    timestampWithTimezone,
  );
  console.log(
    'Current date:',
    new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'medium',
    }).format(currentDate),
  );
  return timestampWithTimezone;
}

// // Function to convert USD to INR
// export async function convertUsdToInr(amount: number): Promise<number> {
//   try {
//     const response = await axios.get<ExchangeRateResponse>(
//       'https://api.exchangerate-api.com/v4/latest/USD',
//     );
//     const exchangeRate = response.data.rates.INR;
//     return amount * exchangeRate;
//   } catch (error) {
//     console.error('Error fetching exchange rate:', error);
//     throw new Error('Failed to fetch exchange rate');
//   }
// }

// Array of allowed TLDs
const allowedTLDs = ['com', 'org', 'in'];

// Function to create the regex dynamically
export function createEmailRegex(tlds: string[]) {
  const tldPattern = tlds.join('|');
  return new RegExp(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.(${tldPattern})$`);
}

// Create the regex
export const emailRegex = createEmailRegex(allowedTLDs);

export function validatePostalCode(postalCode: string, countryCode: string) {
  const pattern = patterns[countryCode.toUpperCase()] as RegExp;
  // console.log('Pattern:', pattern);
  if (pattern) {
    // console.log('testing:', pattern.test(postalCode));
    return pattern.test(postalCode);
  } else {
    // Fallback for unrecognized formats
    return /^[A-Za-z0-9\- ]{2,10}$/.test(postalCode);
  }
}

export const formatter = new Intl.RelativeTimeFormat(undefined, {
  numeric: 'auto',
});

export const DIVISIONS: {
  amount: number;
  name: Intl.RelativeTimeFormatUnit;
}[] = [
  { amount: 60, name: 'seconds' },
  { amount: 60, name: 'minutes' },
  { amount: 24, name: 'hours' },
  { amount: 7, name: 'days' },
  { amount: 4.34524, name: 'weeks' },
  { amount: 12, name: 'months' },
  { amount: Number.POSITIVE_INFINITY, name: 'years' },
];

export function formatTimeAgo(date: Date) {
  let duration = (date.getTime() - new Date().getTime()) / 1000;

  for (let i = 0; i < DIVISIONS.length; i++) {
    const division = DIVISIONS[i];
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.name);
    }
    duration /= division.amount;
  }
}

type ConstantPropertyDataType = {
  categoryTypes: {
    id: string;
    name: string;
    icon?: React.FC<React.SVGProps<SVGSVGElement>>;
    description: string;
    rentType?: {
      id: string;
      name: string;
      description: string;
    }[];
  }[];
};

type MakeArrayOfStringType = {
  data: ConstantPropertyDataType[];
  type: 'rental' | 'other';
};

export function makeArrayOfStrings(params: MakeArrayOfStringType) {
  if (params.type === 'rental') {
    const fallback = [
      { id: crypto.randomUUID(), name: 'NA', description: 'none' },
    ];

    return params.data
      .flatMap((type) => type.categoryTypes)
      .flatMap((category) => category.rentType ?? fallback)
      .map((option) => option.name);
  } else {
    return params.data
      .flatMap((type) => type.categoryTypes)
      .map((option) => option.name);
  }
}

export const propertyConstantTypes = makeArrayOfStrings({
  data: propertyTypes,
  type: 'other',
});
export const ownershipConstantTypes = makeArrayOfStrings({
  data: propertyOwnerships,
  type: 'other',
});
export const swappingConstantTypes = makeArrayOfStrings({
  data: propertySwappings,
  type: 'other',
});
export const rentalConstantTypes = makeArrayOfStrings({
  data: propertyRentalPeriods,
  type: 'rental',
});
export const environmentConstantTypes = makeArrayOfStrings({
  data: propertyEnvironments,
  type: 'other',
});
export const surroundingConstantTypes = makeArrayOfStrings({
  data: propertySurroundings,
  type: 'other',
});
export const accomodationConstantTypes = makeArrayOfStrings({
  data: propertyAccomodations,
  type: 'other',
});
export const amenitiesConstantTypes = makeArrayOfStrings({
  data: propertyAmenities,
  type: 'other',
});
export const rulesConstantTypes = makeArrayOfStrings({
  data: propertyRules,
  type: 'other',
});
export const accessibilitiesConstantTypes = makeArrayOfStrings({
  data: propertyAccessibilities,
  type: 'other',
});
export const languagesConstantTypes = hostLanguages.map(
  (language) => language.language,
);
