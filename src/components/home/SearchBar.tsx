
import { Search, Filter, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FilterOptions } from "@/types/deal";
import { useIsMobile } from "@/hooks/use-mobile";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onFilterToggle: () => void;
  filterOptions: FilterOptions;
  isLoading?: boolean;
  dealCount?: number;
}

const SearchBar = ({ 
  searchQuery, 
  onSearchChange, 
  onFilterToggle,
  filterOptions,
  isLoading = false,
  dealCount
}: SearchBarProps) => {
  const hasActiveFilters = filterOptions.categories.length > 0 || filterOptions.priceRange;
  const isMobile = useIsMobile();
  
  return (
    <div className="relative flex items-center mb-4 animate-fade-in">
      {isLoading ? (
        <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 animate-spin" />
      ) : (
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      )}
      <Input
        placeholder={isMobile ? "Search deals..." : "Search deals, offers and more..."}
        className="pl-10 pr-12 py-2 w-full bg-background border border-border shadow-sm hover:shadow-md transition-all duration-300 rounded-lg h-12 md:h-10 text-base md:text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        disabled={isLoading}
        aria-label={dealCount !== undefined ? `Search ${dealCount} deals` : "Search deals"}
      />
      <Button 
        variant={hasActiveFilters ? "secondary" : "ghost"}
        size="icon" 
        className={cn(
          "absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10 md:h-8 md:w-8 transition-all duration-300",
          hasActiveFilters ? "bg-primary/10 hover:bg-primary/20" : "hover:bg-gray-100"
        )}
        onClick={onFilterToggle}
        disabled={isLoading}
        aria-label="Toggle filters"
      >
        <Filter 
          className={cn(
            "h-4 w-4 transition-all duration-300", 
            hasActiveFilters ? "text-primary" : ""
          )} 
        />
      </Button>
    </div>
  );
};

export default SearchBar;
