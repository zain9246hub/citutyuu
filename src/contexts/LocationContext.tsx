import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation as useRouterLocation, useNavigate } from 'react-router-dom';

// Demo data for location statuses - In real app this would come from Supabase
const DEMO_APPROVED_LOCATIONS = {
  states: ["Maharashtra"], // Only one state approved to show more Coming Soon tags
  cities: ["Mumbai"] // Only one city approved to show more Coming Soon tags
};

interface LocationContextType {
  selectedState: string;
  selectedCity: string;
  setSelectedState: (state: string) => void;
  setSelectedCity: (city: string) => void;
  isLocationApproved: (location: string, type: 'state' | 'city') => boolean;
  isCurrentLocationApproved: () => boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useRouterLocation();
  const navigate = useNavigate();
  
  // Get initial values from URL params
  const getInitialValues = () => {
    const params = new URLSearchParams(location.search);
    return {
      state: params.get('state') || 'All States',
      city: params.get('city') || 'All Cities'
    };
  };

  const [selectedState, setSelectedStateInternal] = useState<string>(() => getInitialValues().state);
  const [selectedCity, setSelectedCityInternal] = useState<string>(() => getInitialValues().city);

  // Update URL when state/city changes
  const updateURL = (newState: string, newCity: string) => {
    const params = new URLSearchParams(location.search);
    if (newState !== 'All States') {
      params.set('state', newState);
    } else {
      params.delete('state');
    }
    
    if (newCity !== 'All Cities') {
      params.set('city', newCity);
    } else {
      params.delete('city');
    }
    
    const newSearch = params.toString();
    const newPath = location.pathname + (newSearch ? `?${newSearch}` : '');
    
    if (newPath !== location.pathname + location.search) {
      navigate(newPath, { replace: true });
    }
  };

  const setSelectedState = (state: string) => {
    setSelectedStateInternal(state);
    // Reset city when state changes
    const newCity = 'All Cities';
    setSelectedCityInternal(newCity);
    updateURL(state, newCity);
  };

  const setSelectedCity = (city: string) => {
    setSelectedCityInternal(city);
    updateURL(selectedState, city);
  };

  // Check if a location is approved
  const isLocationApproved = (location: string, type: 'state' | 'city'): boolean => {
    if (location === 'All States' || location === 'All Cities') return true;
    return DEMO_APPROVED_LOCATIONS[type === 'state' ? 'states' : 'cities'].includes(location);
  };

  // Check if current selection is approved
  const isCurrentLocationApproved = (): boolean => {
    if (selectedState === 'All States' && selectedCity === 'All Cities') return true;
    if (selectedState !== 'All States' && !isLocationApproved(selectedState, 'state')) return false;
    if (selectedCity !== 'All Cities' && !isLocationApproved(selectedCity, 'city')) return false;
    return true;
  };

  // Update state when URL changes
  useEffect(() => {
    const values = getInitialValues();
    setSelectedStateInternal(values.state);
    setSelectedCityInternal(values.city);
  }, [location.search]);

  const value = {
    selectedState,
    selectedCity,
    setSelectedState,
    setSelectedCity,
    isLocationApproved,
    isCurrentLocationApproved
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};