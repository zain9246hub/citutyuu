import React, { memo, useState } from "react";
import { MapPin, ArrowRight, Eye, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SlotBannerCardProps } from "@/types/slot";
import { useAuth } from "@/contexts/AuthContext";

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
  const isExplorer = currentUser?.role === 'explorer';
  const [isFlipped, setIsFlipped] = useState(false);
  
  const shouldShowBookButton = showBookButton && !isExplorer && !slide.isBooked;
  const shouldShowFlipOptions = isExplorer && slide.isBooked;

  const handleCardClick = () => {
    if (shouldShowFlipOptions) {
      setIsFlipped(!isFlipped);
    } else {
      onClick(slide);
    }
  };

  const handleViewFull = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewFull) {
      onViewFull(slide);
    }
  };

  const handleVisitBusiness = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onVisitBusiness) {
      onVisitBusiness(slide);
    }
  };
  
  return (
    <div 
      className={`flip-card rounded-lg ${shouldShowFlipOptions ? 'cursor-pointer' : ''} ${isFlipped ? 'flipped' : ''}`}
      onClick={handleCardClick}
      onMouseEnter={() => shouldShowFlipOptions && setIsFlipped(true)}
      onMouseLeave={() => shouldShowFlipOptions && setIsFlipped(false)}
    >
      <div className={`flip-card-inner min-h-[280px] ${!slide.imageUrl ? slide.backgroundColor : ''}`}>
        {/* FRONT SIDE */}
        <div className="flip-card-front rounded-lg border border-border overflow-hidden bg-background">
          {slide.imageUrl ? (
            <div className="relative h-64 overflow-hidden">
              <img 
                src={slide.imageUrl} 
                alt={slide.adContent}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              {slide.isBooked && (
                <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                  🔥 Featured
                </div>
              )}
              
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                {isExplorer && (
                  <div className="text-xs uppercase tracking-wider text-white/80 mb-2 font-medium">Position #{slide.position}</div>
                )}
                <h3 className="text-lg font-bold mb-2 leading-tight">{slide.adContent}</h3>
                {slide.description && (
                  <p className="text-sm text-white/90 mb-3 leading-relaxed">
                    {slide.description}
                  </p>
                )}
                <div className="text-sm bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 inline-block">
                  📍 {slide.location}
                </div>
              </div>
            </div>
          ) : (
            <div className={`${slide.backgroundColor} min-h-[200px] flex items-center justify-center p-6`}>
              <div className="text-center">
                {isExplorer && (
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-medium">Position #{slide.position}</div>
                )}
                <h3 className="text-lg font-semibold mb-2">{slide.adContent}</h3>
                {slide.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {slide.description}
                  </p>
                )}
                <div className="text-sm bg-muted rounded-full px-3 py-1 inline-block">
                  📍 {slide.location}
                </div>
              </div>
            </div>
          )}
          
          {shouldShowBookButton && onBook && (
            <div className="absolute bottom-4 right-4">
              <Button 
                variant="secondary"
                size="sm"
                className="bg-white/90 hover:bg-white text-gray-900 shadow-lg backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onBook(e);
                }}
              >
                Book This Slot
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
          
          {!isExplorer && !slide.imageUrl && !slide.isBooked && (
            <div className="border-t border-border p-3 flex justify-between items-center bg-muted/50">
              <span className="text-xs font-medium">Available Slot</span>
              <div className="flex items-center text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 mr-1" /> {slide.location}
              </div>
            </div>
          )}
          
          {!isExplorer && !slide.imageUrl && slide.isBooked && (
            <div className="border-t border-border p-3 flex justify-between items-center bg-primary/10">
              <span className="text-xs font-medium text-primary">🔥 Featured Business</span>
              <div className="flex items-center text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 mr-1" /> {slide.location}
              </div>
            </div>
          )}
          
          {isExplorer && !slide.imageUrl && (
            <div className="border-t border-border p-3 flex justify-between items-center bg-muted/30">
              <span className="text-xs font-medium">Ad Slot #{slide.id}</span>
              <div className="flex items-center text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 mr-1" /> {slide.location}
              </div>
            </div>
          )}
        </div>

        {/* BACK SIDE - Only for explorers with booked banners */}
        {shouldShowFlipOptions && (
          <div className="flip-card-back rounded-lg border border-border overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-background backdrop-blur-sm">
            <div className="h-full flex flex-col items-center justify-center p-6 space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold mb-2">{slide.adContent}</h3>
                <p className="text-sm text-muted-foreground">
                  📍 {slide.location}
                </p>
              </div>
              
              <div className="flex flex-col gap-3 w-full max-w-xs">
                {onViewFull && (
                  <Button
                    onClick={handleViewFull}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                    size="lg"
                  >
                    <Eye className="h-5 w-5 mr-2" />
                    View Full Details
                  </Button>
                )}
                
                {onVisitBusiness && slide.isBooked && (
                  <Button
                    onClick={handleVisitBusiness}
                    variant="secondary"
                    className="w-full shadow-lg"
                    size="lg"
                  >
                    <Store className="h-5 w-5 mr-2" />
                    Visit Business Profile
                  </Button>
                )}
              </div>
              
              <p className="text-xs text-muted-foreground text-center mt-4">
                Click or hover to flip back
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

SlotBannerCard.displayName = "SlotBannerCard";

export default SlotBannerCard;
