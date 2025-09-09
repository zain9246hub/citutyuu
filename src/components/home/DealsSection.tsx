
import { Button } from "@/components/ui/button";
import { FilterOptions } from "@/types/deal";
import FeaturedDeals from "../FeaturedDeals";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeals } from "@/hooks/useDeals";

interface DealsSectionProps {
  selectedCity: string | null;
  searchQuery: string;
  filterOptions: FilterOptions;
  isLoading?: boolean;
}

const DealsSection = ({ 
  selectedCity, 
  searchQuery, 
  filterOptions,
  isLoading = false
}: DealsSectionProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { sortedDeals } = useDeals(selectedCity, searchQuery, filterOptions);
  
  return (
    <div className="mt-8 px-4 animate-fade-in transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg md:text-xl font-semibold relative group">
          <span className="relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary/20 after:origin-bottom-right after:transition-transform after:duration-300 group-hover:after:scale-x-100 group-hover:after:origin-bottom-left">
            Featured Deals {!isLoading && `(${sortedDeals.length})`}
          </span>
        </h2>
        <Button 
          variant="ghost" 
          size={isMobile ? "sm" : "default"} 
          className="text-primary font-medium h-auto p-0 hover:underline flex items-center transition-all duration-300 hover:translate-x-1"
          onClick={() => navigate('/explore')}
        >
          View All
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="ml-1 transition-transform duration-300 group-hover:translate-x-1"
          >
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </Button>
      </div>
      
      {isLoading ? (
        <div className="md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3 animate-pulse">
          {[1, 2, 3].map((index) => (
            <Skeleton 
              key={index}
              className="w-full h-[340px] md:h-[280px] rounded-lg mb-4"
            />
          ))}
        </div>
      ) : (
        <div className="md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3 animate-scale-in">
          <FeaturedDeals 
            cityFilter={selectedCity === "All Cities" ? null : selectedCity} 
            searchQuery={searchQuery}
            filterOptions={filterOptions}
          />
        </div>
      )}
    </div>
  );
};

export default DealsSection;
