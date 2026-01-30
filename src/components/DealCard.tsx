
import React from "react";
import { Deal } from "@/types/deal";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DealImage from "./deal/DealImage";
import DealHeader from "./deal/DealHeader";
import DealContent from "./deal/DealContent";
import ContactInfo from "./deal/ContactInfo";
import DealPrice from "./deal/DealPrice";
import { useDealCard } from "@/hooks/useDealCard";

interface DealCardProps {
  deal: Deal;
  saved?: boolean;
  featured?: boolean;
  onToggleSave: () => void;
  onShare?: () => void;
  onClick?: () => void;
  usageCount?: number;
}

const DealCard = ({ 
  deal, 
  saved = false, 
  featured = false, 
  onToggleSave, 
  onShare, 
  onClick,
  usageCount = 0
}: DealCardProps) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const isExplorer = currentUser?.role === 'explorer';

  // Check if deal is expired (for owner-only visibility)
  const isDealExpired = (): boolean => {
    if (deal.subscriptionEndDate) {
      return new Date(deal.subscriptionEndDate) < new Date();
    }
    if (deal.expiryDate) {
      return new Date(deal.expiryDate) < new Date();
    }
    return false;
  };

  // Check if current user is the owner
  const isOwner = (): boolean => {
    if (!deal.uploadedBy || !currentUser) return false;
    const uploader = deal.uploadedBy.toLowerCase();
    return (
      (currentUser.id && uploader === currentUser.id.toLowerCase()) ||
      (currentUser.name && uploader === currentUser.name.toLowerCase()) ||
      (currentUser.email && uploader === currentUser.email.toLowerCase())
    );
  };

  const isExpired = isDealExpired();
  const showExpiredBadge = isExpired && isOwner();

  const {
    isLikeAnimating,
    isShareAnimating,
    handleShare,
    handleLike,
    handlePhoneClick,
    handleAddressClick,
    copyToClipboard,
  } = useDealCard({ deal, onToggleSave, onShare });

  return (
    <div 
      className="relative rounded-lg glass-card overflow-hidden transition-all cursor-pointer hover:shadow-xl hover:scale-[1.02]"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick && onClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Deal: ${deal.title} with ${deal.discount}% discount`}
    >
      {/* Expired badge overlay for owner */}
      {showExpiredBadge && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
          <Badge variant="destructive" className="text-xs">
            Expired
          </Badge>
          <Button 
            variant="default"
            size="sm"
            className="text-xs h-7 px-2"
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
      
      <div className="flex flex-col md:flex-row">
        <DealImage
          image={deal.image}
          title={deal.title}
          discount={deal.discount || 0}
          featured={featured}
          saved={saved}
          isExplorer={isExplorer}
          onToggleSave={handleLike}
          onShare={handleShare}
          isLikeAnimating={isLikeAnimating}
          isShareAnimating={isShareAnimating}
        />
      
        <div className="p-4 flex flex-col flex-1">
          <DealHeader title={deal.title} rating={deal.rating} />
          
          <ContactInfo
            location={deal.location}
            city={deal.city}
            phone={deal.phone}
            onAddressClick={handleAddressClick}
            onPhoneClick={handlePhoneClick}
            onCopyAddress={(e) => copyToClipboard(e, `${deal.location}, ${deal.city}`, "Address copied to clipboard")}
            onCopyPhone={(e) => deal.phone && copyToClipboard(e, deal.phone, "Phone number copied to clipboard")}
          />
          
          <DealContent 
            description={deal.description} 
            tags={deal.tags} 
          />
          
          <div className="mt-auto pt-3">
            <DealPrice
              discountedPrice={deal.discountedPrice || 0}
              originalPrice={deal.originalPrice}
              expiryDate={deal.expiryDate}
              usageCount={usageCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealCard;
