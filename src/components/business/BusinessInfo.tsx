
import React from "react";
import { MapPin, Clock, Phone, Award, ExternalLink, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import StarRating from "@/components/ui/star-rating";
import { Business, getBusinessStatus } from "@/data/businessData";

interface BusinessInfoProps {
  business: Business;
  handleAddressClick: () => void;
  handlePhoneClick: () => void;
}

const BusinessInfo = ({ 
  business,
  handleAddressClick, 
  handlePhoneClick 
}: BusinessInfoProps) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied",
        description: message,
      });
    });
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "Open Now":
        return "bg-green-50 text-green-700 border-green-200";
      case "Closed":
        return "bg-red-50 text-red-700 border-red-200";
      case "Closed Today":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const status = getBusinessStatus(business.hours);

  return (
    <div className="p-4 space-y-4">
      {/* Header with business name and status */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-foreground">{business.name}</h1>
          <p className="text-muted-foreground mt-1">{business.category}</p>
          
          {/* Rating */}
          <div className="mt-2">
            <StarRating 
              rating={business.rating} 
              size="md" 
              showNumber={true}
              showCount={true}
              reviewCount={business.reviewCount}
              variant="default"
            />
          </div>
        </div>
        
        <Badge className={getStatusBadgeStyle(status)} variant="outline">
          {status}
        </Badge>
      </div>

      {/* Description */}
      <div className="bg-muted/30 p-3 rounded-lg">
        <p className="text-sm text-foreground leading-relaxed">{business.description}</p>
      </div>

      {/* Address */}
      <div 
        className="flex items-start gap-2 text-sm text-muted-foreground group cursor-pointer hover:text-primary transition-colors"
        onClick={handleAddressClick}
      >
        <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
        <div className="flex-1">
          <span className="hover:text-primary transition-colors">
            {business.location}
          </span>
          <ExternalLink className="h-3 w-3 ml-1 inline text-primary" />
        </div>
        <button 
          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            copyToClipboard(business.location, "Address copied to clipboard");
          }}
        >
          Copy
        </button>
      </div>

      {/* Operating Hours */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4 text-primary flex-shrink-0" />
        <span>
          {business.hours.find(h => h.day === new Date().toLocaleDateString('en-US', { weekday: 'long' }))?.open} - {business.hours.find(h => h.day === new Date().toLocaleDateString('en-US', { weekday: 'long' }))?.close}
        </span>
      </div>

      {/* Phone */}
      <div 
        className="flex items-center gap-2 text-sm text-muted-foreground group cursor-pointer hover:text-primary transition-colors"
        onClick={handlePhoneClick}
      >
        <Phone className="h-4 w-4 text-primary flex-shrink-0" />
        <span className="hover:text-primary transition-colors">
          {business.phone}
        </span>
        <ExternalLink className="h-3 w-3 text-primary" />
        <button 
          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
          onClick={(e) => {
            e.stopPropagation();
            copyToClipboard(business.phone, "Phone number copied to clipboard");
          }}
        >
          Copy
        </button>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {business.categories.map((category, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {category}
          </Badge>
        ))}
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 gap-2">
        {business.features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      {/* Special badges */}
      <div className="flex items-center gap-2">
        {business.isNew && (
          <Badge className="bg-blue-50 text-blue-700 border-blue-200" variant="outline">
            <span className="text-xs">New</span>
          </Badge>
        )}
        {business.offers && (
          <Badge className="bg-orange-50 text-orange-700 border-orange-200" variant="outline">
            <span className="text-xs">Special Offers</span>
          </Badge>
        )}
        {business.rating >= 4.5 && (
          <div className="flex items-center gap-1">
            <Award className="h-4 w-4 text-yellow-600" />
            <span className="text-xs font-medium text-yellow-700">Top Rated</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessInfo;
