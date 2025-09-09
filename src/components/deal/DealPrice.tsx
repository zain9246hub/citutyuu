
import React from "react";
import { formatDistanceToNow } from "date-fns";

interface DealPriceProps {
  discountedPrice: number;
  originalPrice: number;
  expiryDate?: string;
  usageCount: number;
}

const DealPrice = ({
  discountedPrice,
  originalPrice,
  expiryDate,
  usageCount
}: DealPriceProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">₹{discountedPrice}</span>
          <span className="text-sm text-muted-foreground line-through">₹{originalPrice}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {expiryDate && (
            <p className="text-xs text-muted-foreground mt-1">
              Expires {formatDistanceToNow(new Date(expiryDate), { addSuffix: true })}
            </p>
          )}
          <span className="text-xs text-muted-foreground mt-1">
            • {usageCount} uses
          </span>
        </div>
      </div>
    </div>
  );
};

export default DealPrice;
