
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface PricingSectionHeaderProps {
  onReset: () => void;
}

const PricingSectionHeader = ({ onReset }: PricingSectionHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold">Pricing</h2>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onReset}
        className="gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Reset
      </Button>
    </div>
  );
};

export default PricingSectionHeader;
