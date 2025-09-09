
import { Checkbox } from "@/components/ui/checkbox";
import { FilterOptions } from "@/types/deal";

interface CategoryFilterProps {
  categories: { label: string; value: string }[];
  selectedCategories: string[];
  onCategoryChange: (category: string, checked: boolean) => void;
}

const CategoryFilter = ({ 
  categories, 
  selectedCategories, 
  onCategoryChange 
}: CategoryFilterProps) => {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2">Categories</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category.value} className="flex items-center space-x-2">
            <Checkbox 
              id={`category-${category.value}`}
              checked={selectedCategories.includes(category.value)}
              onCheckedChange={(checked) => 
                onCategoryChange(category.value, checked as boolean)
              }
            />
            <label 
              htmlFor={`category-${category.value}`}
              className="text-sm cursor-pointer"
            >
              {category.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
