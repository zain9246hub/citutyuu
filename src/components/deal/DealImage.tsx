
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Heart, Share2, Sparkles } from "lucide-react";

interface DealImageProps {
  image: string;
  title: string;
  discount: number;
  featured?: boolean;
  saved?: boolean;
  isExplorer?: boolean;
  onToggleSave: (e: React.MouseEvent) => void;
  onShare?: (e: React.MouseEvent) => void;
  isLikeAnimating: boolean;
  isShareAnimating: boolean;
}

const DealImage = ({
  image,
  title,
  discount,
  featured,
  saved,
  isExplorer,
  onToggleSave,
  onShare,
  isLikeAnimating,
  isShareAnimating
}: DealImageProps) => {
  return (
    <div className="relative md:w-1/3">
      <img 
        src={image} 
        alt={title}
        className="w-full h-48 md:h-full object-cover"
        loading="lazy"
      />
      {featured && (
        <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs py-1 px-2 rounded-full flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          <span>Featured</span>
        </div>
      )}
      <div className="absolute top-2 right-2 flex gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "h-8 w-8 rounded-full bg-black/30 hover:bg-black/50 transition-all duration-300",
            saved ? "text-red-500" : "text-white",
            isLikeAnimating && "scale-125"
          )}
          onClick={onToggleSave}
          aria-label={saved ? "Remove from saved deals" : "Save deal"}
          aria-pressed={saved}
        >
          <Heart 
            className={cn(
              "h-4 w-4 transition-transform duration-300",
              isLikeAnimating && "animate-pulse"
            )} 
            fill={saved ? "currentColor" : "none"} 
          />
        </Button>
        
        {isExplorer && (
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "h-8 w-8 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all duration-300",
              isShareAnimating && "scale-125"
            )}
            onClick={onShare}
            aria-label="Share deal"
          >
            <Share2 
              className={cn(
                "h-4 w-4 transition-transform duration-300",
                isShareAnimating && "animate-pulse"
              )} 
            />
          </Button>
        )}
      </div>
      
      <div className="absolute bottom-2 left-2 bg-white/80 text-xs font-medium py-0.5 px-2 rounded-full">
        {discount}% OFF
      </div>
    </div>
  );
};

export default DealImage;
