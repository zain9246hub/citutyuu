import React, { useState, useRef } from "react";
import { Image, X, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BusinessImageUploaderProps {
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  maxImages?: number;
}

// Compress image to reduce storage size
const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.6): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Scale down if larger than maxWidth
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to compressed JPEG
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

const BusinessImageUploader = ({
  images,
  setImages,
  maxImages = 15,
}: BusinessImageUploaderProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
    
    try {
      // Compress images to reduce storage size
      const compressedImages: string[] = [];
      for (const file of Array.from(files)) {
        try {
          const compressed = await compressImage(file, 600, 0.5); // Smaller size, lower quality
          compressedImages.push(compressed);
        } catch (err) {
          console.error('Failed to compress image:', err);
          // Fallback to original if compression fails
          const reader = new FileReader();
          const result = await new Promise<string>((resolve) => {
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(file);
          });
          compressedImages.push(result);
        }
      }
      
      setImages([...images, ...compressedImages]);
      console.log('Images uploaded and compressed:', compressedImages.length);
      
    } catch (error) {
      console.error('Error processing images:', error);
      toast({
        title: "Upload Error",
        description: "Failed to process images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
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
            className="relative aspect-square rounded-lg overflow-hidden bg-muted"
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
            className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg aspect-square hover:bg-muted/50"
          >
            {uploading ? (
              <div className="flex flex-col items-center">
                <div className="w-5 h-5 border-2 border-t-primary border-primary/20 rounded-full animate-spin mb-2"></div>
                <span className="text-xs text-muted-foreground">Compressing...</span>
              </div>
            ) : (
              <>
                <Camera className="h-6 w-6 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">Add Photo</span>
              </>
            )}
          </button>
        )}
      </div>
      
      <div className="text-xs text-muted-foreground flex items-center">
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
