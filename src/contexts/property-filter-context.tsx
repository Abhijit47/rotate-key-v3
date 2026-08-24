'use client';

// import necessary modules
import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useTransition,
} from 'react';

// define the context type
type PropertyFilterContextType = {
  isFilterModalOpen: boolean;
  onToggleFilterModal: () => void;
  isTransition: boolean;
  startTransition: (callback: () => void) => void;
};

// define the initial state
const initialState: PropertyFilterContextType = {
  isFilterModalOpen: false,
  isTransition: false,
  startTransition: () => {},
  onToggleFilterModal: () => {},
};

// create context
export const PropertyFilterContext = createContext(initialState);

// create provider
export function PropertyFilterProvider({ children }: { children: ReactNode }) {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isTransition, startTransition] = useTransition();

  function toggleFilterModal() {
    setIsFilterModalOpen((prev) => !prev);
  }

  return (
    <PropertyFilterContext.Provider
      value={{
        isFilterModalOpen,
        isTransition,
        startTransition,
        onToggleFilterModal: toggleFilterModal,
      }}>
      {children}
    </PropertyFilterContext.Provider>
  );
}

// create custom hook
export function usePropertyFilter() {
  const context = useContext(PropertyFilterContext);

  if (!context) {
    throw new Error(
      'usePropertyFilter must be used within a PropertyFilterProvider',
    );
  }

  return context;
}
