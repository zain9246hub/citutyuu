
import React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: "xs" | "sm" | "md" | "lg";
  showNumber?: boolean;
  showCount?: boolean;
  reviewCount?: number;
  className?: string;
  variant?: "default" | "compact";
}

const StarRating = ({ 
  rating, 
  maxStars = 5, 
  size = "md", 
  showNumber = true, 
  showCount = false, 
  reviewCount, 
  className,
  variant = "default"
}: StarRatingProps) => {
  const getSizeClasses = () => {
    switch (size) {
      case "xs": return "h-2.5 w-2.5";
      case "sm": return "h-3 w-3";
      case "md": return "h-4 w-4";
      case "lg": return "h-5 w-5";
      default: return "h-4 w-4";
    }
  };

  const getTextSize = () => {
    switch (size) {
      case "xs": return "text-xs";
      case "sm": return "text-xs";
      case "md": return "text-sm";
      case "lg": return "text-base";
      default: return "text-sm";
    }
  };

  const starSize = getSizeClasses();
  const textSize = getTextSize();

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < maxStars; i++) {
      if (i < fullStars) {
        // Full star
        stars.push(
          <Star 
            key={i}
            className={cn(
              starSize,
              "fill-yellow-400 text-yellow-400"
            )} 
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        // Half star
        stars.push(
          <div key={i} className="relative">
            <Star 
              className={cn(
                starSize,
                "text-muted-foreground"
              )} 
            />
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${(rating % 1) * 100}%` }}>
              <Star 
                className={cn(
                  starSize,
                  "fill-yellow-400 text-yellow-400"
                )} 
              />
            </div>
          </div>
        );
      } else {
        // Empty star
        stars.push(
          <Star 
            key={i}
            className={cn(
              starSize,
              "text-muted-foreground"
            )} 
          />
        );
      }
    }
    return stars;
  };

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        <Star className={cn(starSize, "fill-yellow-400 text-yellow-400")} />
        <span className={cn("font-medium", textSize)}>{rating}</span>
        {showCount && reviewCount && (
          <span className={cn("text-muted-foreground", textSize)}>
            ({reviewCount})
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {showNumber && (
        <span className={cn("font-medium mr-1", textSize)}>
          {rating}
        </span>
      )}
      <div className="flex items-center">
        {renderStars()}
      </div>
      {showCount && reviewCount && (
        <span className={cn("text-muted-foreground ml-1", textSize)}>
          ({reviewCount} reviews)
        </span>
      )}
    </div>
  );
};

export default StarRating;
