import React, { useMemo, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATES_WITH_ALL, getCitiesForState, CITIES_WITH_ALL } from "@/utils/indiaGeo";

interface CitySelectionFilterProps {
  selectedCity: string | null;
  onCityChange: (city: string | null) => void;
}

const CitySelectionFilter = ({ selectedCity, onCityChange }: CitySelectionFilterProps) => {
  const [selectedState, setSelectedState] = useState<string>("All States");

  const cities = useMemo(() => {
    const base =
      selectedState === "All States"
        ? CITIES_WITH_ALL
        : (["All Cities", ...getCitiesForState(selectedState)] as readonly string[]);
    return base.map((city) => ({ label: city, value: city === "All Cities" ? null : city }));
  }, [selectedState]);

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2">Choose State & City</h3>

      <div className="mb-3">
        <Label className="text-xs mb-1 block">State</Label>
        <Select
          value={selectedState}
          onValueChange={(state) => {
            setSelectedState(state);
            onCityChange(null); // reset city when state changes
          }}
        >
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Select state" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] z-50 bg-popover">
            {STATES_WITH_ALL.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Label className="text-xs mb-1 block">City</Label>
      <RadioGroup value={selectedCity || ""} onValueChange={(value) => onCityChange(value === "" ? null : value)}>
        <div className="space-y-2">
          {cities.map((city) => (
            <div key={city.label} className="flex items-center space-x-2">
              <RadioGroupItem value={city.value || ""} id={`city-${city.label}`} />
              <Label htmlFor={`city-${city.label}`} className="cursor-pointer">
                {city.label}
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export default CitySelectionFilter;
