
import { Button } from "@/components/ui/button";
import { FilterOptions } from "@/types/deal";

interface EmptyDealsMessageProps {
  cityFilter?: string | null;
  filterOptions?: FilterOptions;
}

const EmptyDealsMessage = ({ cityFilter, filterOptions }: EmptyDealsMessageProps) => {
  const hasFilters = cityFilter || (filterOptions && (filterOptions.categories.length > 0 || filterOptions.priceRange));
  
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground">No deals found matching your criteria</p>
      {hasFilters && (
        <Button 
          variant="link" 
          onClick={() => window.history.back()}
          className="mt-2"
        >
          Go back
        </Button>
      )}
    </div>
  );
};

export default EmptyDealsMessage;
