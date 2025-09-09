
import React from "react";
import { Star } from "lucide-react";

interface DealHeaderProps {
  title: string;
  rating: number;
}

const DealHeader = ({ title, rating }: DealHeaderProps) => {
  return (
    <div className="flex justify-between items-start">
      <h3 className="font-semibold text-lg">{title}</h3>
      <div className="flex items-center bg-primary/10 text-primary rounded px-2 py-1">
        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
        <span className="text-xs font-medium">{rating}</span>
      </div>
    </div>
  );
};

export default DealHeader;
