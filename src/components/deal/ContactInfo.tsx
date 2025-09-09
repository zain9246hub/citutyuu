
import React from "react";
import { MapPin, Phone, ExternalLink } from "lucide-react";

interface ContactInfoProps {
  location: string;
  city: string;
  phone?: string;
  onAddressClick: (e: React.MouseEvent) => void;
  onPhoneClick: (e: React.MouseEvent) => void;
  onCopyAddress: (e: React.MouseEvent) => void;
  onCopyPhone: (e: React.MouseEvent) => void;
}

const ContactInfo = ({
  location,
  city,
  phone,
  onAddressClick,
  onPhoneClick,
  onCopyAddress,
  onCopyPhone
}: ContactInfoProps) => {
  return (
    <>
      <div 
        className="flex items-center text-xs text-muted-foreground mt-1 group cursor-pointer border-b border-dashed border-transparent hover:border-blue-300"
        onClick={onAddressClick}
      >
        <MapPin className="h-3 w-3 mr-1 text-blue-500" /> 
        <span className="hover:text-blue-500 transition-colors flex items-center">
          {location}, {city}
          <ExternalLink className="h-3 w-3 ml-1 inline text-blue-500" />
        </span>
        <span 
          className="ml-2 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded group-hover:visible invisible"
          onClick={onCopyAddress}
        >
          Copy
        </span>
      </div>

      {phone && (
        <div 
          className="flex items-center text-xs text-muted-foreground mb-2 group cursor-pointer border-b border-dashed border-transparent hover:border-blue-300"
          onClick={onPhoneClick}
        >
          <Phone className="h-3 w-3 mr-1 text-blue-500" /> 
          <span className="hover:text-blue-500 transition-colors flex items-center">
            {phone}
            <ExternalLink className="h-3 w-3 ml-1 inline text-blue-500" />
          </span>
          <span 
            className="ml-2 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded group-hover:visible invisible"
            onClick={onCopyPhone}
          >
            Copy
          </span>
        </div>
      )}
    </>
  );
};

export default ContactInfo;
