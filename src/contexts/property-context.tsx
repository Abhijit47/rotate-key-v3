'use client';

import { useFormPersist } from '@liorpo/react-hook-form-persist';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { zodResolver } from 'zod-resolver-lite';

import { usePropertyDetailsForUpdate } from '@/features/property/hooks/use-property';
import useSessionStorage from '@/hooks/use-session-storage';
import {
  type WizardValues,
  combinedPropertySchema,
  currentStepFields,
  defaultValues,
} from '@/lib/validators/property-schemas';

type PropertyContextType = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  propertySteps: {
    id: number;
    title: string;
    description: string;
  }[];
  step: number;
  onPrevStep: () => void;
  onNextStep: () => void;
  onStepChange: (steps: number) => void;
  isIntroStep: boolean;
  isCurrentStep: (id: number) => boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  currentStepDetails: {
    id: number;
    title: string;
    description: string;
  };
  isErrorDrawerOpen: boolean;
  onToggleErrorDrawer: () => void;
  isLoading: boolean;
  // nextStep: () => void;

  progress: number;
  clearDraft: () => void;
};

export const PropertyContext = createContext<PropertyContextType | undefined>(
  undefined,
);

const propertySteps = [
  {
    id: 1,
    title: 'Property Location',
    description:
      'Provide the exact physical location of your listing by entering the street address, country, state, city, and zip code. This ensures guests can locate your property accurately and plan their travel arrangements accordingly.',
  },
  {
    id: 2,
    title: 'Size & Description',
    description:
      'Enter the total area size of your property along with the specific measurement unit. Write a detailed, engaging description highlighting the unique features, layout, and appeal of your home for potential visitors.',
  },
  {
    id: 3,
    title: 'Listing Classification',
    description:
      'Define the primary classification of your property, including property type, ownership, swapping preferences, rental period types, and a description of the surrounding landscape or local neighborhood environment to set accurate expectations.',
  },
  {
    id: 4,
    title: 'Space & Bedding Capacity',
    description:
      "Outline the bedroom and bathroom layouts, total bed count, and the maximum number of guests the property can accommodate. Select the overall accommodation type to define the listing's occupancy details.",
  },
  {
    id: 5,
    title: 'Host Details & Language',
    description:
      'Provide contact information for the property owner, including name, email, and phone number, and select the languages spoken by the host to help guests initiate clear and convenient communication.',
  },
  {
    id: 6,
    title: 'Amenities & Conveniences',
    description:
      'Select all the standard amenities, kitchen appliances, utilities, and modern comforts available at your property to show guests what facilities they will have access to during their stay.',
  },
  {
    id: 7,
    title: 'Accessibility Features',
    description:
      'Indicate any specific accessibility options and design features, such as step-free access or wide hallways, to accommodate guests with mobility constraints and make your space more inclusive.',
  },
  {
    id: 8,
    title: 'House Rules & Policies',
    description:
      'Detail the guidelines, behavioral expectations, and policies for your listing—such as smoking rules, pet policies, or quiet hours—to ensure guests treat your property with respect and care.',
  },
  {
    id: 9,
    title: 'Availability & Stay Dates',
    description:
      'Set the available check-in and check-out date range and duration for your property, allowing guests to see when the listing is open for bookings or swaps throughout the year.',
  },
  {
    id: 10,
    title: 'Photos & Media Upload',
    description:
      'Upload clear, high-quality photos showing the interior rooms, exterior views, and unique features of your property to create a visually appealing showcase that attracts potential guests.',
  },
];

const safeSessionStorage =
  typeof window === 'undefined'
    ? undefined
    : (() => {
        try {
          return window.sessionStorage;
        } catch {
          return undefined;
        }
      })();

type PropertyContextProviderProps = {
  children: ReactNode;
  propertyId?: string;
};

const initialValues = {
  step: 0,
  progress: 0,
};

