
import React from "react";
import RestaurantCard from "./RestaurantCard";
import NoRestaurantsFound from "./NoRestaurantsFound";
import { Restaurant } from "@/data/restaurantData";
import { ArrowUp, ArrowDown, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface RestaurantListProps {
  restaurants: Restaurant[];
  showNearby: boolean;
  userLocation: { lat: number; lng: number } | null;
  selectedCity: string | null;
  onRestaurantClick: (id: string) => void;
  onClearFilters: () => void;
  sortBy: string;
  showPopular: boolean;
  isLoading?: boolean;
}

const RestaurantList = ({ 
  restaurants, 
  showNearby, 
  userLocation, 
  selectedCity, 
  onRestaurantClick,
  onClearFilters,
  sortBy,
  showPopular,
  isLoading = false
}: RestaurantListProps) => {
  const getSortDescription = () => {
    switch (sortBy) {
      case "rating-high-low":
        return "Highest rated first";
      case "price-low-high":
        return "Cheapest first";
      case "price-high-low":
        return "Most expensive first";
      case "distance":
        return "Nearest first";
      default:
        return "By relevance";
    }
  };

  const getSortIcon = () => {
    if (sortBy === "rating-high-low" || sortBy === "price-high-low") {
      return <ArrowDown className="h-4 w-4 inline-block ml-1" />;
    } else if (sortBy === "price-low-high") {
      return <ArrowUp className="h-4 w-4 inline-block ml-1" />;
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto w-full px-4 animate-fade-in">
        <div className="mb-5 bg-gray-50 p-3 rounded-lg">
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-56" />
        </div>
        
        <div className="space-y-6">
          {[1, 2, 3].map((index) => (
            <Skeleton key={index} className="h-80 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto w-full px-4 animate-fade-in">
      <div className="mb-5 bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{restaurants.length} Restaurants Found</h2>
          <Badge variant="outline" className="flex items-center gap-1 px-2 py-1 bg-white">
            <SlidersHorizontal className="h-3 w-3" />
            <span className="text-xs font-medium">{getSortDescription()}</span>
            {getSortIcon()}
          </Badge>
        </div>
        
        <p className="text-sm text-gray-600 mt-1">
          {showNearby && userLocation 
            ? "Showing restaurants near your location" 
            : selectedCity 
              ? `Showing restaurants in ${selectedCity}` 
              : "Showing results in all cities"}
          
          {showPopular && (
            <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
              Most Popular
            </span>
          )}
        </p>
      </div>

      <div className="space-y-6">
        {restaurants.length > 0 ? (
          restaurants.map((restaurant) => (
            <RestaurantCard 
              key={restaurant.id} 
              restaurant={restaurant} 
              onClick={onRestaurantClick} 
            />
          ))
        ) : (
          <NoRestaurantsFound onClearFilters={onClearFilters} />
        )}
      </div>
    </div>
  );
};

export default RestaurantList;
