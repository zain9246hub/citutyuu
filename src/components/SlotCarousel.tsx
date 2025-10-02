
import React, { useState } from "react";
import { SlotBanner, SlotCarouselProps } from "@/types/slot";
import { useSlotCarousel } from "@/hooks/useSlotCarousel";
import SlotCarouselView from "./slot/SlotCarouselView";
import BannerPreviewModal from "./slot/BannerPreviewModal";
import FullBannerModal from "./slot/FullBannerModal";
import { Skeleton } from "@/components/ui/skeleton";
import { useEnhancedAuth } from "@/hooks/useEnhancedAuth";
import { BusinessIdUtils } from "@/utils/businessIdUtils";
import { useNavigate } from "react-router-dom";

const SlotCarousel: React.FC<SlotCarouselProps> = ({ 
  position,
  totalSlots,
  onViewAll,
  showViewAll = false,
  showBookButton = false,
  onBook,
  onBookSuccess,
  autoPlay = true,
  interval = 3000,
  paginationEnabled = false,
  itemsPerPage = 10,
  selectedCity,
  maxVisible,
  rotationIndex = 0
}) => {
  const { isBusiness, isExplorer, permissions } = useEnhancedAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [showFullBanner, setShowFullBanner] = useState(false);
  
  // Enhanced user role management
  const isBusinessUser = isBusiness;
  
  const { 
    api, 
    setApi, 
    slides, 
    selectedBanner, 
    showPreview, 
    setShowPreview, 
    handleBannerClick,
    autoplayPlugin,
    isLoading,
    error,
    handleClosePreview
  } = useSlotCarousel({ 
    position, 
    totalSlots: totalSlots || 6, 
    autoPlay,
    interval,
    selectedCity,
    maxVisible,
    rotationIndex,
    showOnlyBooked: !isBusinessUser, // General users and explorers see only booked banners
    bookedCount: 4,
    includeImages: true
  });
  
  // Add state for selectedBanner management
  const [localSelectedBanner, setLocalSelectedBanner] = useState<SlotBanner | null>(null);
  
  // Sync with hook's selectedBanner
  React.useEffect(() => {
    setLocalSelectedBanner(selectedBanner);
  }, [selectedBanner]);

  // Enhanced error handling for carousel
  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="text-muted-foreground text-sm">
          {error}
        </div>
        <button 
          className="text-primary text-sm mt-2 hover:underline"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: window.scrollY - 100, behavior: 'smooth' });
  };

  const handleViewFullBanner = () => {
    handleClosePreview();
    setShowFullBanner(true);
  };

  const handleVisitBusiness = () => {
    try {
      if (!localSelectedBanner) {
        console.error('[SlotCarousel] No banner selected for business visit');
        return;
      }
      
      // Use enhanced business ID utility
      const businessUrl = BusinessIdUtils.getBusinessUrl(
        localSelectedBanner.id, 
        localSelectedBanner.position, 
        localSelectedBanner.businessId
      );
      
      const businessId = BusinessIdUtils.resolveBusinessId(
        localSelectedBanner.id, 
        localSelectedBanner.position, 
        localSelectedBanner.businessId
      );
      
      // Validate business exists before navigation
      if (!BusinessIdUtils.validateBusinessForNavigation(businessId)) {
        console.warn('[SlotCarousel] Business validation failed, using fallback');
      }
      
      console.log('[SlotCarousel] Navigating to business URL:', businessUrl);
      navigate(businessUrl);
      handleClosePreview();
    } catch (error) {
      console.error('[SlotCarousel] Error navigating to business:', error);
      // Enhanced fallback
      navigate('/business/1');
      handleClosePreview();
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  return (
    <div className="relative animate-fade-in">
      <SlotCarouselView
        slides={slides}
        onViewAll={onViewAll}
        showViewAll={showViewAll}
        onBannerClick={handleBannerClick}
        onBook={onBook}
        showBookButton={showBookButton}
        api={api}
        setApi={setApi}
        autoPlay={autoPlay}
        interval={interval}
        autoplayPlugin={autoplayPlugin}
        paginationEnabled={paginationEnabled}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        maxVisible={maxVisible}
      />
      
      {localSelectedBanner && (
        <>
          <BannerPreviewModal
            open={showPreview}
            onOpenChange={(open) => {
              if (!open) {
                handleClosePreview();
                setLocalSelectedBanner(null);
              }
            }}
            banner={localSelectedBanner}
            onBook={onBook ? (e: React.MouseEvent) => {
              try {
                onBook(e);
              } catch (error) {
                console.error('[SlotCarousel] Error in book handler:', error);
              }
            } : undefined}
            showBookButton={showBookButton && !isExplorer}
            onViewFullBanner={handleViewFullBanner}
            onVisitBusiness={handleVisitBusiness}
            isExplorer={isExplorer}
          />
          
          <FullBannerModal
            open={showFullBanner}
            onOpenChange={(open) => {
              if (!open) {
                setShowFullBanner(false);
              }
            }}
            banner={localSelectedBanner}
          />
        </>
      )}
    </div>
  );
};

export default SlotCarousel;
