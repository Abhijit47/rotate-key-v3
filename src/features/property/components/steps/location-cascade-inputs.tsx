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
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { usePropertyContext } from '@/contexts/property-context';
import { type WizardValues } from '@/lib/validators/property-schemas';
import { CustomCombobox } from './custom-combo-box';

type Fields = 'region' | 'country' | 'state' | 'city';

type PickedWizardValues = Pick<WizardValues, Fields>;

type ExtenedCascadeType = Pick<
  Region | Country | State | City,
  'id' | 'name'
> & {
  flag?: string;
  iso2?: string;
};

// const defaultValue = { id: 999, name: '', flag: undefined, iso2: undefined };

export default function LocationCascadingInputs() {
  const form = useFormContext<PickedWizardValues>();

  const [isRegionLoading, setIsRegionLoading] = useState(false);
  const [regionList, setRegionList] = useState<Region[]>(() => []);

  const [isCountryLoading, setIsCountryLoading] = useState(false);
  const [countryList, setCountryList] = useState<Country[]>(() => []);
  // const [selectedCountry, setSelectedCountry] =
  //   useState<ExtenedCascadeType>(defaultValue);

  const [isStateLoading, setIsStateLoading] = useState(false);
  const [stateList, setStateList] = useState<State[]>(() => []);
  // const [selectedState, setSelectedState] =
  //   useState<ExtenedCascadeType>(defaultValue);

  const [isCityLoading, setIsCityLoading] = useState(false);
  const [cityList, setCityList] = useState<City[]>(() => []);
  // const [selectedCity, setSelectedCity] =
  //   useState<ExtenedCascadeType>(defaultValue);

  const { step } = usePropertyContext();

  const watchedRegion = useWatch({
    name: 'region',
    control: form.control,
    compute: (val) => {
      if (val) return val;
      return null;
    },
  });

  const watchedCountry = useWatch({
    name: 'country',
    control: form.control,
    compute: (val) => {
      if (val) return val;
      return null;
    },
  });

  const watchedState = useWatch({
    name: 'state',
    control: form.control,
    compute: (val) => {
      if (val) return val;
      return null;
    },
  });

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
    if (watchedRegion) {
      setIsCountryLoading(true);
      GetCountries().then((result) => {
        const groupedCountries = result
          .filter(
            (country) =>
              country.region.toLowerCase() === watchedRegion.name.toLowerCase(),
          )
          .map((country) => ({
            ...country,
            flag: `https://flagcdn.com/16x12/${country.iso2.toLocaleLowerCase()}.png`,
          }));

        setCountryList(groupedCountries);
        setIsCountryLoading(false);
      });
    }
  }, [watchedRegion]);

  // Get all states of a country
  useEffect(() => {
    if (watchedCountry) {
      setIsStateLoading(true);
      GetState(watchedCountry.id).then((result) => {
        setStateList(result);
        setIsStateLoading(false);
      });
    }
  }, [watchedCountry]);

  // Get all cities of a state
  useEffect(() => {
    if (watchedCountry && watchedState) {
      setIsCityLoading(true);
      GetCity(watchedCountry.id, watchedState.id).then((result) => {
        setCityList(result);
        setIsCityLoading(false);
      });
    }
  }, [watchedCountry, watchedState]);

  const isLoading =
    isRegionLoading || isCountryLoading || isStateLoading || isCityLoading;

  return (
    <>
      <Controller
        name='region'
        control={form.control}
        render={({ field, fieldState }) => (
          <Field
            className='gap-1'
            aria-invalid={fieldState.invalid}
            data-invalid={fieldState.invalid}>
            <FieldContent>
              <FieldLabel htmlFor={field.name}>Region</FieldLabel>
              <FieldDescription>
                <small className='font-normal text-muted-foreground italic'>
                  (Choose region)
                </small>
              </FieldDescription>
              <CustomCombobox
                disabled={isLoading}
                items={regionList}
                placeholder='Select region'
                label='region'
                value={field.value}
                onValueChange={(e) => {
                  field.onChange(e);
                }}
                isInvalid={fieldState.invalid}
              />
            </FieldContent>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name='country'
        control={form.control}
        render={({ field, fieldState }) => (
          <Field
            className='gap-1'
            aria-invalid={fieldState.invalid}
            data-invalid={fieldState.invalid}>
            <FieldContent>
              <FieldLabel htmlFor={field.name}>Country</FieldLabel>
              <FieldDescription>
                <small className='font-normal text-muted-foreground italic'>
                  (Choose country)
                </small>
              </FieldDescription>
              <CustomCombobox
                disabled={isLoading}
                items={countryList}
                placeholder='Select country'
                label='country'
                value={field.value}
                onValueChange={(e) => {
                  field.onChange(e);
                }}
                isInvalid={fieldState.invalid}
              />
            </FieldContent>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name='state'
        control={form.control}
        render={({ field, fieldState }) => (
          <Field
            className='gap-1'
            aria-invalid={fieldState.invalid}
            data-invalid={fieldState.invalid}>
            <FieldContent>
              <FieldLabel htmlFor={field.name}>State / Province</FieldLabel>
              <FieldDescription>
                <small className='font-normal text-muted-foreground italic'>
                  (Choose state or province)
                </small>
              </FieldDescription>
              <CustomCombobox
                disabled={isLoading}
                items={stateList}
                placeholder='Select state'
                label='state'
                value={field.value}
                onValueChange={(e) => {
                  field.onChange(e);
                }}
                isInvalid={fieldState.invalid}
              />
            </FieldContent>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name='city'
        control={form.control}
        render={({ field, fieldState }) => (
          <Field
            className='gap-1'
            aria-invalid={fieldState.invalid}
            data-invalid={fieldState.invalid}>
            <FieldContent>
              <FieldLabel htmlFor={field.name}>City / Town</FieldLabel>
              <FieldDescription>
                <small className='font-normal text-muted-foreground italic'>
                  (Choose city or town)
                </small>
              </FieldDescription>
              <CustomCombobox
                disabled={isLoading}
                items={cityList}
                placeholder='Select city'
                label='city'
                value={field.value}
                onValueChange={(e) => {
                  field.onChange(e);
                }}
                isInvalid={fieldState.invalid}
              />
            </FieldContent>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </>
  );
}
