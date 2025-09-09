
import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { FilterOptions } from "@/types/deal";
import { throttle } from "@/utils/performanceUtils";

export const useHomeSearch = (initialCity: string = "All Cities") => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>(initialCity);
  const [filterOpen, setFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    categories: [],
    priceRange: null,
    sortBy: "relevance",
    showPopular: false,
    selectedCity: null
  });
  
  // Use refs to prevent recreation of stable values
  const loadingTimeoutRef = useRef<NodeJS.Timeout>();
  const isInitializedRef = useRef(false);
  
  // Stable initial load effect - only run once
  useEffect(() => {
    if (isInitializedRef.current) return;
    
    isInitializedRef.current = true;
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Memoize the throttled function to prevent recreation
  const throttledSetSearchQuery = useMemo(
    () => throttle((value: string) => {
      setIsLoading(true);
      setSearchQuery(value);
      
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      
      loadingTimeoutRef.current = setTimeout(() => {
        setIsLoading(false);
      }, 150);
    }, 200),
    []
  );

  // Stable search handler
  const handleSearchChange = useCallback((value: string) => {
    throttledSetSearchQuery(value);
  }, [throttledSetSearchQuery]);

  // Stable filter handler
  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setIsLoading(true);
    setFilterOptions(newFilters);
    
    // Update selected city if provided in filters
    if (newFilters.selectedCity !== undefined) {
      setSelectedCity(newFilters.selectedCity || "All Cities");
    }
    
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    
    loadingTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
    }, 150);
  }, []);
  
  // Stable filter toggle
  const handleFilterToggle = useCallback(() => {
    setFilterOpen(prev => !prev);
  }, []);

  // Optimized city effect - prevent infinite re-renders
  useEffect(() => {
    const newSelectedCity = selectedCity === "All Cities" ? null : selectedCity;
    
    // Only update if the value actually changed
    if (filterOptions.selectedCity !== newSelectedCity) {
      setFilterOptions(prev => ({
        ...prev,
        selectedCity: newSelectedCity
      }));
    }
  }, [selectedCity]); // Remove filterOptions.selectedCity from dependencies

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  return {
    searchQuery,
    selectedCity,
    filterOpen,
    isLoading,
    filterOptions,
    setSelectedCity,
    handleSearchChange,
    handleFilterChange,
    handleFilterToggle,
    setFilterOpen
  };
};
