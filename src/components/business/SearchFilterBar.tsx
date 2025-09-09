
import React, { useState } from "react";
import { Search, Filter, ArrowLeft, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FilterDialog from "@/components/FilterDialog";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onFindNearby: () => void;
  filters: {
    categories: string[];
    priceRange: string | null;
    sortBy: string;
    showPopular: boolean;
  };
  onFilterChange: (filters: any) => void;
}

const SearchFilterBar = ({ 
  searchQuery, 
  onSearchChange, 
  onFindNearby, 
  filters, 
  onFilterChange 
}: SearchFilterBarProps) => {
  const navigate = useNavigate();
  const [filterOpen, setFilterOpen] = useState(false);
  
  const handleFilterToggle = () => {
    setFilterOpen(!filterOpen);
  };

  const hasActiveFilters = filters.categories.length > 0 || filters.priceRange;

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex items-center mb-3">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold flex-1">Discover Businesses</h1>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="mr-2 flex items-center gap-1 hover:bg-muted transition-colors"
          onClick={onFindNearby}
        >
          <Navigation className="h-4 w-4 text-primary" />
          <span className="whitespace-nowrap">Find Nearby</span>
        </Button>
        
        <FilterDialog 
          trigger={
            <Button 
              variant={hasActiveFilters ? "secondary" : "outline"}
              size="icon"
              onClick={handleFilterToggle}
              className={cn(
                "transition-all",
                hasActiveFilters ? "border-primary bg-primary/10" : ""
              )}
            >
              <Filter className={`h-4 w-4 ${hasActiveFilters ? "text-primary" : ""}`} />
            </Button>
          }
          onFilterChange={(newFilters) => {
            onFilterChange(newFilters);
            setFilterOpen(false);
          }}
          currentFilters={filters}
          open={filterOpen}
          onOpenChange={setFilterOpen}
        />
      </div>
      
      <div className="relative flex items-center mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search businesses, categories, or location..."
          className="pl-10 pr-12 py-2 w-full bg-muted border border-border rounded-lg h-12 shadow-sm focus:shadow focus:ring-2 focus:ring-ring focus:border-ring transition-all"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <Button 
          variant={hasActiveFilters ? "secondary" : "ghost"}
          size="icon" 
            className={cn(
              "absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10",
              hasActiveFilters ? "bg-primary/10 text-primary" : ""
            )}
          onClick={handleFilterToggle}
        >
          <Filter className={`h-4 w-4 ${hasActiveFilters ? "text-primary" : ""}`} />
        </Button>
      </div>
    </div>
  );
};

export default SearchFilterBar;
