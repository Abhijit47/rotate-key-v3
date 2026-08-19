type AccommodationCategoryLaterral =
  | 'entire place'
  | 'private accommodation'
  | 'shared accommodation';

export type AccommodationLateral =
  | 'entire apartment'
  | 'entire house'
  | 'private room'
  | 'shared place';

type AccessibilitiesCategoryLateral =
  | 'entrance & parking'
  | 'interior mobility & navigation'
  | 'bedroom accessibility'
  | 'bathroom accessibility'
  | 'kitchen & dining'
  | 'smart & assistive technology'
  | 'communication & safety';

type RentPeriodCategoryLateral =
  | 'Short-Term Rentals'
  | 'Medium-Term Rentals'
  | 'Long-Term Rentals'
  | 'Leased Property';

export type RentPeriodLateral =
  | 'daily rental'
  | 'weekly rental'
  | 'monthly rental'
  | '3-month lease'
  | '6-month lease'
  | '1-year lease (long-term)'
  | '2-year lease'
  | '5-year lease'
  | '10+ year lease'
  | '1-year lease (contractual)'
  | 'month-to-month lease';

export type RoomTypeLateral =
  | 'apartment'
  | 'house'
  | 'villa'
  | 'penthouse'
  | 'studio'
  | 'cottage'
  | 'townhouse'
  | 'duplex/triplex'
  | 'shared apartment'
  | 'co-living space'
  | 'guest house'
  | 'office space'
  | 'retail space'
  | 'warehouse/industrial space'
  | 'hotel/resort'
  | 'raw land'
  | 'construction-ready land'
  | 'multi-family home'
  | 'gated community property';

type RoomTypeCategoryLateral =
  | 'residential'
  | 'shared living spaces'
  | 'commercial properties'
  | 'land & investment properties';

type RulesCategoryLateral =
  | 'general rules'
  | 'noise & conduct'
  | 'smoking, pets & alcohol'
  | 'cleanliness & maintenance'
  | 'security & safety'
  | 'internet & tech usage'
  | 'waste management'
  | 'departure guidelines';

type SurroundingCategoryLateral =
  | 'natural & scenic surroundings'
  | 'climate-based surroundings';

export type SurroundingLateral =
  | 'mountain'
  | 'island'
  | 'hill station'
  | 'sea facing / coastal'
  | 'lakeside'
  | 'forest'
  | 'desert'
  | 'tropical'
  | 'snowy region'
  | 'temperate zone'
  | 'arid / dry region'
  | 'windy coastal area'
  | 'evergreen forest zone';

type EnvironmentCategoryLateral = 'rural & countryside' | 'urban & city';

export type EnvironmentLateral =
  | 'village'
  | 'countryside'
  | 'isolated'
  | 'farmland'
  | 'urban area'
  | 'metro city'
  | 'town'
  | 'suburban'
  | 'gated community';

export type OwnershipLateral =
  | 'freehold'
  | 'leasehold'
  | 'co-ownership'
  | 'timeshare ownership'
  | 'inherited property'
  | 'joint ownership'
  | 'corporate-owned'
  | 'rented property';

export type SwapingLateral = 'permanent swap' | 'temporary swap';

type AmenitiesCategoryLateral =
  | 'general amenities'
  | 'kitchen amenities'
  | 'bedroom amenities'
  | 'bathroom amenities'
  | 'outdoor & recreational amenities'
  | 'fitness & wellness amenities'
  | 'family-friendly amenities'
  | 'pet-friendly amenities'
  | 'parking & transport'
  | 'convenience & accessibility'
  | 'building & security features'
  | 'sustainable & eco-friendly amenities';

type HostLanguageName = {
  arabic: {
    language: string;
    flag: string;
  };
  bengali: {
    language: string;
    flag: string;
  };
  english: {
    language: string;
    flag: string;
  };
  french: {
    language: string;
    flag: string;
  };
  german: {
    language: string;
    flag: string;
  };
  hindi: {
    language: string;
    flag: string;
  };
  italian: {
    language: string;
    flag: string;
  };
  japanese: {
    language: string;
    flag: string;
  };
  javanese: {
    language: string;
    flag: string;
  };
  korean: {
    language: string;
    flag: string;
  };
  marathi: {
    language: string;
    flag: string;
  };
  portuguese: {
    language: string;
    flag: string;
  };
  russian: {
    language: string;
    flag: string;
  };
  spanish: {
    language: string;
    flag: string;
  };
  swahili: {
    language: string;
    flag: string;
  };
  tamil: {
    language: string;
    flag: string;
  };
  telugu: {
    language: string;
    flag: string;
  };
  turkish: {
    language: string;
    flag: string;
  };
  urdu: {
    language: string;
    flag: string;
  };
};

/**
 * Used in DATABASE SCHEMA
 */

