
import React from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface NoBusinessesFoundProps {
  onClearFilters: () => void;
}

const NoBusinessesFound = ({ onClearFilters }: NoBusinessesFoundProps) => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Search className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium mb-2">No Businesses Found</h3>
      <p className="text-gray-500 mb-6 max-w-xs mx-auto">
        We couldn't find any business matching your current filters. Try adjusting your search criteria.
      </p>
      <Button onClick={onClearFilters}>
        Clear All Filters
      </Button>
    </div>
  );
};

export default NoBusinessesFound;
