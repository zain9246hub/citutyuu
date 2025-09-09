
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle } from "lucide-react";

interface TagsFeaturesProps {
  tags: string[];
  tagInput: string;
  isFeatured: boolean;
  calculatePrice: () => number;
  setTagInput: (value: string) => void;
  handleTagInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  addTag: () => void;
  removeTag: (tag: string) => void;
  onFeaturedChange: (checked: boolean) => void;
}

const TagsFeatures = ({
  tags,
  tagInput,
  isFeatured,
  calculatePrice,
  setTagInput,
  handleTagInputKeyDown,
  addTag,
  removeTag,
  onFeaturedChange
}: TagsFeaturesProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Tags & Features</h2>
      
      <div className="space-y-2">
        <Label htmlFor="tags">Tags (helps with discovery)</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="tagInput"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            placeholder="Add a tag and press Enter"
            className="flex-1"
          />
          <Button 
            type="button" 
            onClick={addTag} 
            variant="outline"
          >
            Add
          </Button>
        </div>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <div 
                key={tag}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center"
              >
                {tag}
                <button 
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-blue-800 hover:text-blue-900"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="space-y-2 pt-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isFeatured"
            checked={isFeatured}
            onCheckedChange={(checked) => onFeaturedChange(checked as boolean)}
          />
          <label htmlFor="isFeatured" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Featured Deal (additional cost)
          </label>
        </div>
        <p className="text-xs text-gray-500 ml-6">
          Featured deals appear at the top of listings and get more visibility
        </p>
        
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
    </div>
  );
};

export default TagsFeatures;
