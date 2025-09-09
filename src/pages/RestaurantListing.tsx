
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import CityFilter from "@/components/CityFilter";
import SearchFilterBar from "@/components/restaurant/SearchFilterBar";
import CuisineFilter from "@/components/restaurant/CuisineFilter";
import RestaurantList from "@/components/restaurant/RestaurantList";
import { restaurants } from "@/data/restaurantData";
import { 
  filterRestaurants, 
  extractUniqueCuisines 
} from "@/utils/restaurantUtils";
import { categoryOptions } from "@/components/filters/FilterOptions";

const RestaurantListing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(() => 
    localStorage.getItem('selectedCity') === 'All Cities' ? null : localStorage.getItem('selectedCity') || null
  );
  const [showNearby, setShowNearby] = useState(false);
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: null,
    sortBy: "relevance",
    showPopular: false,
    selectedCity: null
  });
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

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
            description: "Showing restaurants near your current location",
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

  // Sync city selection with filters - single source of truth
  const handleCitySelect = (city: string | null) => {
    console.log('[RestaurantListing] City selected:', city);
    setSelectedCity(city);
    setFilters(prevFilters => ({
      ...prevFilters,
      selectedCity: city
    }));
  };

  // Filter restaurants based on all selected criteria
  const filteredRestaurants = filterRestaurants(
    restaurants,
    {
      searchQuery,
      selectedCuisine,
      selectedCity: filters.selectedCity || selectedCity,
      categories: filters.categories,
      priceRange: filters.priceRange,
      showNearby,
      userLocation,
      sortBy: filters.sortBy,
      showPopular: filters.showPopular
    }
  );

  // Unique list of cuisines from all restaurants
  const allCuisines = extractUniqueCuisines(restaurants);

  const handleRestaurantClick = (id: string) => {
    // Navigate to the restaurant detail page
    navigate("/restaurant");
  };

  const handleCuisineFilter = (cuisine: string) => {
    setSelectedCuisine(selectedCuisine === cuisine ? null : cuisine);
  };

  const handleFilterChange = (newFilters: any) => {
    console.log('[RestaurantListing] Filters changed:', newFilters);
    setFilters(newFilters);
    
    // Update selectedCity if it changed in filters
    if (newFilters.selectedCity !== selectedCity) {
      setSelectedCity(newFilters.selectedCity);
    }
  };

  const handleFindNearby = () => {
    setShowNearby(true);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCuisine(null);
    setSelectedCity(null);
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
      <div className="fixed top-0 left-0 right-0 bg-white z-10 shadow-sm">
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onFindNearby={handleFindNearby}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        
        {/* City filter */}
        <CityFilter 
          selectedCity={selectedCity} 
          onSelectCity={handleCitySelect}
          autoPlay={true}
        />

        {/* Cuisine filter chips */}
        <CuisineFilter
          cuisines={allCuisines}
          selectedCuisine={selectedCuisine}
          onCuisineSelect={handleCuisineFilter}
        />
      </div>

      {/* Restaurant list */}
      <div className="pt-44">
        <RestaurantList
          restaurants={filteredRestaurants}
          showNearby={showNearby}
          userLocation={userLocation}
          selectedCity={filters.selectedCity || selectedCity}
          onRestaurantClick={handleRestaurantClick}
          onClearFilters={handleClearFilters}
          sortBy={filters.sortBy}
          showPopular={filters.showPopular}
        />
      </div>

      <Navbar />
    </div>
  );
};

export default RestaurantListing;
