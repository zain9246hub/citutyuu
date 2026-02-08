
import React, { useMemo } from "react";
import SlotSection from "./SlotSection";
import { Skeleton } from "@/components/ui/skeleton";

interface SlotSectionsProps {
  onViewAllBanners: () => void;
  onBookSlot: (e: React.MouseEvent) => void;
  isLoading?: boolean;
  selectedCity?: string | null;
}

const SlotSections: React.FC<SlotSectionsProps> = ({ 
  onViewAllBanners, 
  onBookSlot,
  isLoading = false,
  selectedCity
}) => {
  // Stable skeleton elements
  const skeletonElements = useMemo(() => (
    <div className="space-y-6 animate-fade-in">
      {[1, 2].map((index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </div>
      ))}
    </div>
  ), []);

  if (isLoading) {
    return skeletonElements;
  }

  console.log('[SlotSections] Rendering with selectedCity:', selectedCity);
  
  return (
    <div className="animate-fade-in">
      <SlotSection 
        position={2}
        title="Featured Slots"
        subtitle="Ending soon - book now"
        onViewAll={onViewAllBanners}
        onBook={onBookSlot}
        showSparkles={true}
        selectedCity={selectedCity}
      />
      
      <SlotSection 
        position={1}
        title="Featured Slots"
        subtitle="Available 24/7"
        onViewAll={onViewAllBanners}
        onBook={onBookSlot}
        selectedCity={selectedCity}
      />
    </div>
  );
};

// Remove React.memo to ensure re-renders happen
export default SlotSections;
