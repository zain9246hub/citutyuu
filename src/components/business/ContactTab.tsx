
import React from "react";
import { MapPin, Phone, Mail, Globe, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildGoogleMapsDirectionsUrl } from "@/utils/mapUtils";
import { buildWhatsappUrl, buildSmsUrl } from "@/utils/phoneUtils";

interface ContactTabProps {
  handlePhoneClick: () => void;
  handleAddressClick: () => void;
  address?: string;
}

const ContactTab = ({ handlePhoneClick, handleAddressClick, address }: ContactTabProps) => {
  const googleDirectionsUrl = address ? buildGoogleMapsDirectionsUrl(address) : null;
  return (
    <div className="py-2 space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Contact Information</h2>
        
        <div 
          className="flex items-center text-sm cursor-pointer hover:text-blue-600"
          onClick={handlePhoneClick}
        >
          <Phone className="h-4 w-4 mr-2 text-blue-600" />
          <span>+91 98765 43210</span>
        </div>
        
        <div className="flex gap-2 ml-6">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => window.open(buildWhatsappUrl("+91 98765 43210", "Hi, I found your business and would like to know more!"), '_blank')}
            className="h-7 text-xs"
          >
            WhatsApp
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => window.open(buildSmsUrl("+91 98765 43210", "Hi, I found your business and would like to know more!"), '_blank')}
            className="h-7 text-xs"
          >
            SMS
          </Button>
        </div>
        
        <div className="flex items-center text-sm">
          <Mail className="h-4 w-4 mr-2 text-blue-600" />
          <span>info@digitalsolutionsinc.com</span>
        </div>
        
        <div className="flex items-center text-sm">
          <Globe className="h-4 w-4 mr-2 text-blue-600" />
          <span>www.digitalsolutionsinc.com</span>
        </div>
        
        <div 
          className="flex items-start text-sm cursor-pointer hover:text-blue-600"
          onClick={handleAddressClick}
        >
          <MapPin className="h-4 w-4 mr-2 text-blue-600 mt-0.5" />
          <span>123 Business Park, Bandra West, Mumbai</span>
        </div>
        
        <div className="flex items-center text-sm">
          <Clock className="h-4 w-4 mr-2 text-blue-600" />
          <span>
            Monday - Friday: 09:00 AM - 06:00 PM<br />
            Saturday: 10:00 AM - 02:00 PM<br />
            Sunday: Closed
          </span>
        </div>
      </div>
      
      {googleDirectionsUrl && (
        <div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.open(googleDirectionsUrl, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Get Directions on Google Maps
          </Button>
        </div>
      )}
    </div>
  );
};

export default ContactTab;
