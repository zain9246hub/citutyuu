
import React from "react";
import BusinessCard from "./BusinessCard";
import NoBusinessesFound from "./NoBusinessesFound";
import { Business } from "@/data/businessData";
import { ArrowUp, ArrowDown, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";

interface BusinessListProps {
  businesses: Business[];
  showNearby: boolean;
  userLocation: { lat: number; lng: number } | null;
  selectedCity: string | null;
  onBusinessClick: (id: string) => void;
  onClearFilters: () => void;
  sortBy: string;
  showPopular: boolean;
  isLoading?: boolean;
}

const BusinessList = ({ 
  businesses, 
  showNearby, 
  userLocation, 
  selectedCity, 
  onBusinessClick,
  onClearFilters,
  sortBy,
  showPopular,
  isLoading = false
}: BusinessListProps) => {
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
        <div className="mb-5 bg-muted/50 p-3 rounded-lg">
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
      <div className="mb-5 bg-muted/50 p-3 rounded-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">{businesses.length} Businesses Found</h2>
          <Badge variant="outline" className="flex items-center gap-1 px-2 py-1 bg-background">
            <SlidersHorizontal className="h-3 w-3" />
            <span className="text-xs font-medium">
              {getSortDescription()}
              {getSortIcon()}
            </span>
          </Badge>
        </div>
        
        <p className="text-sm text-muted-foreground mt-1">
          {showNearby && userLocation 
            ? "Showing businesses near your location" 
            : selectedCity 
              ? `Showing businesses in ${selectedCity}` 
              : "Showing results in all cities"}
          
          {showPopular && (
            <span className="ml-2 bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full">
              Most Popular
            </span>
          )}
        </p>
      </div>

      <div className="space-y-6">
        {businesses.length > 0 ? (
          businesses.map((business) => (
            <div key={business.id} className="relative">
              {business.isUserSubmitted && (
                <div className="absolute -top-2 -right-2 z-10">
                  <Badge variant="secondary" className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg animate-pulse">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Recently Added
                  </Badge>
                </div>
              )}
              <BusinessCard 
                business={business} 
                onClick={onBusinessClick} 
              />
            </div>
          ))
        ) : (
          <NoBusinessesFound onClearFilters={onClearFilters} />
        )}
      </div>
    </div>
  );
};

export default BusinessList;
