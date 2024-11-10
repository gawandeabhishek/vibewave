"use client"

// src/contexts/StarsWorldContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define the type for the specific context state
interface StarsWorldContextType {
  isStarsWorld: boolean;
  setIsStarsWorld: (value: boolean) => void;
}

// Create the context for the specific global state
const StarsWorldContext = createContext<StarsWorldContextType | undefined>(undefined);

// Create a provider component for this specific state
interface StarsWorldProviderProps {
  children: ReactNode;
}

export const StarsWorldProvider: React.FC<StarsWorldProviderProps> = ({ children }) => {
  // Get initial state from localStorage, fallback to false if not available
  const initialIsStarsWorld = typeof window !== 'undefined' && localStorage.getItem('isStarsWorld') === 'true';

  const [isStarsWorld, setIsStarsWorld] = useState<boolean>(initialIsStarsWorld);

  // Update localStorage whenever `isStarsWorld` changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isStarsWorld', String(isStarsWorld));
    }
  }, [isStarsWorld]);

  return (
    <StarsWorldContext.Provider value={{ isStarsWorld, setIsStarsWorld }}>
      {children}
    </StarsWorldContext.Provider>
  );
};

// Custom hook to access the `isStarsWorld` global state
export const useStarsWorldState = (): StarsWorldContextType => {
  const context = useContext(StarsWorldContext);
  if (!context) {
    throw new Error('useStarsWorldState must be used within a StarsWorldProvider');
  }
  return context;
};
