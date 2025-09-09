
import React, { useMemo } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import SlotBannerCard from "./SlotBannerCard";
import { SlotBanner } from "@/types/slot";

interface SlotCarouselContentProps {
  slides: SlotBanner[];
  timeRemaining?: number;
  onBannerClick: (banner: SlotBanner) => void;
  onBook?: (e: React.MouseEvent) => void;
  showBookButton?: boolean;
  api?: any;
  setApi?: (api: any) => void;
  autoPlay?: boolean;
  autoplayPlugin?: any;
  shouldShowControls?: boolean;
  maxVisible?: number;
}

const SlotCarouselContent: React.FC<SlotCarouselContentProps> = ({
  slides,
  timeRemaining,
  onBannerClick,
  onBook,
  showBookButton = false,
  api,
  setApi,
  autoPlay = true,
  autoplayPlugin,
  shouldShowControls = true,
  maxVisible,
}) => {
  const carouselOptions = useMemo(() => ({
    loop: true,
    skipSnaps: false,
    dragFree: false,
    containScroll: "trimSnaps" as const,
    align: "start" as const,
    slidesToScroll: 1,
    duration: 25,
  }), []);

  const plugins = useMemo(() => {
    if (autoPlay && autoplayPlugin) {
      console.log('[SlotCarouselContent] Including autoplay plugin');
      return [autoplayPlugin];
    }
    return [];
  }, [autoPlay, autoplayPlugin]);

  // Use all slides but optimize rendering
  const optimizedSlides = useMemo(() => slides, [slides]);

  // If showing only one slot (maxVisible=1), render without carousel
  if (maxVisible === 1 && optimizedSlides.length === 1) {
    return (
      <div className="w-full px-2 md:px-4">
        <SlotBannerCard 
          slide={optimizedSlides[0]}
          timeRemaining={timeRemaining}
          onClick={onBannerClick}
          onBook={onBook}
          showBookButton={showBookButton}
        />
      </div>
    );
  }

  return (
    <Carousel 
      className="w-full" 
      opts={carouselOptions} 
      setApi={setApi}
      plugins={plugins}
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {optimizedSlides.map((slide) => (
          <CarouselItem key={slide.id} className="pl-2 md:pl-4">
            <SlotBannerCard 
              slide={slide}
              timeRemaining={timeRemaining}
              onClick={onBannerClick}
              onBook={onBook}
              showBookButton={showBookButton}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      
      {shouldShowControls && optimizedSlides.length > 1 && maxVisible !== 1 && (
        <>
          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
        </>
      )}
    </Carousel>
  );
};

export default React.memo(SlotCarouselContent, (prevProps, nextProps) => {
  return (
    prevProps.slides.length === nextProps.slides.length &&
    prevProps.shouldShowControls === nextProps.shouldShowControls &&
    prevProps.autoPlay === nextProps.autoPlay &&
    prevProps.showBookButton === nextProps.showBookButton
  );
});
