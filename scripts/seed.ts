import { Distributor, Randomizer, faker } from '@faker-js/faker';
import { loadEnvConfig } from '@next/env';
import { drizzle } from 'drizzle-orm/neon-serverless';

import {
  hostLanguageEnum,
  propertyAccessibilitiesEnum,
  propertyAccomodationsEnum,
  propertyAmenitiesEnum,
  propertyAreaUnitsEnum,
  propertyEnvironmentsEnum,
  propertyOwnershipsEnum,
  propertyRentPeriodEnum,
  propertyRulesEnum,
  propertySurroundingsEnum,
  propertySwapingsEnum,
  propertyTypesEnum,
} from '@/constants/property-assets-enums';
import * as schema from '../src/drizzle/schema';

loadEnvConfig(process.cwd(), true);

export const images = [
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1464146072230-91cabc968266?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1576941089067-2de3c901e126?q=80&w=1956&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1592595896616-c37162298647?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1584738766473-61c083514bf4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1625602812206-5ec545ca1231?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
];

function getPropertyData(amount: number, userId: string) {
  const uniform: Distributor = (randomizer: Randomizer) => randomizer.next();

  const data: schema.InsertProperty[] = [];

  for (let i = 0; i < amount; i++) {
    const property: schema.InsertProperty = {
      id: faker.string.uuid({ version: 7, refDate: new Date().toISOString() }),
      region: {
        id: faker.number.int({ min: 1, max: 249, distributor: uniform }),
        name: faker.location.continent(),
      },
      country: {
        id: faker.number.int({ min: 1, max: 249, distributor: uniform }),
        name: faker.location.country(),
        flag: `https://flagcdn.com/w20/${faker.location.countryCode().toLowerCase()}.png`,
      },
      state: {
        id: faker.number.int({ min: 1, max: 249, distributor: uniform }),
        name: faker.location.state(),
      },
      city: {
        id: faker.number.int({ min: 1, max: 249, distributor: uniform }),
        name: faker.location.city(),
      },
      zipcode: faker.location.zipCode(),
      streetAddress: faker.location.streetAddress(),

      roomType: faker.helpers.arrayElement(propertyTypesEnum),
      ownership: faker.helpers.arrayElement(propertyOwnershipsEnum),
      swaping: faker.helpers.arrayElement(propertySwapingsEnum),
      rentPeriod: faker.helpers.arrayElement(propertyRentPeriodEnum),
      surrounding: faker.helpers.arrayElement(propertySurroundingsEnum),
      environment: faker.helpers.arrayElement(propertyEnvironmentsEnum),
      accommodation: faker.helpers.arrayElement(propertyAccomodationsEnum),

      area: faker.helpers.rangeToNumber({ min: 200, max: 10000 }).toString(),
      areaUnit: faker.helpers.arrayElement(propertyAreaUnitsEnum),

      // db support 3000 characters make sure this
      description: faker.lorem.words({ min: 300, max: 350 }),

      beds: faker.helpers.rangeToNumber({ min: 1, max: 10 }),
      bedRooms: faker.helpers.rangeToNumber({ min: 1, max: 10 }),
      bathRooms: faker.helpers.rangeToNumber({ min: 1, max: 10 }),
      guests: faker.helpers.rangeToNumber({ min: 1, max: 10 }),

      ownerName: faker.person.fullName(),
      ownerEmail: faker.internet.email(),
      ownerPhone: faker.phone.number({ style: 'mobile' }),
      knownLanguages: faker.helpers.arrayElements(hostLanguageEnum, {
        min: 2,
        max: 4,
      }),

      amenities: faker.helpers.arrayElements(propertyAmenitiesEnum, {
        min: 5,
        max: 8,
      }),
      accessibilities: faker.helpers.arrayElements(
        propertyAccessibilitiesEnum,
        {
          min: 3,
          max: 5,
        },
      ),
      rules: faker.helpers.arrayElements(propertyRulesEnum, { min: 3, max: 6 }),

      staysDateRange: { from: faker.date.past(), to: faker.date.future() },
      staysDuration: faker.helpers
        .rangeToNumber({ min: 1, max: 30 })
        .toString(),

      images: faker.helpers.uniqueArray(images, 3),
      isAvailable: true,
      // isAvailable: faker.datatype.boolean({
      //   probability: Math.random() >= 0.9 ? 1 : 0,
      // }),
      authorId: userId,

      createdAt: faker.date.past(),
      updatedAt: new Date(),
    };

    data.push(property);
  }

  return data;
}

async function main() {
  const db = drizzle(process.env.DATABASE_URL!);

  const userId = 'fa537a8a-f481-4336-9ab7-f898cbc6318c';

  try {
    if (!userId) {
      throw new Error('User ID not found');
    }

    const seedingCount = 15;

    const properties = getPropertyData(seedingCount, userId);

    // const allRegions = GetRegions();
    // const allCountries = GetCountries();
    // const allStates = GetState();
    // const allCities = GetCity();

    console.log('Generated properties', properties.length);

    await new Promise((resolve) => setTimeout(resolve, 10000));

    const conn = await db.$client.connect();
    console.log('connected 🔌');

    console.log('🌱🌱🌱 Seeding started...');

    // for (const item of properties) {
    //   await new Promise((resolve) => setTimeout(resolve, 1000));
    //   await db.insert(schema.property).values(item);
    //   console.log("Property inserted", item.id);
    //   await new Promise((resolve) => setTimeout(resolve, 500));
    // }
    const seededValues = await db
      .insert(schema.property)
      .values(properties)
      .returning();
    console.log('🎉🎉🎉 Seeding completed', seededValues.length);

    process.exit(0);
  } catch (err) {
    console.log('Error while seeding', err);
    process.exit(1);
  }
}

main();
