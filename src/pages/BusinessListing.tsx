
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useCityContext } from "@/contexts/CityContext";
import Navbar from "@/components/Navbar";
import CityFilter from "@/components/CityFilter";
import SearchFilterBar from "@/components/business/SearchFilterBar";
import CategoryFilter from "@/components/business/CategoryFilter";
import BusinessList from "@/components/business/BusinessList";
import { businesses as staticBusinesses } from "@/data/businessData";
import { 
  filterBusinesses, 
  extractUniqueCategories
} from "@/utils/businessUtils";
import { categoryOptions } from "@/components/filters/FilterOptions";

const BusinessListing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { selectedCity: globalCity, setSelectedCity: setGlobalCity } = useCityContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showNearby, setShowNearby] = useState(false);
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: null,
    sortBy: "relevance",
    showPopular: false,
    selectedCity: null
  });
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  // Combine static businesses with user-submitted ones from localStorage
  const getUserBusinesses = () => {
    try {
      return JSON.parse(localStorage.getItem('userBusinesses') || '[]');
    } catch {
      return [];
    }
  };

  const businesses = [...getUserBusinesses(), ...staticBusinesses];

  // Get user's location when "Find Nearby" is clicked
  useEffect(() => {
    if (showNearby) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          toast({
            title: "Location Found",
            description: "Showing businesses near your current location",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location Error",
            description: "Could not get your location. Please check your browser permissions.",
            variant: "destructive"
          });
          setShowNearby(false);
        }
      );
    }
  }, [showNearby, toast]);

  // Sync city selection with global context
  const handleCitySelect = (city: string | null) => {
    console.log('[BusinessListing] City selected:', city);
    const normalizedCity = city === "All Cities" ? "All Cities" : city || "All Cities";
    setGlobalCity(normalizedCity);
    setFilters(prevFilters => ({
      ...prevFilters,
      selectedCity: city
    }));
  };

  // Convert global city to filter format
  const selectedCityForFilter = globalCity === "All Cities" ? null : globalCity;
  
  // Filter businesses based on all selected criteria
  const filteredBusinesses = filterBusinesses(
    businesses,
    {
      searchQuery,
      selectedCategory,
      selectedCity: filters.selectedCity || selectedCityForFilter,
      categories: filters.categories,
      priceRange: filters.priceRange,
      showNearby,
      userLocation,
      sortBy: filters.sortBy,
      showPopular: filters.showPopular
    }
  );

  // Unique list of categories from all businesses
  const allCategories = extractUniqueCategories(businesses);

  const handleBusinessClick = (id: string) => {
    // Navigate to the business detail page with ID
    navigate(`/business/${id}`);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };

  const handleFilterChange = (newFilters: any) => {
    console.log('[BusinessListing] Filters changed:', newFilters);
    setFilters(newFilters);
    
    // Update global city if it changed in filters
    if (newFilters.selectedCity !== selectedCityForFilter) {
      const normalizedCity = newFilters.selectedCity || "All Cities";
      setGlobalCity(normalizedCity);
    }
  };

  const handleFindNearby = () => {
    setShowNearby(true);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setGlobalCity("All Cities");
    setShowNearby(false);
    setFilters({
      categories: [],
      priceRange: null,
      sortBy: "relevance",
      showPopular: false,
      selectedCity: null
    });
  };

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header with search bar */}
      <div className="fixed top-0 left-0 right-0 bg-background z-10 shadow-sm border-b border-border">
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onFindNearby={handleFindNearby}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        
        {/* City filter */}
        <CityFilter 
          selectedCity={selectedCityForFilter} 
          onSelectCity={handleCitySelect}
          autoPlay={true}
        />

        {/* Category filter chips */}
        <CategoryFilter
          categories={allCategories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategoryFilter}
        />
      </div>

      {/* Business list */}
      <div className="pt-48">
        <BusinessList
          businesses={filteredBusinesses}
          showNearby={showNearby}
          userLocation={userLocation}
          selectedCity={filters.selectedCity || selectedCityForFilter}
          onBusinessClick={handleBusinessClick}
          onClearFilters={handleClearFilters}
          sortBy={filters.sortBy}
          showPopular={filters.showPopular}
        />
      </div>

      <Navbar />
    </div>
  );
};

export default BusinessListing;
