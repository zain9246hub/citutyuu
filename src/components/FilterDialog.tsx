
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { FilterOptions } from "@/types/deal";
import CategoryFilter from "./filters/CategoryFilter";
import PriceRangeFilter from "./filters/PriceRangeFilter";
import SortByFilter from "./filters/SortByFilter";
import CitySelectionFilter from "./filters/CitySelectionFilter";
import { categoryOptions, priceRangeOptions, sortOptions } from "./filters/FilterOptions";

interface FilterDialogProps {
  trigger: React.ReactNode;
  onFilterChange: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const FilterDialog = ({ 
  trigger, 
  onFilterChange, 
  currentFilters,
  open: controlledOpen,
  onOpenChange
}: FilterDialogProps) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(currentFilters);
  const [internalOpen, setInternalOpen] = useState(false);
  
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? onOpenChange || (() => {}) : setInternalOpen;
  
  // Sync local filters when current filters change
  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked 
      ? [...localFilters.categories, category]
      : localFilters.categories.filter(c => c !== category);
    
    setLocalFilters({
      ...localFilters,
      categories: newCategories
    });
  };

  const handlePriceRangeChange = (value: string) => {
    setLocalFilters({
      ...localFilters,
      priceRange: value
    });
  };

  const handleSortChange = (value: string) => {
    setLocalFilters({
      ...localFilters,
      sortBy: value
    });
  };

  const handleCityChange = (city: string | null) => {
    setLocalFilters({
      ...localFilters,
      selectedCity: city
    });
  };

  const handlePopularToggle = (checked: boolean) => {
    setLocalFilters({
      ...localFilters,
      showPopular: checked
    });
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
    setOpen(false); // Close the popover after applying filters
  };

  const handleResetFilters = () => {
    const resetFilters = {
      categories: [],
      priceRange: null,
      sortBy: "relevance",
      showPopular: false,
      selectedCity: null
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent className="w-screen max-w-sm p-0 border rounded-lg shadow-lg bg-popover z-50 animate-in fade-in slide-in-from-top-5 duration-300" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Filters</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 transition-transform hover:rotate-90 duration-200"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-4 max-h-[70vh] overflow-auto">
          {/* City Selection */}
          <div className="transition-all duration-200 hover:translate-x-1">
            <CitySelectionFilter
              selectedCity={localFilters.selectedCity}
              onCityChange={handleCityChange}
            />
          </div>
          
          <Separator className="my-4" />
          
          {/* Categories */}
          <div className="transition-all duration-200 hover:translate-x-1">
            <CategoryFilter 
              categories={categoryOptions}
              selectedCategories={localFilters.categories}
              onCategoryChange={handleCategoryChange}
            />
          </div>
          
          <Separator className="my-4" />
          
          {/* Price Range */}
          <div className="transition-all duration-200 hover:translate-x-1">
            <PriceRangeFilter
              priceRanges={priceRangeOptions}
              selectedRange={localFilters.priceRange}
              onPriceRangeChange={handlePriceRangeChange}
            />
          </div>
          
          <Separator className="my-4" />
          
          {/* Sort By */}
          <div className="transition-all duration-200 hover:translate-x-1">
            <SortByFilter
              sortOptions={sortOptions}
              selectedSort={localFilters.sortBy}
              onSortChange={handleSortChange}
            />
          </div>
          
          <Separator className="my-4" />
          
          {/* Most Popular Toggle */}
          <div className="mb-4 transition-all duration-200 hover:translate-x-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Show Most Popular</h3>
                <p className="text-xs text-gray-500">Only show restaurants with high ratings (4.5+)</p>
              </div>
              <Switch 
                checked={localFilters.showPopular}
                onCheckedChange={handlePopularToggle}
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-4 border-t bg-muted/30">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleResetFilters}
            className="transition-all duration-200 hover:bg-slate-200"
          >
            Reset All
          </Button>
          <Button 
            size="sm"
            onClick={handleApplyFilters}
            className="transition-all duration-200 hover:scale-105"
          >
            Apply Filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterDialog;
