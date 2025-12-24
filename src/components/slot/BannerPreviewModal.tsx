
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BannerPreviewModalProps } from "@/types/slot";
import { MapPin, Building } from "lucide-react";

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
      <DialogContent className="w-[calc(100%-2rem)] max-w-lg mx-auto">
        <DialogHeader>
          <DialogTitle>
            {isExplorer ? "What would you like to do?" : "Banner Preview"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Preview of the selected banner advertisement
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Enhanced Banner Preview - Clean without text overlays */}
          <div
            className="relative rounded-lg overflow-hidden cursor-default"
            onClick={() => {
              if (isExplorer && banner.isBooked && onViewFullBanner) {
                onViewFullBanner();
              }
            }}
          >
            {banner.imageUrl || banner.imageUrls?.[0] ? (
              <img 
                src={banner.imageUrl || banner.imageUrls?.[0]} 
                alt={banner.adContent}
                className="w-full h-64 object-cover"
              />
            ) : banner.demoVideoUrl ? (
              <video
                src={banner.demoVideoUrl}
                className="w-full h-64 object-cover"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <div className={`${banner.backgroundColor} h-64`} />
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
                    console.log('[BannerPreviewModal] Visit business clicked for banner:', banner.id);
                    onOpenChange(false); // Close preview modal first
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
          ) : (showBookButton && onBook && !banner.isBooked) ? (
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
              Book This Banner
            </Button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BannerPreviewModal;
