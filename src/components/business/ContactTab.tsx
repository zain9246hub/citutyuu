
import React from "react";
import { MapPin, Phone, Mail, Globe, Clock, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { buildOSMEmbedUrl, buildOSMDirectionsUrl, buildGoogleMapsDirectionsUrl } from "@/utils/mapUtils";
import { buildWhatsappUrl, buildSmsUrl } from "@/utils/phoneUtils";

interface ContactTabProps {
  handlePhoneClick: () => void;
  handleAddressClick: () => void;
  coordinates?: { lat: number; lng: number };
  address?: string;
}

const ContactTab = ({ handlePhoneClick, handleAddressClick, coordinates, address }: ContactTabProps) => {
  const mapUrl = coordinates ? buildOSMEmbedUrl(coordinates.lat, coordinates.lng) : null;
  const osmDirectionsUrl = address ? buildOSMDirectionsUrl(address) : null;
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
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-3">Send us a message</h3>
        
        <form className="space-y-3">
          <div>
            <Input placeholder="Your name" />
          </div>
          <div>
            <Input placeholder="Your email" type="email" />
          </div>
          <div>
            <Textarea placeholder="Your message" rows={4} />
          </div>
          <Button className="w-full">Send Message</Button>
        </form>
      </div>
      
      <div>
        <h3 className="font-medium mb-3">Schedule a meeting</h3>
        <Button className="w-full flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          Book an Appointment
        </Button>
      </div>
      
      {mapUrl && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Location</h3>
            <div className="flex gap-2">
              {osmDirectionsUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(osmDirectionsUrl, '_blank')}
                  className="text-xs"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  OSM
                </Button>
              )}
              {googleDirectionsUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(googleDirectionsUrl, '_blank')}
                  className="text-xs"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Google Maps
                </Button>
              )}
            </div>
          </div>
          <div className="aspect-[16/9]">
            <iframe 
              src={mapUrl}
              className="w-full h-full rounded-lg border"
              style={{ border: 0 }}
              allowFullScreen={true} 
              loading="lazy"
              title="Business Location Map"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactTab;
