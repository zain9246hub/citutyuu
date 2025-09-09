
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { MapPin } from "lucide-react";
import { CITIES_WITH_ALL } from "@/utils/cityData";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";

interface CityFilterProps {
  selectedCity: string | null;
  onSelectCity: (city: string | null) => void;
  autoPlay?: boolean;
}

const CityFilter = React.memo(({ selectedCity, onSelectCity, autoPlay = false }: CityFilterProps) => {
  const [isMobile, setIsMobile] = useState(false);
  
  // Memoize cities to prevent unnecessary re-renders
  const cities = useMemo(() => CITIES_WITH_ALL, []);
  
  // Stabilize mobile check with useCallback
  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [checkMobile]);

  // Memoize clear filter handler
  const handleClearFilter = useCallback(() => {
    localStorage.setItem('selectedCity', 'All Cities');
    onSelectCity(null);
  }, [onSelectCity]);

  // Memoize city click handler
  const handleCityClick = useCallback((city: string) => {
    const normalizedCity = city === "All Cities" ? null : city;
    localStorage.setItem('selectedCity', normalizedCity || 'All Cities');
    onSelectCity(normalizedCity);
  }, [onSelectCity]);

  // Stable autoplay plugin
  const autoplayPlugin = useMemo(() => {
    if (!autoPlay) return undefined;
    
    return Autoplay({ 
      delay: 4000,
      stopOnInteraction: false, 
      playOnInit: true,
      stopOnMouseEnter: false,
      stopOnLastSnap: false,
      stopOnFocusIn: false,
      jump: false
    });
  }, [autoPlay]);

  // Stable carousel options to prevent re-initialization
  const carouselOpts = useMemo(() => ({
    align: "start" as const,
    loop: autoPlay ? true : false,
    dragFree: true,
    skipSnaps: false,
    containScroll: "trimSnaps" as const
  }), [autoPlay]);

  // Memoized city buttons to prevent re-renders
  const cityButtons = useMemo(() => {
    return cities.map((city) => {
      const isSelected = selectedCity === (city === "All Cities" ? null : city);
      return (
        <CarouselItem key={city} className="pl-2 basis-auto flex-shrink-0">
          <Button
            variant={isSelected ? "default" : "outline"}
            size="sm"
            className={cn(
              "rounded-full whitespace-nowrap text-sm font-medium px-4 py-2 h-9",
              "flex items-center gap-2",
              isSelected 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "bg-background hover:bg-muted"
            )}
            onClick={() => handleCityClick(city)}
          >
            {isSelected && <MapPin className="h-3.5 w-3.5" />}
            {city}
          </Button>
        </CarouselItem>
      );
    });
  }, [cities, selectedCity, handleCityClick]);

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-foreground/80">Filter by City</h3>
        {selectedCity && selectedCity !== "All Cities" && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearFilter}
            className="text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50"
          >
            Clear Filter
          </Button>
        )}
      </div>
      
      <Carousel
        opts={carouselOpts}
        plugins={autoplayPlugin ? [autoplayPlugin] : []}
        className="w-full overflow-hidden"
      >
        <CarouselContent className="-ml-2 flex items-center">
          {cityButtons}
        </CarouselContent>
        
        {!isMobile && (
          <>
            <CarouselPrevious 
              className="left-0 bg-background/95 backdrop-blur-sm hover:bg-background border border-border/40 shadow-md h-8 w-8"
              size="sm"
            />
            <CarouselNext 
              className="right-0 bg-background/95 backdrop-blur-sm hover:bg-background border border-border/40 shadow-md h-8 w-8"
              size="sm"
            />
          </>
        )}
      </Carousel>
    </div>
  );
});

CityFilter.displayName = 'CityFilter';

export default CityFilter;
