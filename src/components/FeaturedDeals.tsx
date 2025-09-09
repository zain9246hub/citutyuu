
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FilterOptions, Deal } from "@/types/deal";
import DealCard from "./DealCard";
import EmptyDealsMessage from "./EmptyDealsMessage";
import { useDeals } from "@/hooks/useDeals";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import FeaturedDealsCarousel from "./deals/FeaturedDealsCarousel";

interface FeaturedDealsProps {
  cityFilter?: string | null;
  searchQuery?: string;
  filterOptions?: FilterOptions;
  allowSharingForExplorers?: boolean;
  showAsCarousel?: boolean;
  autoPlay?: boolean;
}

const FeaturedDeals = ({ 
  cityFilter, 
  searchQuery, 
  filterOptions,
  allowSharingForExplorers = false,
  showAsCarousel = false,
  autoPlay = true
}: FeaturedDealsProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { sortedDeals, toggleSave, isSaved, featureDeal, isFeatured, getDealUsageCount, useDeal, isLoading } = useDeals(cityFilter, searchQuery, filterOptions);
  const [processingDealId, setProcessingDealId] = useState<number | null>(null);

  const handleDealClick = (dealId: number) => {
    useDeal(dealId); // Track deal usage when clicked
    navigate(`/deal/${dealId}`);
  };

  const handleShare = (deal: Deal) => {
    if (navigator.share) {
      navigator.share({
        title: `Deal: ${deal.title}`,
        text: `Check out this amazing deal: ${deal.title} at ${deal.location}. Discount: ${deal.discount}% OFF`,
        url: window.location.href,
      }).catch((error) => {
        // Fallback to clipboard if Web Share API fails
        copyToClipboard(deal);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      copyToClipboard(deal);
    }
  };

  const copyToClipboard = (deal: Deal) => {
    const shareText = `Check out this amazing deal: ${deal.title} at ${deal.location}. Discount: ${deal.discount}% OFF`;
    navigator.clipboard.writeText(shareText).then(() => {
      toast({
        title: "Deal Shared",
        description: "Deal details copied to clipboard",
      });
    }).catch(err => {
      toast({
        title: "Sharing Failed",
        description: "Could not copy deal details",
        variant: "destructive"
      });
    });
  };

  if (isLoading) {
    return null; // Loading is handled by the parent component
  }

  return (
    <FeaturedDealsCarousel
      cityFilter={cityFilter}
      searchQuery={searchQuery}
      filterOptions={filterOptions}
      allowSharingForExplorers={allowSharingForExplorers}
      showAsCarousel={showAsCarousel}
      autoPlay={autoPlay}
    />
  );
};

export default FeaturedDeals;
