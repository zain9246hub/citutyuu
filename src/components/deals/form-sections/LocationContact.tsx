
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface LocationContactProps {
  location: string;
  city: string;
  phone: string;
  expiryDate: Date | undefined;
  cities: string[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onExpiryDateChange: (date: Date | undefined) => void;
}

const LocationContact = ({
  location,
  city,
  phone,
  expiryDate,
  cities,
  onInputChange,
  onSelectChange,
  onExpiryDateChange
}: LocationContactProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Location & Contact</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location/Address</Label>
          <Input
            id="location"
            name="location"
            value={location}
            onChange={onInputChange}
            placeholder="Enter location or address"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
          <Select
            value={city}
            onValueChange={(value) => onSelectChange("city", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a city" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Contact Phone</Label>
          <Input
            id="phone"
            name="phone"
            value={phone}
            onChange={onInputChange}
            placeholder="+91 98765 43210"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Expiry Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !expiryDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {expiryDate ? format(expiryDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={expiryDate}
                onSelect={onExpiryDateChange}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default LocationContact;
