import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { ImagePlus, VideoIcon, Loader2, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import GooglePayButton from "@/components/payment/GooglePayButton";
import { useAdvertisements } from "@/contexts/AdvertisementContext";
import { useAuth } from "@/contexts/AuthContext";

interface SlotBookingFormProps {
  open: boolean;
  onClose: () => void;
  slotId: string;
  location: string;
  onSuccess?: () => void;
}

const SlotBookingForm = ({ open, onClose, slotId, location, onSuccess }: SlotBookingFormProps) => {
  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const { toast } = useToast();
  const { addUploadedAd } = useAdvertisements();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    targetUrl: "",
  });

  // Fixed slot pricing for all positions
  const slotPrice = 500;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 5) {
      toast({
        title: "Too many images",
        description: "You can upload maximum 5 images",
        variant: "destructive",
      });
      return;
    }
    setImages(files);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast({
          title: "File too large",
          description: "Please upload a video smaller than 50MB",
          variant: "destructive",
        });
        return;
      }
      setVideo(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = () => {
    setVideo(null);
    setVideoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!images.length && !video) {
      toast({
        title: "Media required",
        description: "Please upload at least one image or video",
        variant: "destructive",
      });
      return;
    }

    setShowPayment(true);
  };

  const fileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handlePaymentSuccess = async () => {
    setUploading(true);
    setShowPayment(false);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(async () => {
      progress += 10;
      setProgress(progress);
      if (progress === 100) {
        clearInterval(interval);
        
        // Convert uploaded files to data URLs for persistence
        const imageUrl = images.length > 0 ? await fileToDataURL(images[0]) : undefined;
        const videoUrlToSave = video ? await fileToDataURL(video) : undefined;
        
        // Determine position based on slotId or location
        // If location mentions "Premium" it's position 1, otherwise position 2  
        const position = location.toLowerCase().includes('premium') ? 1 : 2;
        
        // Add the uploaded ad to context
        addUploadedAd({
          slotId,
          position,
          location,
          title: formData.title,
          description: formData.description,
          targetUrl: formData.targetUrl,
          imageUrl,
          videoUrl: videoUrlToSave,
          uploadedBy: currentUser?.name || 'Anonymous'
        });
        
        setUploading(false);
        toast({
          title: "Success",
          description: "Your advertisement has been uploaded and is now live!",
        });
        onSuccess?.();
        onClose();
        
        // Reset form
        setImages([]);
        setVideo(null);
        setVideoPreview(null);
        setFormData({ title: "", description: "", targetUrl: "" });
      }
    }, 500);
  };

  const handleGooglePaySuccess = (paymentData: any) => {
    console.log('Google Pay payment successful for slot booking:', paymentData);
    handlePaymentSuccess();
  };

  const handleGooglePayError = (error: any) => {
    console.error('Google Pay payment error:', error);
    toast({
      title: "Payment Failed",
      description: "There was an error processing your payment. Please try again.",
      variant: "destructive",
    });
  };

  const handleTraditionalPayment = () => {
    // Simulate traditional payment processing
    setTimeout(() => {
      handlePaymentSuccess();
    }, 2000);
  };

  if (showPayment) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Complete Payment</DialogTitle>
            <DialogDescription>
              Pay for slot #{slotId} in {location}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-center">
                <span>Slot #{slotId} booking fee:</span>
                <span className="font-medium">₹{slotPrice}</span>
              </div>
              <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between items-center font-medium">
                <span>Total:</span>
                <span>₹{slotPrice}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Payment Options</h3>
              
              <GooglePayButton
                amount={slotPrice}
                currency="INR"
                onPaymentSuccess={handleGooglePaySuccess}
                onPaymentError={handleGooglePayError}
              />

              <div className="flex items-center gap-4">
                <Separator className="flex-1" />
                <span className="text-xs text-gray-500">OR</span>
                <Separator className="flex-1" />
              </div>

              <Button 
                onClick={handleTraditionalPayment}
                variant="outline"
                className="w-full"
              >
                Pay ₹{slotPrice} (Other Methods)
              </Button>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowPayment(false)}>
                Back to Form
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Book Advertisement Slot</DialogTitle>
          <DialogDescription>
            Upload your advertisement content for slot #{slotId} in {location}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Advertisement Title</Label>
            <Input
              placeholder="Enter your advertisement title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Describe your advertisement"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Target URL</Label>
            <Input
              placeholder="https://your-website.com"
              type="url"
              value={formData.targetUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, targetUrl: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Upload Video (Optional, max 50MB)</Label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="hidden"
                id="video-upload"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("video-upload")?.click()}
                className="w-full"
                disabled={!!video}
              >
                <VideoIcon className="w-4 h-4 mr-2" />
                Select Video
              </Button>
            </div>

            {videoPreview && (
              <div className="relative mt-2">
                <video
                  src={videoPreview}
                  className="w-full h-48 object-cover rounded-md"
                  controls
                />
                <button
                  type="button"
                  onClick={removeVideo}
                  className="absolute top-2 right-2 p-1 bg-red-500 rounded-full"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Upload Images {video ? "(Disabled when video is uploaded)" : "(Max 5)"}</Label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
                disabled={!!video}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("image-upload")?.click()}
                className="w-full"
                disabled={!!video}
              >
                <ImagePlus className="w-4 h-4 mr-2" />
                Select Images
              </Button>
            </div>

            {images.length > 0 && !video && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {uploading && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-center text-muted-foreground">
                Uploading... {progress}%
              </p>
            </div>
          )}

          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-700">
              Slot #{slotId} booking fee: ₹{slotPrice}
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading
                </>
              ) : (
                "Continue to Payment"
              )}
            </Button>
          </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SlotBookingForm;
