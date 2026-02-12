
import React from "react";
import { ArrowLeft, Bookmark, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import SubscribeBell from "@/components/business/SubscribeBell";

interface RestaurantHeaderProps {
  handleSaveRestaurant: () => void;
  handleShareRestaurant: () => void;
  restaurantId?: string;
  restaurantName?: string;
}

const RestaurantHeader = ({ 
  handleSaveRestaurant, 
  handleShareRestaurant,
  restaurantId,
  restaurantName,
}: RestaurantHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="fixed top-0 left-0 right-0 bg-white z-10 shadow-sm">
      <div className="flex items-center p-4 max-w-md mx-auto">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold flex-1 text-center">Restaurant Details</h1>
        <div className="flex items-center space-x-1">
          {restaurantId && restaurantName && (
            <SubscribeBell listingId={restaurantId} listingName={restaurantName} listingType="restaurant" />
          )}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleSaveRestaurant}
          >
            <Bookmark className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleShareRestaurant}
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantHeader;
