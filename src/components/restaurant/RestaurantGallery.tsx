
import React from "react";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RestaurantGalleryProps {
  images: string[];
  activeImageIndex: number;
  setActiveImageIndex: (index: number) => void;
}

const RestaurantGallery = ({ 
  images, 
  activeImageIndex, 
  setActiveImageIndex 
}: RestaurantGalleryProps) => {
  return (
    <div className="relative h-64 overflow-hidden">
      <img 
        src={images[activeImageIndex]} 
        alt="Restaurant" 
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {images.map((_, index) => (
          <button 
            key={index}
            className={`w-2 h-2 rounded-full ${index === activeImageIndex ? 'bg-white' : 'bg-white/50'}`}
            onClick={() => setActiveImageIndex(index)}
          />
        ))}
      </div>
      <div className="absolute top-4 right-4">
        <Badge className="bg-white/90 text-black hover:bg-white/70">
          4.8 <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 ml-1" />
        </Badge>
      </div>
    </div>
  );
};

export default RestaurantGallery;
