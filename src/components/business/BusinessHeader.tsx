
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BusinessHeaderProps {
  handleSaveBusiness: () => void;
  handleShareBusiness: () => void;
}

const BusinessHeader = ({ handleSaveBusiness, handleShareBusiness }: BusinessHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 bg-background/90 backdrop-blur-md border-b">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleSaveBusiness}
        >
          <Heart className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleShareBusiness}
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default BusinessHeader;
