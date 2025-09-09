
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categoryOptions } from "@/components/filters/FilterOptions";

interface DealInformationProps {
  title: string;
  description: string;
  category: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

const DealInformation = ({
  title,
  description,
  category,
  onInputChange,
  onSelectChange
}: DealInformationProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Deal Information</h2>
      
      <div className="space-y-2">
        <Label htmlFor="title">Deal Title <span className="text-red-500">*</span></Label>
        <Input
          id="title"
          name="title"
          value={title}
          onChange={onInputChange}
          placeholder="Enter a catchy title for your deal"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
        <Select
          value={category}
          onValueChange={(value) => onSelectChange("category", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
        <Textarea
          id="description"
          name="description"
          value={description}
          onChange={onInputChange}
          placeholder="Describe your deal in detail..."
          rows={4}
          required
        />
      </div>
    </div>
  );
};

export default DealInformation;
