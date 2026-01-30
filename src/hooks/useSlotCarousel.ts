
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { SlotBanner } from "@/types/slot";
import { generateMockSlotBanners } from "@/utils/slotUtilsNew";
import { useAdvertisements } from "@/contexts/AdvertisementContext";
import { useAuth } from "@/contexts/AuthContext";
import Autoplay from "embla-carousel-autoplay";

type UseSlotCarouselOptions = {
  position: number;
  totalSlots: number;
  autoPlay?: boolean;
  interval?: number;
  selectedCity?: string | null;
  maxVisible?: number;
  rotationIndex?: number;
  showOnlyBooked?: boolean;
  bookedCount?: number;
  includeImages?: boolean;
};

export const useSlotCarousel = ({ 
  position, 
  totalSlots,
  autoPlay = true,
  interval = 3000,
  selectedCity,
  maxVisible,
  rotationIndex = 0,
  showOnlyBooked = false,
  bookedCount = 4,
  includeImages = false
}: UseSlotCarouselOptions) => {
  const { uploadedAds } = useAdvertisements();
  const { currentUser } = useAuth();
  const [api, setApi] = useState<any>();
  const [selectedBanner, setSelectedBanner] = useState<SlotBanner | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get current user identifier for ownership checks
  const currentUserId = currentUser?.name || currentUser?.email || currentUser?.id;
  
  // Use refs to prevent unnecessary recreations
  const autoplayPluginRef = useRef<any>(null);
  const slidesRef = useRef<SlotBanner[]>([]);
  const previousCityRef = useRef<string | null>(selectedCity);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Enhanced autoplay plugin with better error handling
  const autoplayPlugin = useMemo(() => {
    if (!autoPlay) {
      return undefined;
    }
    
    try {
      // Destroy existing plugin if interval changed
      if (autoplayPluginRef.current && previousCityRef.current !== selectedCity) {
        if (typeof autoplayPluginRef.current.destroy === 'function') {
          autoplayPluginRef.current.destroy();
        }
        autoplayPluginRef.current = null;
      }
      
      // Create new plugin
      if (!autoplayPluginRef.current) {
        autoplayPluginRef.current = Autoplay({ 
          delay: Math.max(interval, 1000), // Ensure minimum delay
          stopOnInteraction: true, // Stop on user interaction to prevent conflicts
          playOnInit: false, // Start manually to prevent immediate loops
          stopOnMouseEnter: true,
          stopOnLastSnap: false,
          stopOnFocusIn: true,
          jump: false
        });
        console.log('[useSlotCarousel] Created autoplay plugin with delay:', interval);
      }
      
      return autoplayPluginRef.current;
    } catch (error) {
      console.error('[useSlotCarousel] Error creating autoplay plugin:', error);
      setError('Autoplay initialization failed');
      return undefined;
    }
  }, [autoPlay, interval, selectedCity]);

  // Enhanced slide generation with error handling
  const slides = useMemo(() => {
    try {
      console.log('[SlotCarousel] Generating slides for city:', selectedCity, 'position:', position);
      setError(null);
      
      // Generate slides with proper validation
      const generatedSlides = generateMockSlotBanners(position, rotationIndex, uploadedAds, selectedCity, currentUserId);
      
      if (!generatedSlides || generatedSlides.length === 0) {
        console.warn('[SlotCarousel] No slides generated');
        return [];
      }
      
      console.log('[SlotCarousel] Generated', generatedSlides.length, 'slides for city:', selectedCity);
      
      // Validate slide data
      const validSlides = generatedSlides.filter(slide => 
        slide && slide.id && slide.adContent && slide.location
      );
      
      if (validSlides.length !== generatedSlides.length) {
        console.warn('[SlotCarousel] Some slides filtered out due to missing data');
      }
      
      // Reorder so available slots come first (business users see the fresh slot)
      const orderedSlides = [...validSlides].sort((a, b) => {
        const aBooked = !!a.isBooked;
        const bBooked = !!b.isBooked;
        if (aBooked === bBooked) return 0;
        return aBooked ? 1 : -1; // unbooked first
      });
      
      // Apply maxVisible filter
      if (maxVisible && maxVisible > 0 && orderedSlides.length > 0) {
        const startIndex = (maxVisible === 1) ? 0 : rotationIndex % orderedSlides.length;
        const endIndex = Math.min(startIndex + maxVisible, orderedSlides.length);
        return orderedSlides.slice(startIndex, endIndex);
      }
      
      // Cache for stability
      slidesRef.current = orderedSlides;
      previousCityRef.current = selectedCity;
      
      return orderedSlides;
    } catch (error) {
      console.error('[SlotCarousel] Error generating slides:', error);
      setError('Failed to load banner content');
      return slidesRef.current || []; // Return cached slides as fallback
    }
  }, [position, selectedCity, maxVisible, rotationIndex, showOnlyBooked, bookedCount, includeImages, uploadedAds, currentUserId]);

  // Enhanced loading state management
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, [slides]);

  // Enhanced banner click handler with validation
  const handleBannerClick = useCallback((banner: SlotBanner) => {
    try {
      if (!banner || !banner.id) {
        console.error('[useSlotCarousel] Invalid banner data:', banner);
        setError('Banner data is incomplete');
        return;
      }
      
      console.log('[useSlotCarousel] Banner clicked:', banner.id, banner.adContent);
      setError(null);
      setSelectedBanner(banner);
      setShowPreview(true);
      
      // Stop autoplay when modal opens
      if (api && autoplayPluginRef.current) {
        try {
          if (typeof autoplayPluginRef.current.stop === 'function') {
            autoplayPluginRef.current.stop();
          }
        } catch (stopError) {
          console.warn('[useSlotCarousel] Error stopping autoplay:', stopError);
        }
      }
    } catch (error) {
      console.error('[useSlotCarousel] Error handling banner click:', error);
      setError('Failed to open banner preview');
    }
  }, [api]);

  // Enhanced modal state management
  const handleClosePreview = useCallback(() => {
    setShowPreview(false);
    setSelectedBanner(null);
    
    // Restart autoplay when modal closes
    if (autoPlay && api && autoplayPluginRef.current) {
      try {
        if (typeof autoplayPluginRef.current.play === 'function') {
          autoplayPluginRef.current.play();
        }
      } catch (playError) {
        console.warn('[useSlotCarousel] Error restarting autoplay:', playError);
      }
    }
  }, [autoPlay, api]);

  // Enhanced cleanup with proper resource management
  useEffect(() => {
    return () => {
      // Clear any timeouts
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
      
      // Destroy autoplay plugin
      if (autoplayPluginRef.current) {
        try {
          if (typeof autoplayPluginRef.current.destroy === 'function') {
            autoplayPluginRef.current.destroy();
          }
        } catch (error) {
          console.warn('[useSlotCarousel] Error during cleanup:', error);
        } finally {
          autoplayPluginRef.current = null;
        }
      }
      
      // Clear refs
      slidesRef.current = [];
      previousCityRef.current = null;
    };
  }, []);

  // Auto-start carousel after mount
  useEffect(() => {
    if (api && autoplayPluginRef.current && autoPlay && slides.length > 1) {
      intervalRef.current = setTimeout(() => {
        try {
          if (typeof autoplayPluginRef.current.play === 'function') {
            autoplayPluginRef.current.play();
          }
        } catch (error) {
          console.warn('[useSlotCarousel] Error starting autoplay:', error);
        }
      }, 1000); // Delay to ensure carousel is fully mounted
    }
    
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [api, autoPlay, slides.length]);

  return {
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
  };
};
