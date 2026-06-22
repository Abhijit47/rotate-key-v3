'use client';

// import necessary modules
import { createContext, ReactNode, useContext, useState } from 'react';

type ModalContextType = {
  isOpen: boolean;
  toggleModal: () => void;
};

// create context
export const ModalContext = createContext({} as ModalContextType);

// create provider
export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  function toggleModal() {
    setIsOpen((prev) => !prev);
  }

  return (
    <ModalContext.Provider value={{ isOpen, toggleModal }}>
      {children}
    </ModalContext.Provider>
  );
}

// create custom hook
export function useModal() {
  const context = useContext(ModalContext);

  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  return context;
}
