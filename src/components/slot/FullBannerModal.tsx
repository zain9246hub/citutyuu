import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SlotBanner } from "@/types/slot";
import { MapPin, ExternalLink, Phone, Mail, Globe } from "lucide-react";

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
  if (!banner) return null;

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
          if (banner.targetUrl) {
            window.open(banner.targetUrl, '_blank', 'noopener,noreferrer');
          } else {
            console.warn('[FullBannerModal] No website URL available');
          }
          break;
        case 'location':
          if (banner.location) {
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
          {/* Full Size Banner */}
          <div className="relative rounded-lg overflow-hidden">
            {banner.imageUrl ? (
              <div className="relative">
                <img 
                  src={banner.imageUrl} 
                  alt={banner.adContent}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h2 className="text-3xl font-bold mb-2">{banner.adContent}</h2>
                  {banner.description && (
                    <p className="text-lg text-white/90 mb-3">{banner.description}</p>
                  )}
                  {banner.businessName && (
                    <p className="text-sm text-white/80 uppercase tracking-wider font-medium">
                      {banner.businessName}
                    </p>
                  )}
                </div>
              </div>
            ) : banner.demoVideoUrl ? (
              <div className="relative h-96">
                <video
                  src={banner.demoVideoUrl}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-white p-6 text-center">
                    <h2 className="text-3xl font-bold mb-2">{banner.adContent}</h2>
                    {banner.description && (
                      <p className="text-lg text-white/90">{banner.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className={`${banner.backgroundColor} h-96 flex items-center justify-center p-8`}>
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-3">{banner.adContent}</h2>
                  {banner.description && (
                    <p className="text-lg text-muted-foreground mb-3">{banner.description}</p>
                  )}
                  {banner.businessName && (
                    <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
                      {banner.businessName}
                    </p>
                  )}
                </div>
              </div>
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
              
              {banner.targetUrl && (
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
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleContactAction('phone', '+91-98765-43210')}
                className="flex items-center gap-2"
              >
                <Phone className="h-4 w-4" />
                Call Now
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleContactAction('email', 'info@business.com')}
                className="flex items-center gap-2"
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