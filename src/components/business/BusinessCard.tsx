import React from "react";
import { MapPin, ChevronRight, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/ui/star-rating";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { isBusinessExpired, isBusinessOwner } from "@/utils/businessUtils";
import SubscribeBell from "./SubscribeBell";

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
    uploadedBy?: string;
    subscriptionEndDate?: string;
  };
  onClick: (id: string) => void;
}

const BusinessCard = ({ business, onClick }: BusinessCardProps) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const handleAddressClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    window.open(`https://maps.google.com?q=${business.location}`, '_blank');
  };

  // Check if this is an expired business owned by current user
  const isExpired = isBusinessExpired(business);
  const isOwner = isBusinessOwner(
    business, 
    currentUser?.id, 
    currentUser?.name, 
    currentUser?.email
  );
  const showExpiredBadge = isExpired && isOwner;

  return (
    <div 
      className="relative border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer interactive-hover bg-card"
      onClick={() => onClick(business.id)}
    >
      {/* Expired badge overlay for owner */}
      {showExpiredBadge && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
          <Badge variant="destructive" className="text-xs">
            Expired
          </Badge>
          <Button 
            variant="default"
            size="sm"
            className="text-xs h-7 px-2"
            onClick={(e) => {
              e.stopPropagation();
              navigate('/profile?tab=subscriptions');
            }}
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Renew
          </Button>
        </div>
      )}
      
      <div className="relative h-48">
        <img 
          src={business.image} 
          alt={business.name} 
          className="w-full h-full object-cover"
        />
        {!showExpiredBadge && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-background/90 text-foreground hover:bg-background/70 border border-border">
              <StarRating rating={business.rating} size="sm" />
            </Badge>
          </div>
        )}
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
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground">{business.name}</h3>
            <p className="text-muted-foreground text-sm">{business.category} • {business.priceRange}</p>
          </div>
          <div className="flex items-center gap-1">
            <SubscribeBell listingId={business.id} listingName={business.name} listingType="business" size="sm" />
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
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