export type RulesLateral =
  | 'respect the property'
  | 'no unauthorized guests'
  | 'check-in & check-out'
  | 'quiet hours'
  | 'no parties or events'
  | 'respect the neighbors'
  | 'no smoking indoors'
  | 'pet policy'
  | 'keep pets supervised'
  | 'clean up after pets'
  | 'no pets on furniture'
  | 'pet noise control'
  | 'pet safety measures'
  | 'alcohol consumption'
  | 'keep the property clean'
  | 'report damages immediately'
  | 'use appliances responsibly'
  | 'lock doors & windows'
  | 'follow fire safety measures'
  | 'do not share access codes/keys'
  | 'respect data limits'
  | 'no illegal activities'
  | 'recycling rules'
  | 'food disposal'
  | 'leave property in good condition'
  | 'check for personal belongings'
  | 'leave keys in agreed location';

export type AccessibilitiesLateral =
  | 'step-free entrance'
  | 'ramp access'
  | 'wide doorways (80 cm or more)'
  | 'designated accessible parking'
  | 'automatic doors or easy-to-open handles'
  | 'step-free access inside'
  | 'elevator access (if in an apartment building)'
  | 'wide hallways (90 cm or more)'
  | 'lever-style door handles'
  | 'non-slip flooring'
  | 'lowered bed height'
  | 'adjustable bed'
  | 'space around the bed for wheelchair maneuverability'
  | 'accessible closet/storage'
  | 'roll-in shower'
  | 'grab bars'
  | 'shower seat'
  | 'handheld showerhead'
  | 'raised toilet seat'
  | 'slip-resistant flooring'
  | 'lowered countertops'
  | 'easy-to-reach cabinets & storage'
  | 'accessible dining table height'
  | 'push-button or touch-sensitive appliances'
  | 'voice-controlled devices'
  | 'smart home automation'
  | 'visual and vibrating alarms'
  | 'braille signage'
  | 'subtitles/closed captions on tv'
  | 'emergency assistance button'
  | 'service animal-friendly';

export type HostLanguageLateral =
  | 'arabic'
  | 'bengali'
  | 'english'
  | 'french'
  | 'german'
  | 'hindi'
  | 'italian'
  | 'japanese'
  | 'javanese'
  | 'korean'
  | 'marathi'
  | 'portuguese'
  | 'russian'
  | 'spanish'
  | 'swahili'
  | 'tamil'
  | 'telugu'
  | 'turkish'
  | 'urdu';

export type AmenitiesLateral =
  | 'smart home automation'
  | 'wi-fi'
  | 'air conditioning'
  | 'heating'
  | 'washing machine'
  | 'dryer'
  | 'hot water'
  | 'tv & streaming services'
  | 'work desk / home office space'
  | 'closet / wardrobe space'
  | 'iron & ironing board'
  | 'hangers'
  | 'fully equipped kitchen'
  | 'dishwasher'
  | 'cooking basics'
  | 'coffee maker / kettle'
  | 'toaster'
  | 'dining table & chairs'
  | 'cutlery & dishware'
  | 'comfortable bed & fresh linen'
  | 'extra pillows & blankets'
  | 'blackout curtains'
  | 'bedside lamps'
  | 'alarm clock'
  | 'private bathroom'
  | 'bathtub / shower'
  | 'fresh towels'
  | 'hair dryer'
  | 'toiletries (soap, shampoo, conditioner)'
  | 'toilet paper'
  | 'first aid kit'
  | 'private garden / backyard'
  | 'balcony / terrace'
  | 'bbq grill'
  | 'outdoor seating & dining area'
  | 'swimming pool'
  | 'jacuzzi / hot tub'
  | 'rooftop access'
  | 'gym / workout equipment'
  | 'yoga mat'
  | 'sauna / steam room'
  | 'baby crib / cot'
  | 'high chair'
  | 'childrenâ€™s toys & books'
  | 'childproof home features'
  | 'pet allowed'
  | 'pet bed & bowls'
  | 'nearby pet-friendly parks'
  | 'free parking on premises'
  | 'paid parking nearby'
  | 'ev charging station'
  | 'bicycle / scooter storage'
  | 'parking area'
  | 'public transportation access'
  | 'elevator'
  | 'disabled people suitability'
  | 'elevator access'
  | 'secure entry (keycard, smart lock, etc.)'
  | '24/7 security & surveillance'
  | 'smoke detector & fire extinguisher'
  | 'solar panels'
  | 'rainwater harvesting system'
  | 'energy-efficient appliances'
  | 'led lighting'
  | 'smart thermostat'
  | 'compost bin'
  | 'recycling bins'
  | 'electric vehicle (ev) charging station'
  | 'green rooftop / vertical garden'
  | 'water-saving fixtures'
  | 'sustainable building materials'
  | 'bicycle-friendly features'
  | 'organic garden / homegrown produce'
  | 'locally sourced / eco-friendly furniture'
  | 'carbon offset initiatives';
