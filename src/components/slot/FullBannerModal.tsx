import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SlotBanner } from "@/types/slot";
import { MapPin, Phone, Mail, Globe } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

interface FullBannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner: SlotBanner | null;
}

const FullBannerModal: React.FC<FullBannerModalProps> = ({
  open,
  onOpenChange,
  banner,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  
  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrentImageIndex(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [open]);
  
  if (!banner) return null;

  const images = banner.imageUrls || (banner.imageUrl ? [banner.imageUrl] : []);

  const handleContactAction = (action: string, value?: string) => {
    try {
      console.log('[FullBannerModal] Contact action:', action, 'for banner:', banner?.id);
      
      if (!banner) {
        console.error('[FullBannerModal] No banner data available');
        return;
      }
      
      switch (action) {
        case 'phone':
          if (value) {
            window.location.href = `tel:${value}`;
          } else {
            console.warn('[FullBannerModal] No phone number provided');
          }
          break;
        case 'email':
          if (value) {
            window.location.href = `mailto:${value}`;
          } else {
            console.warn('[FullBannerModal] No email provided');
          }
          break;
        case 'website':
          if (banner.websiteUrl) {
            window.open(banner.websiteUrl, '_blank', 'noopener,noreferrer');
          } else if (banner.targetUrl) {
            window.open(banner.targetUrl, '_blank', 'noopener,noreferrer');
          } else {
            console.warn('[FullBannerModal] No website URL available');
          }
          break;
        case 'location':
          if (banner.locationUrl) {
            // Use the specific location URL if available (e.g., Google Maps link)
            window.open(banner.locationUrl, '_blank', 'noopener,noreferrer');
          } else if (banner.location) {
            // Fallback to generic Google Maps search
            const mapsUrl = `https://maps.google.com?q=${encodeURIComponent(banner.location)}`;
            window.open(mapsUrl, '_blank', 'noopener,noreferrer');
          } else {
            console.warn('[FullBannerModal] No location available');
          }
          break;
        default:
          console.warn('[FullBannerModal] Unknown contact action:', action);
      }
    } catch (error) {
      console.error('[FullBannerModal] Error handling contact action:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Full Banner View</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Full Size Banner with Carousel - Clean without text overlays */}
          <div className="relative rounded-lg overflow-hidden">
            {images.length > 0 ? (
              images.length === 1 ? (
                <img 
                  src={images[0]} 
                  alt={banner.adContent}
                  className="w-full h-96 object-cover"
                />
              ) : (
                <div className="relative">
                  <Carousel setApi={setApi} className="w-full">
                    <CarouselContent className="-ml-0">
                      {images.map((imageUrl, index) => (
                        <CarouselItem key={index} className="pl-0">
                          <img 
                            src={imageUrl} 
                            alt={`Banner image ${index + 1}`}
                            className="w-full h-96 object-cover"
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2 bg-background/80 hover:bg-background" />
                    <CarouselNext className="right-2 bg-background/80 hover:bg-background" />
                  </Carousel>
                  {/* Image counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 px-3 py-1 rounded-full text-xs">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </div>
              )
            ) : banner.demoVideoUrl ? (
              <video
                src={banner.demoVideoUrl}
                className="w-full h-96 object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <div className={`${banner.backgroundColor} h-96`} />
            )}
          </div>

          {/* Banner Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                Banner Details
              </h3>
              <div className="space-y-1">
                <p className="text-sm">Position #{banner.position}</p>
                <p className="text-sm flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {banner.location}
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  ID: {banner.id}
                </p>
              </div>
            </div>
            
            {banner.businessName && (
              <div className="space-y-2">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                  Business Info
                </h3>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{banner.businessName}</p>
                  {banner.price && (
                    <p className="text-sm text-muted-foreground">
                      Starting from ₹{banner.price}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleContactAction('location')}
                className="flex items-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                View Location
              </Button>
              
              {(banner.websiteUrl || banner.targetUrl) && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleContactAction('website')}
                  className="flex items-center gap-2"
                >
                  <Globe className="h-4 w-4" />
                  Visit Website
                </Button>
              )}
              
              {banner.phoneNumber && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleContactAction('phone', banner.phoneNumber)}
                  className="flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Call Now
                </Button>
              )}
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleContactAction('email', 'info@business.com')}
                className="flex items-center gap-2"
                disabled={!banner.isUploadedAd}
                title={!banner.isUploadedAd ? "Email contact not available for demo ads" : "Send Email"}
              >
                <Mail className="h-4 w-4" />
                Send Email
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FullBannerModal;