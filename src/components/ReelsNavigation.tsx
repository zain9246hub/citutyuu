
import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReelsNavigationProps {
  currentReelIndex: number;
  reelsCount: number;
  onPrevReel: () => void;
  onNextReel: () => void;
}

const ReelsNavigation = ({
  currentReelIndex,
  reelsCount,
  onPrevReel,
  onNextReel,
}: ReelsNavigationProps) => {
  return (
    <div className="flex justify-center items-center gap-20 pb-16 pointer-events-auto">
      {currentReelIndex > 0 && (
        <Button
          onClick={onPrevReel}
          variant="ghost"
          size="icon"
          className="rounded-full bg-white/20 hover:bg-white/30"
        >
          <ChevronUp className="h-6 w-6 text-white" />
        </Button>
      )}
      
      {currentReelIndex < reelsCount - 1 && (
        <Button
          onClick={onNextReel}
          variant="ghost"
          size="icon"
          className="rounded-full bg-white/20 hover:bg-white/30"
        >
          <ChevronDown className="h-6 w-6 text-white" />
        </Button>
      )}
    </div>
  );
};

export default ReelsNavigation;
