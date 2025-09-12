import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  STATES_WITH_ALL,
  CITIES_WITH_ALL,
  getCitiesForState,
} from "@/utils/indiaGeo";
import { Badge } from "@/components/ui/badge";
import { ComingSoonTag } from "@/components/ui/coming-soon-tag";
import { useLocationContext } from "@/contexts/LocationContext";
import { useCityContext } from "@/contexts/CityContext";

interface StateCitySelectorProps {
  // No props needed - using global context
}

const StateCitySelector: React.FC<StateCitySelectorProps> = () => {
  const { selectedState, setSelectedState, isLocationApproved, isCurrentLocationApproved } = useLocationContext();
  const { selectedCity, setSelectedCity } = useCityContext();
  
  const [selectedStateLocal, setSelectedStateLocal] = useState<string>(selectedState);

  const cityOptions = useMemo(() => {
    const list =
      selectedStateLocal === "All States"
        ? CITIES_WITH_ALL
        : (["All Cities", ...getCitiesForState(selectedStateLocal)] as readonly string[]);
    // Deduplicate just in case
    return Array.from(new Set(list));
  }, [selectedStateLocal]);

  // Ensure selectedCity remains valid when state changes
  useEffect(() => {
    if (!cityOptions.includes(selectedCity)) {
      setSelectedCity("All Cities");
    }
  }, [selectedStateLocal, cityOptions, selectedCity, setSelectedCity]);

  // Show warning for non-approved locations
  const showLocationWarning = !isCurrentLocationApproved();

  return (
    <div className="px-4 py-3 bg-background/95 backdrop-blur-sm border-b sticky top-0 z-40">
      {showLocationWarning && (
        <div className="mb-3 p-3 bg-green-50 border-l-4 border-green-400 rounded">
          <div className="flex items-center">
            <ComingSoonTag variant="compact" className="mr-2" />
            <p className="text-sm text-green-700">
              This location is coming soon! Fill our interest form to get notified when we launch.
            </p>
          </div>
        </div>
      )}
      <div className="flex items-center gap-3 flex-wrap">
        <MapPin className="h-4 w-4 text-primary flex-shrink-0" />

        {/* State Select */}
        <Select
          value={selectedStateLocal}
          onValueChange={(state) => {
            setSelectedStateLocal(state);
            setSelectedState(state);
          }}
        >
          <SelectTrigger className="border-0 bg-transparent p-0 h-auto font-medium text-sm focus:ring-0 hover:text-primary transition-colors min-w-[140px]">
            <SelectValue placeholder="Select state" />
            <ChevronDown className="h-3 w-3 opacity-50 ml-1" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] z-50 bg-popover">
            {STATES_WITH_ALL.map((state) => (
              <SelectItem key={`state-${state}`} value={state} className="cursor-pointer">
                <div className="flex items-center justify-between w-full">
                  <span>{state}</span>
                  {state !== "All States" && !isLocationApproved(state, 'state') && (
                    <ComingSoonTag variant="compact" className="ml-2" />
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* City Select */}
        <Select
          value={selectedCity}
          onValueChange={setSelectedCity}
        >
          <SelectTrigger className="border-0 bg-transparent p-0 h-auto font-medium text-sm focus:ring-0 hover:text-primary transition-colors min-w-[140px]">
            <SelectValue placeholder="Select your city" />
            <ChevronDown className="h-3 w-3 opacity-50 ml-1" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] z-50 bg-popover">
            {cityOptions.map((city) => (
              <SelectItem key={`city-${city}`} value={city} className="cursor-pointer">
                <div className="flex items-center justify-between w-full">
                  <span>{city}</span>
                  {city !== "All Cities" && !isLocationApproved(city, 'city') && (
                    <ComingSoonTag variant="compact" className="ml-2" />
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default React.memo(StateCitySelector);
