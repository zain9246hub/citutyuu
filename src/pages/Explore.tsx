
import { useState } from "react";
import Navbar from "../components/Navbar";
import TopNavbar from "../components/TopNavbar";
import FeaturedDeals from "../components/FeaturedDeals";
import CityFilter from "../components/CityFilter";
import { Search, Filter, X, Share2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import FilterDialog from "@/components/FilterDialog";
import { FilterOptions } from "@/types/deal";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useDeals } from "@/hooks/useDeals";

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(() => 
    localStorage.getItem('selectedCity') === 'All Cities' ? null : localStorage.getItem('selectedCity') || null
  );
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    categories: [],
    priceRange: null,
    sortBy: "relevance",
    showPopular: false
  });
  
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const isExplorer = currentUser?.role === 'explorer';
  const { sortedDeals } = useDeals(selectedCity, searchQuery, filterOptions);
  
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilterOptions(newFilters);
    if (newFilters.selectedCity !== undefined) {
      setSelectedCity(newFilters.selectedCity);
    }
  };
  
  const handleFilterToggle = () => {
    setFilterOpen(!filterOpen);
  };
  
  const removeCategory = (category: string) => {
    setFilterOptions({
      ...filterOptions,
      categories: filterOptions.categories.filter(c => c !== category)
    });
  };
  
  const clearPriceRange = () => {
    setFilterOptions({
      ...filterOptions,
      priceRange: null
    });
  };

  const handleShare = () => {
    const shareText = `Check out amazing deals on Lovable! ${selectedCity ? `Best deals in ${selectedCity}` : ''}`;
    navigator.clipboard.writeText(shareText).then(() => {
      toast({
        title: "Deals Shared",
        description: "Deal page link copied to clipboard",
      });
    });
  };
  
  const hasActiveFilters = filterOptions.categories.length > 0 || filterOptions.priceRange;

  const shareAction = isExplorer ? (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleShare}
      className="text-foreground/70 hover:text-foreground"
    >
      <Share2 className="h-5 w-5" />
    </Button>
  ) : null;
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <TopNavbar 
        title={`Explore Deals ${sortedDeals ? `(${sortedDeals.length})` : ''}`} 
        showBackButton={true}
        actions={shareAction}
      />
      
      <div className="flex-1 max-w-md mx-auto w-full pb-20">
        <div className="p-4 sticky top-14 bg-background z-30 border-b border-border shadow-sm">
          <div className="relative flex items-center mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search deals..."
              className="pl-10 pr-12 py-2 w-full bg-muted/50 border border-border rounded-lg h-12 shadow-sm focus:shadow transition-shadow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              variant={hasActiveFilters ? "secondary" : "ghost"}
              size="icon" 
              className={cn(
                "absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10",
                hasActiveFilters ? "bg-primary/10" : ""
              )}
              onClick={handleFilterToggle}
            >
              <Filter 
                className={`h-4 w-4 ${hasActiveFilters ? "text-primary" : ""}`} 
              />
            </Button>
            
            <FilterDialog
              trigger={<div className="hidden">Filter</div>}
              onFilterChange={handleFilterChange}
              currentFilters={filterOptions}
              open={filterOpen}
              onOpenChange={setFilterOpen}
            />
          </div>
          
          <CityFilter 
            selectedCity={selectedCity} 
            onSelectCity={(city) => {
              setSelectedCity(city);
              setFilterOptions({
                ...filterOptions,
                selectedCity: city
              });
            }}
            autoPlay={true}
          />
          
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-3 animate-fade-in">
              {filterOptions.categories.map(category => (
                <Badge key={category} variant="outline" className="text-xs px-3 py-1 bg-primary/5 border-primary/20">
                  {category}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer hover:text-red-500 transition-colors" 
                    onClick={() => removeCategory(category)}
                  />
                </Badge>
              ))}
              
              {filterOptions.priceRange && (
                <Badge variant="outline" className="text-xs px-3 py-1 bg-primary/5 border-primary/20">
                  {filterOptions.priceRange.replace('-', ' to ').replace('under-', 'Under ₹').replace('above-', 'Above ₹')}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer hover:text-red-500 transition-colors" 
                    onClick={clearPriceRange}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>
        
        <div className="px-4 pt-2">
          <FeaturedDeals 
            cityFilter={selectedCity} 
            searchQuery={searchQuery} 
            filterOptions={filterOptions}
            allowSharingForExplorers={isExplorer}
            showAsCarousel={false}
            autoPlay={false}
          />
        </div>
      </div>
      
      <Navbar />
    </div>
  );
};

export default Explore;
