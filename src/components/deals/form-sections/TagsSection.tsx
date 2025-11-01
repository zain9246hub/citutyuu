import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface TagsSectionProps {
  tags: string[];
  tagInput: string;
  setTagInput: (value: string) => void;
  handleTagInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  addTag: () => void;
  removeTag: (tag: string) => void;
}

const TagsSection = ({
  tags,
  tagInput,
  setTagInput,
  handleTagInputKeyDown,
  addTag,
  removeTag
}: TagsSectionProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Tags</h2>
      
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
    </div>
  );
};

export default TagsSection;
