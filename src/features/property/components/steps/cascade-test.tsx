'use client';

import { useEffect, useState } from 'react';
import {
  GetCity,
  GetCountries,
  GetRegions,
  GetState,
} from 'react-country-state-city';
import type {
  City,
  Country,
  Region,
  State,
} from 'react-country-state-city/dist/esm/types';

import { Field, FieldLabel } from '@/components/ui/field';
import { usePropertyContext } from '@/contexts/property-context';
import { CustomCombobox } from './custom-combo-box';

type ExtenedCascadeType = Pick<
  Region | Country | State | City,
  'id' | 'name'
> & {
  flag?: string;
};

const defaultValue = { id: 999, name: '', flag: undefined };

export default function TestCascase() {
  const [isRegionLoading, setIsRegionLoading] = useState(false);
  const [regionList, setRegionList] = useState<Region[]>(() => []);
  const [selectedRegion, setSelectedRegion] =
    useState<ExtenedCascadeType>(defaultValue);

  const [isCountryLoading, setIsCountryLoading] = useState(false);
  const [countryList, setCountryList] = useState<Country[]>(() => []);
  const [selectedCountry, setSelectedCountry] =
    useState<ExtenedCascadeType>(defaultValue);

  const [isStateLoading, setIsStateLoading] = useState(false);
  const [stateList, setStateList] = useState<State[]>(() => []);
  const [selectedState, setSelectedState] =
    useState<ExtenedCascadeType>(defaultValue);

  const [isCityLoading, setIsCityLoading] = useState(false);
  const [cityList, setCityList] = useState<City[]>(() => []);
  const [selectedCity, setSelectedCity] =
    useState<ExtenedCascadeType>(defaultValue);

  const { step } = usePropertyContext();

  useEffect(() => {
    if (step === 1) {
      setIsRegionLoading(true);
      GetRegions().then((result) => {
        setRegionList(result);
        setIsRegionLoading(false);
      });
    }
  }, [step]);

  // Get all countries with flags
  useEffect(() => {
    if (selectedRegion) {
      setIsCountryLoading(true);
      GetCountries().then((result) => {
        const groupedCountries = result
          .filter(
            (country) =>
              country.region.toLowerCase() ===
              selectedRegion.name.toLowerCase(),
          )
          .map((country) => ({
            ...country,
            flag: `https://flagcdn.com/16x12/${country.iso2.toLocaleLowerCase()}.png`,
          }));

        setCountryList(groupedCountries);
        setIsCountryLoading(false);
      });
    }
  }, [selectedRegion]);

  // Get all states of a country
  useEffect(() => {
    if (selectedCountry) {
      setIsStateLoading(true);
      GetState(selectedCountry.id).then((result) => {
        setStateList(result);
        setIsStateLoading(false);
      });
    }
  }, [selectedCountry]);

  // Get all cities of a state
  useEffect(() => {
    if (selectedState && selectedCountry) {
      setIsCityLoading(true);
      GetCity(selectedCountry.id, selectedState.id).then((result) => {
        setCityList(result);
        setIsCityLoading(false);
      });
    }
  }, [selectedState, selectedCountry]);

  const isLoading =
    isRegionLoading || isCountryLoading || isStateLoading || isCityLoading;

  return (
    <div className='gap-4 grid grid-cols-2'>
      <Field>
        <FieldLabel htmlFor='region'>Region</FieldLabel>
        <CustomCombobox
          disabled={isLoading}
          items={regionList}
          placeholder='Select region'
          label='region'
          value={selectedRegion}
          onValueChange={(e) => {
            setSelectedRegion(e);
          }}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor='country'>Country</FieldLabel>
        <CustomCombobox
          disabled={isLoading || !selectedRegion.id}
          items={countryList}
          placeholder='Select country'
          label='country'
          value={selectedCountry}
          onValueChange={(e) => {
            setSelectedCountry(e);
          }}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor='state'>State</FieldLabel>
        <CustomCombobox
          disabled={isLoading || !selectedCountry.id}
          items={stateList}
          placeholder='Select state'
          label='state'
          value={selectedState}
          onValueChange={(e) => {
            setSelectedState(e);
          }}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor='city'>City</FieldLabel>
        <CustomCombobox
          disabled={isLoading || !selectedState.id}
          items={cityList}
          placeholder='Select city'
          label='city'
          value={selectedCity}
          onValueChange={(e) => {
            setSelectedCity(e);
          }}
        />
      </Field>
    </div>
  );
}
