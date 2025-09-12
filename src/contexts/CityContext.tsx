import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CITIES_WITH_ALL } from "@/utils/cityData";

interface CityContextType {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  cities: readonly string[];
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export const useCityContext = () => {
  const context = useContext(CityContext);
  if (context === undefined) {
    throw new Error('useCityContext must be used within a CityProvider');
  }
  return context;
};

export const CityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCity, setSelectedCityState] = useState<string>(() => {
    const saved = localStorage.getItem('selectedCity');
    return saved === 'All Cities' || !saved ? 'All Cities' : saved;
  });

  const setSelectedCity = useCallback((city: string) => {
    const normalizedCity = city || 'All Cities';
    setSelectedCityState(normalizedCity);
    localStorage.setItem('selectedCity', normalizedCity);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('cityChanged', { 
      detail: { city: normalizedCity } 
    }));
  }, []);

  // Listen for storage changes to sync across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'selectedCity' && e.newValue) {
        setSelectedCityState(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value = {
    selectedCity,
    setSelectedCity,
    cities: CITIES_WITH_ALL
  };

  return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
};