
import React from "react";
import { FilterOptions } from "@/types/deal";
import SearchBar from "./SearchBar";
import FilterDialog from "@/components/FilterDialog";
import { Skeleton } from "@/components/ui/skeleton";

interface SearchSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onFilterToggle: () => void;
  filterOptions: FilterOptions;
  isLoading: boolean;
  dealCount?: number;
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
  onFilterChange: (filters: FilterOptions) => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({
  searchQuery,
  onSearchChange,
  onFilterToggle,
  filterOptions,
  isLoading,
  dealCount,
  filterOpen,
  setFilterOpen,
  onFilterChange
}) => {
  if (isLoading) {
    return (
      <div className="mt-8 px-4 space-y-4">
        <Skeleton className="h-12 w-full rounded-lg" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 px-4 animate-fade-in">
      <SearchBar 
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onFilterToggle={onFilterToggle}
        filterOptions={filterOptions}
        isLoading={isLoading}
        dealCount={dealCount}
      />
      
      <FilterDialog
        trigger={<div className="hidden">Filter</div>}
        onFilterChange={onFilterChange}
        currentFilters={filterOptions}
        open={filterOpen}
        onOpenChange={setFilterOpen}
      />
    </div>
  );
};

export default React.memo(SearchSection);
