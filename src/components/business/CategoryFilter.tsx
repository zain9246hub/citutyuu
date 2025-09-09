
import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string) => void;
}

const CategoryFilter = React.memo(({ categories, selectedCategory, onCategorySelect }: CategoryFilterProps) => {
  const [isMobile, setIsMobile] = useState(false);
  
  // Stable autoplay plugin - created once and reused
  const autoplayPlugin = useMemo(() => 
    Autoplay({ 
      delay: 5000, 
      stopOnInteraction: false, 
      playOnInit: true,
      stopOnMouseEnter: false
    }), []
  );

  // Stable mobile check function
  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Update isMobile state based on screen size
  useEffect(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [checkMobile]);

  // Stable carousel options
  const carouselOpts = useMemo(() => ({
    align: "start" as const,
    loop: true,
    dragFree: false
  }), []);

  // Memoized category click handler
  const handleCategoryClick = useCallback((category: string) => {
    console.log('[CategoryFilter] Category selected:', category);
    onCategorySelect(category);
  }, [onCategorySelect]);

  return (
    <div className="px-4 pb-3 max-w-md mx-auto">
      <Carousel
        opts={carouselOpts}
        plugins={[autoplayPlugin]}
        className="w-full overflow-hidden"
      >
        <CarouselContent className="-ml-2 flex items-center">
          {categories.map((category) => (
            <CarouselItem key={category} className="pl-2 basis-auto flex-shrink-0">
              <Button
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                className={cn(
                  "rounded-full text-xs whitespace-nowrap px-3 py-2 transition-all duration-200",
                  selectedCategory === category 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "bg-background hover:bg-muted"
                )}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {!isMobile && (
          <>
            <CarouselPrevious 
              className="left-0 bg-background/95 backdrop-blur-sm hover:bg-background border shadow-sm"
              size="sm"
            />
            <CarouselNext 
              className="right-0 bg-background/95 backdrop-blur-sm hover:bg-background border shadow-sm"
              size="sm"
            />
          </>
        )}
      </Carousel>
    </div>
  );
});

CategoryFilter.displayName = 'CategoryFilter';

export default CategoryFilter;
