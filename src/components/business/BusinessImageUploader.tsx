
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Image, X, Camera, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BusinessImageUploaderProps {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  maxImages?: number;
}

const BusinessImageUploader = ({
  images,
  setImages,
  maxImages = 5,
}: BusinessImageUploaderProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    
    if (!files || files.length === 0) return;
    
    if (images.length + files.length > maxImages) {
      toast({
        title: "Maximum images reached",
        description: `You can upload up to ${maxImages} images`,
        variant: "destructive",
      });
      return;
    }
    
    setUploading(true);
    
    // Convert files to base64 for localStorage persistence
    const filePromises = Array.from(files).map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    });
    
    Promise.all(filePromises).then(base64Images => {
      setImages([...images, ...base64Images]);
      setUploading(false);
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      console.log('Images uploaded:', base64Images.length);
    });
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {images.map((image, index) => (
          <div 
            key={index} 
            className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
          >
            <img 
              src={image} 
              alt={`Business image ${index + 1}`} 
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full hover:bg-black"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        
        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg aspect-square hover:bg-gray-50"
          >
            {uploading ? (
              <div className="flex flex-col items-center">
                <div className="w-5 h-5 border-2 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-2"></div>
                <span className="text-xs text-gray-500">Uploading...</span>
              </div>
            ) : (
              <>
                <Camera className="h-6 w-6 text-gray-400 mb-1" />
                <span className="text-xs text-gray-500">Add Photo</span>
              </>
            )}
          </button>
        )}
      </div>
      
      <div className="text-xs text-gray-500 flex items-center">
        <Image className="h-4 w-4 mr-1" />
        {images.length} of {maxImages} images
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageSelect}
        accept="image/*"
        multiple
        className="hidden"
      />
    </div>
  );
};

export default BusinessImageUploader;
