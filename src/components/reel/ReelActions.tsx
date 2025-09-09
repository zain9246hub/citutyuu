
import React, { useEffect, useState } from "react";
import { Heart, MapPin, Phone, Share2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { buildWhatsappUrl } from "@/utils/phoneUtils";

interface ReelActionsProps {
  reelId: string;
  likes: number;
  canOperate: boolean;
  directionsUrl?: string;
  phoneNumber?: string;
  isLiked?: boolean;
  onLike?: (reelId: string) => void;
  onShare?: (reelId: string) => void;
  onDirections?: (reelId: string) => void;
  onContact?: (reelId: string) => void;
}

const ReelActions = ({
  reelId,
  likes,
  canOperate,
  directionsUrl,
  phoneNumber,
  isLiked = false,
  onLike,
  onShare,
  onDirections,
  onContact
}: ReelActionsProps) => {
  const { toast } = useToast();
  const [localIsLiked, setLocalIsLiked] = useState(isLiked);
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const [isShareAnimating, setIsShareAnimating] = useState(false);
  const [showHearts, setShowHearts] = useState(false);

  // Update local state when prop changes
  useEffect(() => {
    setLocalIsLiked(isLiked);
  }, [isLiked]);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Like button clicked for reel:', reelId);
    
    setLocalIsLiked(!localIsLiked);
    setIsLikeAnimating(true);
    setShowHearts(true);
    
    if (onLike) {
      onLike(reelId);
    } else {
      toast({
        title: localIsLiked ? "Like removed" : "Like added",
        description: localIsLiked ? "You unliked this reel" : "You liked this reel",
        duration: 2000,
      });
    }
    
    setTimeout(() => {
      setIsLikeAnimating(false);
      setShowHearts(false);
    }, 1000);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Share button clicked for reel:', reelId);
    
    setIsShareAnimating(true);
    if (onShare) {
      onShare(reelId);
    } else {
      toast({
        title: "Share",
        description: "Sharing functionality will be implemented soon",
        duration: 2000,
      });
    }
    setTimeout(() => setIsShareAnimating(false), 300);
  };

  const handleDirections = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Directions button clicked for reel:', reelId);
    
    if (onDirections) {
      onDirections(reelId);
    } else if (directionsUrl) {
      window.open(directionsUrl, "_blank");
    } else {
      toast({
        title: "Directions",
        description: "No directions available for this location",
        duration: 2000,
      });
    }
  };

  const handleContact = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Contact button clicked for reel:', reelId);
    
    if (onContact) {
      onContact(reelId);
    } else if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    } else {
      toast({
        title: "Contact",
        description: "No contact number available",
        duration: 2000,
      });
    }
  };

  return (
    <div className="absolute right-4 bottom-36 flex flex-col items-center gap-6 z-10">
      <div className="relative">
        {showHearts && (
          <div className="absolute -top-8 -left-8 w-16 h-16 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "absolute left-1/2 top-1/2 text-red-500",
                  "animate-[float_1s_ease-out_forwards]",
                  "opacity-0"
                )}
                style={{
                  animation: `float${i} 1s ease-out forwards`,
                  animationDelay: `${i * 0.1}s`
                }}
              >
                ❤️
              </div>
            ))}
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "rounded-full bg-black/50 hover:bg-black/70 transition-all duration-300 pointer-events-auto",
            isLikeAnimating && "scale-125"
          )}
          onClick={handleLike}
        >
          <Heart 
            className={cn(
              "h-7 w-7 transition-transform duration-300",
              isLikeAnimating && "animate-[pulse_0.3s_ease-in-out]",
              localIsLiked ? "text-red-500 fill-red-500" : "text-white"
            )} 
          />
        </Button>
      </div>
      <span className="text-white text-xs font-semibold">{likes}</span>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full bg-black/50 hover:bg-black/70 pointer-events-auto"
        onClick={handleDirections}
      >
        <MapPin className="h-7 w-7 text-white" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full bg-black/50 hover:bg-black/70 pointer-events-auto"
        onClick={handleContact}
      >
        <Phone className="h-7 w-7 text-white" />
      </Button>
      
      {phoneNumber && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full bg-black/50 hover:bg-black/70 pointer-events-auto"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.open(buildWhatsappUrl(phoneNumber, "Hi! I saw your reel and would like to know more."), '_blank');
          }}
        >
          <MessageCircle className="h-7 w-7 text-white" />
        </Button>
      )}
      
      <Button 
        variant="ghost" 
        size="icon" 
        className={cn(
          "rounded-full bg-black/50 hover:bg-black/70 transition-all duration-300 pointer-events-auto",
          isShareAnimating && "scale-125"
        )}
        onClick={handleShare}
      >
        <Share2 className={cn(
          "h-7 w-7 text-white transition-transform duration-300",
          isShareAnimating && "animate-[pulse_0.3s_ease-in-out]"
        )} />
      </Button>
    </div>
  );
};

export default ReelActions;
