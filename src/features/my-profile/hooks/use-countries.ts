import { useEffect, useState } from 'react';
import { GetCountries } from 'react-country-state-city';
import { type Country } from 'react-country-state-city/dist/esm/types';

type OverrideCountriesData = Country & { flag: string };

export function useCountries() {
  const [countriesList, setCountriesList] = useState<OverrideCountriesData[]>(
    [],
  );

  // Get all countries with flags
  useEffect(() => {
    GetCountries().then((result) => {
      // need to add this data in each country obj
      const overrideCountries = result.map((c) => ({
        ...c,
        flag: `https://flagcdn.com/16x12/${c.iso2.toLocaleLowerCase()}.png`,
      }));
      setCountriesList(overrideCountries);
    });
  }, []);

  return countriesList;
}
