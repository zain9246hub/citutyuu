
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface SortByFilterProps {
  sortOptions: { label: string; value: string }[];
  selectedSort: string;
  onSortChange: (value: string) => void;
}

const SortByFilter = ({ 
  sortOptions, 
  selectedSort, 
  onSortChange 
}: SortByFilterProps) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Sort By</h3>
      <RadioGroup 
        value={selectedSort}
        onValueChange={onSortChange}
        className="space-y-2"
      >
        {sortOptions.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem 
              value={option.value} 
              id={`sort-${option.value}`} 
            />
            <label 
              htmlFor={`sort-${option.value}`}
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

export default SortByFilter;
