
import React from "react";
import { Button } from "@/components/ui/button";

interface NoRestaurantsFoundProps {
  onClearFilters: () => void;
}

const NoRestaurantsFound = ({ onClearFilters }: NoRestaurantsFoundProps) => {
  return (
    <div className="text-center py-8">
      <p className="text-gray-500">No restaurants found matching your criteria</p>
      <Button 
        variant="outline" 
        className="mt-2"
        onClick={onClearFilters}
      >
        Clear filters
      </Button>
    </div>
  );
};

export default NoRestaurantsFound;