export function PropertyContextProvider(props: PropertyContextProviderProps) {
  const { children, propertyId } = props;

  const [propertyFormStats, setPropertyFormStats] = useSessionStorage({
    key: 'property-form-stats',
    initialValue: initialValues,
  });

  const [step, setStep] = useState(propertyFormStats.step);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isErrorDrawerOpen, setIsErrorDrawerOpen] = useState(false);
  const [progress, setProgress] = useState(propertyFormStats.progress);
  const [isLoading, setIsLoading] = useState(false);

  const isIntroStep = step === 0;
  const isFirstStep = !isIntroStep && step === 1;
  const isLastStep = propertySteps.length === step;
  const isCurrentStep = (id: number) => {
    return step > 0 && propertySteps[step - 1].id === id ? true : false;
  };

  function toggleSidebar() {
    setIsSidebarOpen((prev) => !prev);
  }

  function toggleErrorDrawer() {
    setIsErrorDrawerOpen((prev) => !prev);
  }

  const findCurrentStepDetails = () => {
    const stepDetails = propertySteps.find((s) => s.id === step);
    return stepDetails;
  };

  const currentStepDetails = findCurrentStepDetails() || {
    id: 0,
    title: 'Welcome to Rotate Key!',
    description:
      'Here you can create a new property listing or request an exchange. To get started, select a category from the menu and fill in the required details. We’ll save your progress automatically as you go.',
  };

  const { data: propertyDetails, isFetching } = usePropertyDetailsForUpdate(
    propertyId || '',
  );

  // react hook form initialize here
  const form = useForm<WizardValues>({
    resolver: zodResolver(combinedPropertySchema),
    defaultValues: defaultValues,
    mode: 'onChange',
    // criteriaMode: "all", // 👈 Enable all errors
    progressive: true,
  });

  useEffect(() => {
    if (propertyDetails) {
      const revertFromDate = propertyDetails.staysDateRange?.from
        ? new Date(propertyDetails.staysDateRange.from)
        : new Date();

      // set one month later for the to date if not provided
      const revertToDate = propertyDetails.staysDateRange?.to
        ? new Date(propertyDetails.staysDateRange.to)
        : new Date(revertFromDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days later
      form.setValues(
        {
          region: propertyDetails.region,
          country: propertyDetails.country,
          state: propertyDetails.state,
          city: propertyDetails.city,
          streetAddress: propertyDetails.streetAddress,
          zipcode: propertyDetails.zipcode,
          propertyArea: propertyDetails.area,
          propertyAreaUnit: propertyDetails.areaUnit,
          propertyDescription: propertyDetails.description,
          propertyType: propertyDetails.roomType,
          propertyOwnership: propertyDetails.ownership,
          propertySwaping: propertyDetails.swaping,
          propertyRentalTypes: propertyDetails.rentPeriod,
          propertySurrounding: propertyDetails.surrounding,
          propertyEnvironment: propertyDetails.environment,
          propertyAccomodationType: propertyDetails.accommodation,
          propertyBedRooms: propertyDetails.bedRooms,
          propertyBathRooms: propertyDetails.bathRooms,
          numberOfGuests: propertyDetails.guests,
          numberOfBeds: propertyDetails.bedRooms,
          hostKnownLanguages: propertyDetails.knownLanguages,
          propertyRules: propertyDetails.rules,
          propertyAccessibilities: propertyDetails.accessibilities,
          propertyAmenities: propertyDetails.amenities,
          staysDateRange: {
            from: revertFromDate,
            to: revertToDate,
          },
          staysDurationInDays: propertyDetails.staysDuration,
          propertyImages: propertyDetails.images,
          propertyOwnerName: propertyDetails.ownerName ?? '',
        },
        {
          shouldDirty: true,
          shouldTouch: true,
          shouldValidate: true,
        },
      );
    }
  }, [propertyDetails, form]);

  const FormPersistKey = propertyId
    ? `update-property-form-${propertyId}`
    : 'new-property-form';

  const { clear: clearDraft } = useFormPersist(FormPersistKey, {
    control: form.control,
    debounceDelay: 500,
    setValue: form.setValue,
    storage: safeSessionStorage,
    timeout: 1000 * 60 * 60 * 24, // 24 hours
    onDataRestored(data) {
      console.log('Restored form data:', data);
      toast.success('Form data restored', { position: 'bottom-right' });
    },
    onTimeout() {
      console.log('Form data has expired and is no longer available.');
      toast.error('Form data has expired and is no longer available.', {
        position: 'bottom-right',
      });
    },
    validate: true,
    dirty: true,
    touch: true,
  });

  async function validateStep(currentStep: number): Promise<boolean> {
    const fieldsForThisStep = currentStepFields[currentStep];
    setIsLoading(true);
    // validate only the current step's fields
    const ok = await form.trigger(fieldsForThisStep);
    if (!ok) {
      toggleErrorDrawer();
      throw new Error('Form validation failed for the current step.');
    }

    setIsLoading(false);
    // If the step matches a specific field group, trigger it; otherwise return true
    return ok;
  }

  function nextStep() {
    if (isIntroStep) {
      setStep(1);
      // inc by 10%
      setProgress(10);
      toggleErrorDrawer();
      return;
    } else {
      toast.promise(validateStep(step), {
        loading: 'Validating form...',
        success: (result) => {
          if (result) {
            setStep((prev) => Math.min(prev + 1, propertySteps.length));
            // inc by 10%
            setProgress((prev) => Math.min(prev + 10, 100));

            // Save the current step to session storage
            setPropertyFormStats((prev) => ({
              ...prev,
              step: Math.min(prev.step + 1, propertySteps.length),
              progress: Math.min(prev.progress + 10, 100),
            }));
          }
          setIsLoading(false);
          return 'Form is valid! Moving to next step...';
        },
        error: () => {
          setIsLoading(false);
          return 'Form validation failed. Please check the errors.';
        },
      });
    }
  }

  function prevStep() {
    setStep((prev) => Math.max(prev - 1, 1));
    // setProgress((prev) => Math.max(prev, step - 1));
    // dec by 10%
    setProgress((prev) => Math.max(prev - 10, 10));

    // Save the current step to session storage
    setPropertyFormStats((prev) => ({
      ...prev,
      step: Math.max(prev.step - 1, 1),
      progress: Math.max(prev.progress - 10, 10),
    }));
  }

  function handleStepChange(newStep: number) {
    if (isIntroStep) {
      setStep(newStep);
      // inc by 10%
      setProgress(10);
      return;
    } else {
      toast.promise(validateStep(step), {
        loading: 'Validating form...',
        success: (result) => {
          if (result) {
            setStep(newStep);
            // inc by 10%
            setProgress((prev) => Math.min(prev + 10, 100));

            // Save the current step to session storage
            setPropertyFormStats((prev) => ({
              ...prev,
              step: newStep,
              progress: Math.min(prev.progress + 10, 100),
            }));
          }
          setIsLoading(false);
          return 'Form is valid! Moving to next step...';
        },
        error: () => {
          setIsLoading(false);
          return 'Form validation failed. Please check the errors.';
        },
      });
    }
  }

  const values: PropertyContextType = {
    isSidebarOpen,
    toggleSidebar,
    propertySteps,
    step,
    onPrevStep: prevStep,
    onNextStep: nextStep,
    onStepChange: handleStepChange,
    isIntroStep,
    isFirstStep,
    isLastStep,
    isCurrentStep,
    currentStepDetails,
    isErrorDrawerOpen,
    onToggleErrorDrawer: toggleErrorDrawer,
    isLoading,
    // nextStep,

    progress,
    clearDraft,
  };

  return (
    <PropertyContext.Provider value={values}>
      <FormProvider {...form}>{children}</FormProvider>
    </PropertyContext.Provider>
  );
}

export function usePropertyContext() {
  const context = useContext(PropertyContext);

  if (!context) {
    throw new Error(
      'usePropertyContext must be used within a PropertyContextProvider',
    );
  }

  return context;
}
