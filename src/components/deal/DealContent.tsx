
import React from "react";
import { Badge } from "@/components/ui/badge";

interface DealContentProps {
  description: string;
  tags: string[];
}

const DealContent = ({ description, tags }: DealContentProps) => {
  return (
    <div>
      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
        {description}
      </p>
      
      <div className="flex flex-wrap gap-1 mt-2">
        {tags.map(tag => (
          <Badge key={tag} variant="outline" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default DealContent;
