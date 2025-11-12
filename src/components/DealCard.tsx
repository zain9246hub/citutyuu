
import React from "react";
import { Deal } from "@/types/deal";
import { useAuth } from "@/contexts/AuthContext";
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
  const isExplorer = currentUser?.role === 'explorer';

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
      className="rounded-lg glass-card overflow-hidden transition-all cursor-pointer hover:shadow-xl hover:scale-[1.02]"
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
