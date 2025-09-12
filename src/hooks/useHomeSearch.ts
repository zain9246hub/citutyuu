
import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { FilterOptions } from "@/types/deal";
import { throttle } from "@/utils/performanceUtils";

export const useHomeSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
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

  // Update filter options when needed
  useEffect(() => {
    setFilterOptions(prev => ({
      ...prev,
      selectedCity: null
    }));
  }, []);

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
    filterOpen,
    isLoading,
    filterOptions,
    handleSearchChange,
    handleFilterChange,
    handleFilterToggle,
    setFilterOpen
  };
};
