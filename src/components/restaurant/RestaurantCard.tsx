import React from "react";
import { MapPin, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import StarRating from "@/components/ui/star-rating";
import SubscribeBell from "@/components/business/SubscribeBell";

interface RestaurantCardProps {
  restaurant: {
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
    cuisines: string[];
  };
  onClick: (id: string) => void;
}

const RestaurantCard = ({ restaurant, onClick }: RestaurantCardProps) => {
  const handleAddressClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    window.open(`https://maps.google.com?q=${restaurant.location}`, '_blank');
  };

  return (
    <div 
      className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 cursor-pointer"
      onClick={() => onClick(restaurant.id)}
    >
      <div className="relative h-48">
        <img 
          src={restaurant.image} 
          alt={restaurant.name} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-white/90 text-black hover:bg-white/70 shadow-sm">
            <StarRating rating={restaurant.rating} size="sm" />
          </Badge>
        </div>
        {restaurant.isNew && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-blue-500 hover:bg-blue-600 text-white shadow-sm">
              New
            </Badge>
          </div>
        )}
        {restaurant.offers && (
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-red-500 hover:bg-red-600 text-white shadow-sm">
              Offers Available
            </Badge>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{restaurant.name}</h3>
            <p className="text-gray-600 text-sm">{restaurant.category} • {restaurant.priceRange}</p>
          </div>
          <div className="flex items-center gap-1">
            <SubscribeBell listingId={restaurant.id} listingName={restaurant.name} listingType="restaurant" size="sm" />
            <div className="bg-primary/5 rounded-full p-1">
              <ChevronRight className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
        
        <div className="flex items-center mt-3 text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0 text-gray-500" />
          <span 
            className="flex-1 cursor-pointer hover:text-primary hover:underline transition-colors" 
            onClick={handleAddressClick}
          >
            {restaurant.location} <span className="text-gray-500">({restaurant.distance})</span>
          </span>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-1">
          {restaurant.cuisines.map((cuisine, index) => (
            <span 
              key={index} 
              className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
            >
              {cuisine}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
