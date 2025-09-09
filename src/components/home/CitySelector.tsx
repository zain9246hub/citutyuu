
import React, { useMemo } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CitySelectorProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
  cities: readonly string[];
}

const CitySelector: React.FC<CitySelectorProps> = ({
  selectedCity,
  onCityChange,
  cities,
}) => {
  // Memoize unique cities to prevent duplicate keys
  const uniqueCities = useMemo(() => {
    const seen = new Set();
    return cities.filter(city => {
      if (seen.has(city)) {
        console.warn(`Duplicate city found: ${city}`);
        return false;
      }
      seen.add(city);
      return true;
    });
  }, [cities]);

  return (
    <div className="px-4 py-3 bg-background backdrop-blur-sm border-b sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
        <Select value={selectedCity} onValueChange={(city) => {
          console.log('[CitySelector] City changed to:', city);
          onCityChange(city);
        }}>
          <SelectTrigger className="border-0 bg-transparent p-0 h-auto font-medium text-sm focus:ring-0 hover:text-primary transition-colors">
            <SelectValue placeholder="Select your city" />
            <ChevronDown className="h-3 w-3 opacity-50 ml-1" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] z-50 bg-popover">
            {uniqueCities.map((city) => (
              <SelectItem 
                key={`city-${city}`} 
                value={city}
                className="cursor-pointer"
              >
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default React.memo(CitySelector);
