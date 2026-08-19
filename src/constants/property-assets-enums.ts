// 😋 Create enums for zod schemas Validate frontend + backend + database consistency

import {
  hostLanguages,
  propertyAccessibilities,
  propertyAccomodations,
  propertyAmenities,
  propertyAreaUnits,
  propertyEnvironments,
  propertyOwnerships,
  propertyRentalPeriods,
  propertyRules,
  propertySurroundings,
  propertySwapings,
  propertyTypes,
} from './property-assets';
import {
  AccessibilitiesLateral,
  AccommodationLateral,
  AmenitiesLateral,
  EnvironmentLateral,
  OwnershipLateral,
  RentPeriodLateral,
  RoomTypeLateral,
  RulesLateral,
  SurroundingLateral,
  SwapingLateral,
} from './property-assets-types';

export const propertyRulesEnum = propertyRules
  .map((rule) => {
    return rule.categoryTypes.map((category) => category.name.toLowerCase());
  })
  .flat() as RulesLateral[];

export const propertyAmenitiesEnum = propertyAmenities
  .map((amenity) => {
    return amenity.categoryTypes.map((category) => category.name.toLowerCase());
  })
  .flat() as AmenitiesLateral[];

export const propertyAccessibilitiesEnum = propertyAccessibilities
  .map((accessibility) => {
    return accessibility.categoryTypes.map((category) =>
      category.name.toLowerCase(),
    );
  })
  .flat() as AccessibilitiesLateral[];

export const propertyRentPeriodEnum = propertyRentalPeriods
  .map((period) => {
    return period.categoryTypes.map((category) => category.rentType);
  })
  .flat()
  .map((rentType) => {
    return rentType.map((type) => type.name.toLowerCase());
  })
  .flat() as RentPeriodLateral[];

export const propertyAreaUnitsEnum = propertyAreaUnits.map(
  (unit) => unit.value,
);

export const propertyTypesEnum = propertyTypes
  .map((type) => {
    return type.categoryTypes.map((category) => category.name.toLowerCase());
  })
  .flat() as RoomTypeLateral[];

export const propertyOwnershipsEnum = propertyOwnerships
  .map((type) => {
    return type.categoryTypes.map((category) => category.name.toLowerCase());
  })
  .flat() as OwnershipLateral[];

export const propertySwapingsEnum = propertySwapings
  .map((type) => {
    return type.categoryTypes.map((category) => category.name.toLowerCase());
  })
  .flat() as SwapingLateral[];

export const propertySurroundingsEnum = propertySurroundings
  .map((type) => {
    return type.categoryTypes.map((category) => category.name.toLowerCase());
  })
  .flat() as SurroundingLateral[];

export const propertyEnvironmentsEnum = propertyEnvironments
  .map((type) => {
    return type.categoryTypes.map((category) => category.name.toLowerCase());
  })
  .flat() as EnvironmentLateral[];

export const propertyAccomodationsEnum = propertyAccomodations
  .map((type) => {
    return type.categoryTypes.map((category) => category.name.toLowerCase());
  })
  .flat() as AccommodationLateral[];

export const hostLanguageEnum = hostLanguages.map(
  (language) => language.language,
);
