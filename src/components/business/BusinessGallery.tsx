
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BusinessGalleryProps {
  images: string[];
  activeImageIndex: number;
  setActiveImageIndex: (index: number) => void;
}

const BusinessGallery = ({ 
  images, 
  activeImageIndex, 
  setActiveImageIndex 
}: BusinessGalleryProps) => {
  const nextImage = () => {
    setActiveImageIndex((activeImageIndex + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((activeImageIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="relative">
      <div className="aspect-[4/3] relative overflow-hidden">
        <img 
          src={images[activeImageIndex]} 
          alt="Business" 
          className="w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 h-8 w-8"
          onClick={prevImage}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 h-8 w-8"
          onClick={nextImage}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
        
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
          <div className="flex gap-1.5">
            {images.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full ${activeImageIndex === i ? 'w-3 bg-white' : 'w-1.5 bg-white/50'}`}
                onClick={() => setActiveImageIndex(i)}
              />
            ))}
          </div>
        </div>
      </div>
      
      <ScrollArea className="bg-gray-50 whitespace-nowrap overflow-x-auto py-2">
        <div className="flex pl-4 gap-2">
          {images.map((img, i) => (
            <div 
              key={i} 
              className={`h-12 w-20 flex-shrink-0 cursor-pointer rounded overflow-hidden border-2 transition-all ${activeImageIndex === i ? 'border-primary' : 'border-transparent'}`} 
              onClick={() => setActiveImageIndex(i)}
            >
              <img 
                src={img} 
                alt={`Thumbnail ${i}`} 
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default BusinessGallery;
