
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PriceRangeFilterProps {
  priceRanges: { label: string; value: string | null }[];
  selectedRange: string | null;
  onPriceRangeChange: (value: string) => void;
}

const PriceRangeFilter = ({ 
  priceRanges, 
  selectedRange, 
  onPriceRangeChange 
}: PriceRangeFilterProps) => {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2">Price Range</h3>
      <RadioGroup 
        value={selectedRange || ""}
        onValueChange={onPriceRangeChange}
        className="space-y-2"
      >
        {priceRanges.map((option) => (
          <div key={option.value || "all"} className="flex items-center space-x-2">
            <RadioGroupItem 
              value={option.value || "all"} 
              id={`price-${option.value || "all"}`} 
            />
            <label 
              htmlFor={`price-${option.value || "all"}`}
              className="text-sm cursor-pointer"
            >
              {option.label}
            </label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default PriceRangeFilter;
