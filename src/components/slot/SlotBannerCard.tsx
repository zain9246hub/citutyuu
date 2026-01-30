import React, { memo, useState } from "react";
import { ChevronRight, Eye, Store, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SlotBannerCardProps } from "@/types/slot";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const SlotBannerCard = memo(({ 
  slide, 
  timeRemaining,
  onClick,
  onBook,
  showBookButton = false,
  onViewFull,
  onVisitBusiness
}: SlotBannerCardProps) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const isExplorer = currentUser?.role === 'explorer';
  const [isFlipped, setIsFlipped] = useState(false);
  
  const shouldShowBookButton = showBookButton && !isExplorer && !slide.isBooked;
  const shouldShowFlipOptions = isExplorer && slide.isBooked;
  
  // Check if this is owner's expired banner
  const isOwnerExpiredBanner = slide.isExpired && slide.isUploadedAd;

  const handleCardClick = () => {
    if (shouldShowFlipOptions) {
      setIsFlipped(!isFlipped);
    } else {
      onClick(slide);
    }
  };

  const handleViewFull = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('[SlotBannerCard] View Full clicked', slide);
    if (onViewFull) {
      onViewFull(slide);
    }
  };

  const handleVisitBusiness = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('[SlotBannerCard] Visit Business clicked', slide);
    if (onVisitBusiness) {
      onVisitBusiness(slide);
    }
  };
  
  return (
    <div 
      className={`flip-card rounded-xl ${shouldShowFlipOptions ? 'cursor-pointer' : ''} ${isFlipped ? 'flipped' : ''} select-none`}
      onClick={handleCardClick}
      onMouseEnter={() => shouldShowFlipOptions && setIsFlipped(true)}
      onMouseLeave={() => shouldShowFlipOptions && setIsFlipped(false)}
      style={{ 
        WebkitUserSelect: 'none', 
        userSelect: 'none',
        WebkitTouchCallout: 'none'
      }}
    >
      <div className={`flip-card-inner min-h-[180px] ${!slide.imageUrl ? slide.backgroundColor : ''}`}>
        {/* FRONT SIDE */}
        <div className="flip-card-front rounded-xl overflow-hidden bg-card border border-border/50 shadow-lg">
          <div className="relative h-[180px] overflow-hidden">
            {/* Background Image or Gradient */}
            {slide.imageUrl ? (
              <img 
                src={slide.imageUrl} 
                alt={slide.adContent}
                className="w-full h-full object-cover pointer-events-none"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
            ) : (
              <div className={`w-full h-full ${slide.backgroundColor || 'bg-gradient-to-br from-primary/30 to-primary/10'}`} />
            )}
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            
            {/* Position Badge - Top Left */}
            <div className="absolute top-3 left-3 bg-muted/90 dark:bg-background/80 backdrop-blur-sm text-foreground px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-wider">
              Position {slide.position}
            </div>
            
            {/* Featured Badge - Top Right */}
            {slide.isBooked && !slide.isExpired && (
              <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded text-xs font-medium">
                Featured
              </div>
            )}
            
            {/* Expired Badge - Top Right for owner */}
            {isOwnerExpiredBanner && (
              <Badge variant="destructive" className="absolute top-3 right-3 text-xs">
                Expired
              </Badge>
            )}
            
            {/* Content - Bottom Left */}
            <div className="absolute bottom-0 left-0 right-12 p-4">
              <h3 className="text-white text-base font-bold mb-1 leading-tight line-clamp-2">
                {slide.adContent}
              </h3>
              <p className="text-white/80 text-xs">
                {slide.location}
              </p>
            </div>
            
            {/* Arrow - Right Side */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <ChevronRight className="h-5 w-5 text-white" />
              </div>
            </div>
            
            {/* Book Button for Business Users */}
            {shouldShowBookButton && onBook && (
              <div className="absolute bottom-3 right-3">
                <Button 
                  variant="secondary"
                  size="sm"
                  className="bg-white hover:bg-white/90 text-black shadow-lg text-xs px-3 py-1 h-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBook(e);
                  }}
                >
                  Book Slot
                </Button>
              </div>
            )}
            
            {/* Renew Button for Owner's Expired Banners */}
            {isOwnerExpiredBanner && (
              <div className="absolute bottom-3 right-3">
                <Button 
                  variant="default"
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg text-xs px-3 py-1 h-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/profile?tab=subscriptions');
                  }}
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Renew
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* BACK SIDE - Only for explorers with booked banners */}
        {shouldShowFlipOptions && (
          <div 
            className="flip-card-back rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-background backdrop-blur-sm border border-border/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-full flex flex-col items-center justify-center p-4 space-y-3">
              <div className="text-center mb-2">
                <h3 className="text-lg font-bold mb-1">{slide.adContent}</h3>
                <p className="text-sm text-muted-foreground">
                  {slide.location}
                </p>
              </div>
              
              <div className="flex flex-col gap-2 w-full max-w-xs">
                {onViewFull && (
                  <Button
                    onClick={handleViewFull}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                    size="sm"
                    type="button"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                )}
                
                {onVisitBusiness && slide.isBooked && (
                  <Button
                    onClick={handleVisitBusiness}
                    variant="secondary"
                    className="w-full shadow-lg"
                    size="sm"
                    type="button"
                  >
                    <Store className="h-4 w-4 mr-2" />
                    Visit Business
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

SlotBannerCard.displayName = "SlotBannerCard";

export default SlotBannerCard;
