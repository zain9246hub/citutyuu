
import React, { useMemo } from "react";
import { SlotCarouselViewProps } from "@/types/slot";
import SlotHeader from "./SlotHeader";
import SlotCarouselContent from "./SlotCarouselContent";
import SlotPagination from "./SlotPagination";
import { useSlotPagination } from "@/hooks/useSlotPagination";

const SlotCarouselView: React.FC<SlotCarouselViewProps> = ({
  slides,
  timeRemaining,
  onViewAll,
  showViewAll = false,
  onBannerClick,
  onBook,
  showBookButton = false,
  api,
  setApi,
  autoPlay = true,
  interval = 3000,
  autoplayPlugin,
  paginationEnabled = false,
  itemsPerPage = 10,
  currentPage = 1,
  onPageChange,
  maxVisible,
  onViewFull,
  onVisitBusiness,
}) => {
  // Quick return for empty slides
  if (!slides.length) return null;

  const totalSlides = slides.length;
  
  // Use pagination hook properly - hooks cannot be called conditionally
  const paginationData = useSlotPagination({
    totalItems: totalSlides,
    itemsPerPage,
    currentPage,
    onPageChange: paginationEnabled && onPageChange ? onPageChange : () => {},
  });

  // Memoize pagination visibility and data
  const paginationConfig = useMemo(() => {
    if (!paginationEnabled || !onPageChange) {
      return {
        totalPages: 1,
        pageNumbers: [],
        handlePageChange: () => {},
        handlePrevPage: () => {},
        handleNextPage: () => {},
      };
    }
    
    return paginationData;
  }, [paginationEnabled, onPageChange, paginationData.totalPages, paginationData.pageNumbers, paginationData.handlePageChange]);

  // Optimize visible slides calculation
  const visibleSlides = useMemo(() => {
    if (!paginationEnabled) return slides;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return slides.slice(startIndex, endIndex);
  }, [slides, currentPage, itemsPerPage, paginationEnabled]);

  // Memoize control visibility
  const shouldShowControls = useMemo(() => 
    visibleSlides.length > 1, 
    [visibleSlides.length]
  );

  // Memoize pagination visibility
  const shouldShowPagination = useMemo(() => 
    paginationEnabled && paginationConfig.totalPages > 1 && onPageChange, 
    [paginationEnabled, paginationConfig.totalPages, onPageChange]
  );
  
  return (
    <div className="relative px-4">
      <SlotHeader 
        position={slides[0].position}
        totalSlots={totalSlides}
        onViewAll={onViewAll}
        showViewAll={showViewAll}
      />
      
      <SlotCarouselContent 
        slides={visibleSlides}
        timeRemaining={timeRemaining}
        onBannerClick={onBannerClick}
        onBook={onBook}
        showBookButton={showBookButton}
        api={api}
        setApi={setApi}
        autoPlay={autoPlay}
        autoplayPlugin={autoplayPlugin}
        shouldShowControls={shouldShowControls}
        maxVisible={maxVisible}
        onViewFull={onViewFull}
        onVisitBusiness={onVisitBusiness}
      />
      
      {shouldShowPagination && (
        <SlotPagination 
          currentPage={currentPage}
          totalPages={paginationConfig.totalPages}
          pageNumbers={paginationConfig.pageNumbers}
          onPageChange={paginationConfig.handlePageChange}
          handlePrevPage={paginationConfig.handlePrevPage}
          handleNextPage={paginationConfig.handleNextPage}
        />
      )}
    </div>
  );
};

// Optimize memo comparison
export default React.memo(SlotCarouselView, (prevProps, nextProps) => {
  // Only re-render if critical props change
  return (
    prevProps.slides === nextProps.slides &&
    prevProps.currentPage === nextProps.currentPage &&
    prevProps.showViewAll === nextProps.showViewAll &&
    prevProps.showBookButton === nextProps.showBookButton &&
    prevProps.paginationEnabled === nextProps.paginationEnabled &&
    prevProps.autoPlay === nextProps.autoPlay
  );
});
