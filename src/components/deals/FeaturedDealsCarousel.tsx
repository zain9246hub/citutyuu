import React, { useMemo } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useDeals } from "@/hooks/useDeals";
import { FilterOptions, Deal } from "@/types/deal";
import DealCard from "../DealCard";
import EmptyDealsMessage from "../EmptyDealsMessage";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";

interface FeaturedDealsCarouselProps {
  cityFilter?: string | null;
  searchQuery?: string;
  filterOptions?: FilterOptions;
  allowSharingForExplorers?: boolean;
  autoPlay?: boolean;
  showAsCarousel?: boolean;
}

const FeaturedDealsCarousel = ({ 
  cityFilter, 
  searchQuery, 
  filterOptions,
  allowSharingForExplorers = false,
  autoPlay = true,
  showAsCarousel = false
}: FeaturedDealsCarouselProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { sortedDeals, toggleSave, isSaved, featureDeal, isFeatured, getDealUsageCount, useDeal, isLoading } = useDeals(cityFilter, searchQuery, filterOptions);

  const autoplayPlugin = useMemo(() => {
    if (!autoPlay || !showAsCarousel) return undefined;
    
    return Autoplay({ 
      delay: 4000,
      stopOnInteraction: false, 
      playOnInit: true,
      stopOnMouseEnter: false,
      stopOnLastSnap: false
    });
  }, [autoPlay, showAsCarousel]);

  const handleDealClick = (dealId: number) => {
    useDeal(dealId);
    navigate(`/deal/${dealId}`);
  };

  const handleShare = (deal: Deal) => {
    if (navigator.share) {
      navigator.share({
        title: `Deal: ${deal.title}`,
        text: `Check out this amazing deal: ${deal.title} at ${deal.location}. Discount: ${deal.discount}% OFF`,
        url: window.location.href,
      }).catch((error) => {
        copyToClipboard(deal);
      });
    } else {
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
    return null;
  }

  if (sortedDeals.length === 0) {
    return (
      <EmptyDealsMessage 
        cityFilter={cityFilter} 
        filterOptions={filterOptions} 
      />
    );
  }

  // Show as vertical list if not carousel mode
  if (!showAsCarousel) {
    return (
      <div className="space-y-4">
        {sortedDeals.map((deal) => (
          <DealCard 
            key={deal.id} 
            deal={deal}
            saved={isSaved(deal.id)}
            featured={isFeatured(deal.id)}
            onToggleSave={() => toggleSave(deal.id)}
            onShare={allowSharingForExplorers ? () => handleShare(deal) : undefined}
            onClick={() => handleDealClick(deal.id)}
            usageCount={getDealUsageCount(deal.id)}
          />
        ))}
      </div>
    );
  }

  // Show as carousel
  return (
    <div className="w-full">
      <Carousel 
        className="w-full" 
        opts={{
          align: "start",
          loop: true,
          skipSnaps: false,
          dragFree: false,
        }}
        plugins={autoplayPlugin ? [autoplayPlugin] : []}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {sortedDeals.map((deal) => (
            <CarouselItem key={deal.id} className="pl-2 md:pl-4 basis-[85%] md:basis-[45%] lg:basis-[30%]">
              <DealCard 
                deal={deal}
                saved={isSaved(deal.id)}
                featured={isFeatured(deal.id)}
                onToggleSave={() => toggleSave(deal.id)}
                onShare={allowSharingForExplorers ? () => handleShare(deal) : undefined}
                onClick={() => handleDealClick(deal.id)}
                usageCount={getDealUsageCount(deal.id)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {sortedDeals.length > 1 && (
          <>
            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
          </>
        )}
      </Carousel>
    </div>
  );
};

export default FeaturedDealsCarousel;