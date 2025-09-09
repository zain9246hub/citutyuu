
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertCircle } from "lucide-react";

interface DurationOption {
  days: number;
  label: string;
  baseCost: number;
  featuredCost: number;
}

interface DurationPromotionProps {
  duration: number;
  isFeatured: boolean;
  durationOptions: DurationOption[];
  onDurationChange: (duration: number) => void;
  calculatePrice: () => number;
}

const DurationPromotion = ({
  duration,
  isFeatured,
  durationOptions,
  onDurationChange,
  calculatePrice
}: DurationPromotionProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Deal Duration & Promotion</h2>
      
      <div className="space-y-2">
        <Label htmlFor="duration">Deal Duration</Label>
        <RadioGroup 
          value={duration.toString()} 
          onValueChange={(value) => onDurationChange(parseInt(value))}
          className="grid grid-cols-2 gap-3 pt-2"
        >
          {durationOptions.map((option) => (
            <div key={option.days}>
              <RadioGroupItem
                value={option.days.toString()}
                id={`duration-${option.days}`}
                className="peer sr-only"
              />
              <Label
                htmlFor={`duration-${option.days}`}
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <span className="font-semibold mb-1">{option.label}</span>
                <span className="text-xs text-muted-foreground">
                  ₹{option.baseCost} / {isFeatured && `+₹${option.featuredCost}`}
                </span>
              </Label>
            </div>
          ))}
        </RadioGroup>
        <p className="text-xs text-muted-foreground mt-2">
          Choose how long your deal should be displayed to customers
        </p>
      </div>
      
      <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800">Deal Posting Fee</h3>
            <p className="text-sm text-amber-700 mt-1">
              Based on your selections, your deal will cost ₹{calculatePrice()}.
              {isFeatured && " This includes the featured deal premium."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DurationPromotion;
