
import { FC } from "react";
import { Button } from "@/components/ui/button";
import SlotCarousel from "../SlotCarousel";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SlotSectionProps {
  position: number;
  title: string; 
  subtitle?: string;
  onViewAll: () => void;
  onBook: (e: React.MouseEvent) => void;
  showSparkles?: boolean;
  selectedCity?: string | null;
}

const SlotSection: FC<SlotSectionProps> = ({ 
  position,
  title,
  subtitle,
  onViewAll,
  onBook,
  showSparkles = false,
  selectedCity
}) => {
  const { currentUser } = useAuth();
  const isBusinessUser = currentUser?.role === 'business';
  return (
    <div className="mt-6 animate-fade-in transition-all duration-300 hover:translate-y-[-2px]" key={`slot-section-${position}-${selectedCity}`}>
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="text-lg md:text-xl font-semibold flex items-center">
          {showSparkles && (
            <Sparkles className="h-4 w-4 md:h-5 md:w-5 mr-2 text-amber-500 animate-pulse" />
          )}
          <span className="relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary/20 after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
            {title}
          </span>
        </h2>
        {subtitle && (
          <span className="text-sm text-muted-foreground hidden md:inline-block">
            {subtitle}
          </span>
        )}
      </div>
      <div className="relative transform transition-all duration-300 hover:scale-[1.01]">
        <SlotCarousel 
          key={`slot-carousel-${position}-${selectedCity}`}
          position={position}
          onViewAll={onViewAll}
          showViewAll={true}
          showBookButton={isBusinessUser}
          onBook={onBook}
          selectedCity={selectedCity}
        />
      </div>
    </div>
  );
};

export default SlotSection;
