
import React from "react";
import { MapPin, Clock, Phone, Award, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface RestaurantInfoProps {
  handleAddressClick: () => void;
  handlePhoneClick: () => void;
}

const RestaurantInfo = ({ 
  handleAddressClick, 
  handlePhoneClick 
}: RestaurantInfoProps) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied",
        description: message,
      });
    });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold">Café Milano</h1>
          <p className="text-gray-600 mt-1">Fine Italian Dining</p>
        </div>
        <Badge className="bg-green-50 text-green-700 border-green-200">
          Open Now
        </Badge>
      </div>

      <div 
        className="flex items-center mt-3 text-sm text-gray-600 group cursor-pointer border-b border-dashed border-transparent hover:border-blue-300"
        onClick={handleAddressClick}
      >
        <MapPin className="h-4 w-4 mr-1 text-blue-500" />
        <span className="hover:text-blue-500 transition-colors flex items-center">
          123 Luxury Lane, Bandra West, Mumbai
          <ExternalLink className="h-3 w-3 ml-1 inline text-blue-500" />
        </span>
        <span 
          className="ml-2 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded group-hover:visible invisible"
          onClick={(e) => {
            e.stopPropagation();
            copyToClipboard("123 Luxury Lane, Bandra West, Mumbai", "Address copied to clipboard");
          }}
        >
          Copy
        </span>
      </div>

      <div className="flex items-center mt-2 text-sm text-gray-600">
        <Clock className="h-4 w-4 mr-1" />
        <span>12:00 PM - 11:30 PM (Mon-Sun)</span>
      </div>

      <div 
        className="flex items-center mt-2 text-sm text-gray-600 group cursor-pointer border-b border-dashed border-transparent hover:border-blue-300"
        onClick={handlePhoneClick}
      >
        <Phone className="h-4 w-4 mr-1 text-blue-500" />
        <span className="hover:text-blue-500 transition-colors flex items-center">
          +91 98765 43210
          <ExternalLink className="h-3 w-3 ml-1 inline text-blue-500" />
        </span>
        <span 
          className="ml-2 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded group-hover:visible invisible"
          onClick={(e) => {
            e.stopPropagation();
            copyToClipboard("+91 98765 43210", "Phone number copied to clipboard");
          }}
        >
          Copy
        </span>
      </div>

      <div className="flex items-center mt-3 space-x-2">
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Italian</Badge>
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Fine Dining</Badge>
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Wine Bar</Badge>
      </div>

      <div className="mt-4 flex items-center">
        <Award className="h-5 w-5 text-yellow-600 mr-2" />
        <span className="text-sm font-medium">Michelin Star Restaurant</span>
      </div>
    </div>
  );
};

export default RestaurantInfo;
