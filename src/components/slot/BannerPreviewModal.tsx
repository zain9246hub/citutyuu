
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BannerPreviewModalProps } from "@/types/slot";
import { ArrowRight, MapPin, Eye, Building } from "lucide-react";

const BannerPreviewModal: React.FC<BannerPreviewModalProps> = ({
  open,
  onOpenChange,
  banner,
  timeRemaining,
  onBook,
  showBookButton = false,
  onViewFullBanner,
  onVisitBusiness,
  isExplorer = false,
}) => {
  if (!banner) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isExplorer ? "What would you like to do?" : "Banner Preview"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Enhanced Banner Preview */}
          <div className="relative rounded-lg overflow-hidden">
            {banner.imageUrl ? (
              <div className="relative">
                <img 
                  src={banner.imageUrl} 
                  alt={banner.adContent}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="text-xl font-bold mb-1">{banner.adContent}</h3>
                  {banner.description && (
                    <p className="text-sm text-white/90 mb-2">{banner.description}</p>
                  )}
                  {banner.businessName && (
                    <p className="text-xs text-white/80 uppercase tracking-wider">
                      {banner.businessName}
                    </p>
                  )}
                </div>
              </div>
            ) : banner.demoVideoUrl ? (
              <div className="relative h-64">
                <video
                  src={banner.demoVideoUrl}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="text-white p-4 text-center">
                    <h3 className="text-xl font-bold">{banner.adContent}</h3>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`${banner.backgroundColor} h-64 flex items-center justify-center p-6`}>
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">{banner.adContent}</h3>
                  {banner.description && (
                    <p className="text-sm text-muted-foreground mb-2">{banner.description}</p>
                  )}
                  {banner.businessName && (
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      {banner.businessName}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Banner Info */}
          <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
            <div className="text-sm">
              <div className="font-semibold">Position #{banner.position}</div>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-3 w-3 mr-1" />
                {banner.location}
              </div>
            </div>
            <div className="text-sm text-right">
              <div className="text-muted-foreground">Banner ID</div>
              <div className="font-mono text-xs">{banner.id.slice(-6)}</div>
            </div>
          </div>

          {/* Enhanced Action Buttons */}
          {isExplorer && banner.isBooked ? (
            <div className="grid grid-cols-1 gap-3">
              <Button 
                onClick={() => {
                  try {
                    console.log('[BannerPreviewModal] View full banner clicked');
                    onViewFullBanner?.();
                  } catch (error) {
                    console.error('[BannerPreviewModal] Error viewing full banner:', error);
                  }
                }} 
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <Eye className="h-4 w-4" />
                View Full Banner
              </Button>
              <Button 
                onClick={() => {
                  try {
                    console.log('[BannerPreviewModal] Visit business clicked for banner:', banner.id);
                    onVisitBusiness?.();
                  } catch (error) {
                    console.error('[BannerPreviewModal] Error visiting business:', error);
                  }
                }} 
                className="w-full flex items-center justify-center gap-2"
              >
                <Building className="h-4 w-4" />
                Visit Business Profile
              </Button>
            </div>
          ) : showBookButton && onBook ? (
            <Button 
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                try {
                  console.log('[BannerPreviewModal] Book button clicked for banner:', banner.id);
                  onBook?.(e as React.MouseEvent);
                } catch (error) {
                  console.error('[BannerPreviewModal] Error in book handler:', error);
                }
              }}
              className="w-full flex items-center justify-center gap-2"
            >
              Book This Banner <ArrowRight className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BannerPreviewModal;
