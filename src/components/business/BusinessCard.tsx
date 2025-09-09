import React from "react";
import { MapPin, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import StarRating from "@/components/ui/star-rating";

interface BusinessCardProps {
  business: {
    id: string;
    name: string;
    category: string;
    rating: number;
    priceRange: string;
    location: string;
    distance: string;
    image: string;
    isNew: boolean;
    offers: boolean;
    categories: string[];
  };
  onClick: (id: string) => void;
}

const BusinessCard = ({ business, onClick }: BusinessCardProps) => {
  const handleAddressClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    window.open(`https://maps.google.com?q=${business.location}`, '_blank');
  };

  return (
    <div 
      className="border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer interactive-hover bg-card"
      onClick={() => onClick(business.id)}
    >
      <div className="relative h-48">
        <img 
          src={business.image} 
          alt={business.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-background/90 text-foreground hover:bg-background/70 border border-border">
            <StarRating rating={business.rating} size="sm" />
          </Badge>
        </div>
        {business.isNew && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-primary text-primary-foreground">
              New
            </Badge>
          </div>
        )}
        {business.offers && (
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-destructive text-destructive-foreground">
              Offers Available
            </Badge>
          </div>
        )}
      </div>
      
      <div className="p-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg text-foreground">{business.name}</h3>
            <p className="text-muted-foreground text-sm">{business.category} • {business.priceRange}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </div>
        
        <div className="flex items-center mt-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span 
            className="flex-1 cursor-pointer hover:text-primary hover:underline transition-colors" 
            onClick={handleAddressClick}
          >
            {business.location} ({business.distance})
          </span>
        </div>
        
        <div className="mt-2 flex flex-wrap gap-1">
          {business.categories.map((category, index) => (
             <span 
               key={index} 
               className="inline-block bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded"
             >
               {category}
             </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
