
import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CuisineFilterProps {
  cuisines: string[];
  selectedCuisine: string | null;
  onCuisineSelect: (cuisine: string) => void;
}

const CuisineFilter = ({ cuisines, selectedCuisine, onCuisineSelect }: CuisineFilterProps) => {
  return (
    <div className="px-4 pb-3 max-w-md mx-auto">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2">
          {cuisines.map((cuisine) => (
            <Button
              key={cuisine}
              variant={selectedCuisine === cuisine ? "default" : "outline"}
              size="sm"
              className="rounded-full text-xs"
              onClick={() => onCuisineSelect(cuisine)}
            >
              {cuisine}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CuisineFilter;
