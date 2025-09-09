
import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SlotHeaderProps {
  position: number;
  totalSlots: number;
  onViewAll?: () => void;
  showViewAll?: boolean;
}

const SlotHeader: React.FC<SlotHeaderProps> = ({
  position,
  totalSlots,
  onViewAll,
  showViewAll = false,
}) => {
  const { currentUser } = useAuth();
  const isBusinessUser = currentUser?.role === 'business';
  const isExplorer = currentUser?.role === 'explorer';
  
  return (
    <div className="flex items-center mb-1">
      <h3 className="text-sm font-medium">Position {position} Slots</h3>
      {isBusinessUser && (
        <span className="ml-2 text-xs bg-green-50 text-green-600 rounded-full px-2 py-0.5 animate-pulse">
          🟢 1 slot left - Book now!
        </span>
      )}
      
      {showViewAll && (
        <div className="absolute right-4 top-0 z-10">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-1 text-blue-600 h-auto p-0"
            onClick={onViewAll}
          >
            View All <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default React.memo(SlotHeader);
