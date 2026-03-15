import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import BusinessImageUploader from "../business/BusinessImageUploader";
import confetti from 'canvas-confetti';
import { addDeal } from "@/utils/dealData";
import { Deal, DealTier } from "@/types/deal";
import DealInformation from "./form-sections/DealInformation";
import PricingSection from "./form-sections/PricingSection";
import LocationContact from "./form-sections/LocationContact";
import DealTierSelection from "./form-sections/DealTierSelection";
import ZipCodeSelector from "./form-sections/ZipCodeSelector";
import TagsSection from "./form-sections/TagsSection";
import TierPaymentDialog from "./form-sections/TierPaymentDialog";
import { ALL_CITIES } from "@/utils/cityData";
import { getPricingForCity, isMetroCity, MAX_IMAGES, IMAGE_CHANGE_POLICY, ZIP_CODE_LIMITS } from "@/utils/metroCities";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Video, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";

const cities = ALL_CITIES;

interface DealUploadFormProps {
  initialTier?: DealTier;
  onTierChange?: (tier: DealTier) => void;
}

const DealUploadForm = ({ initialTier = 'standard', onTierChange }: DealUploadFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  
  const [dealData, setDealData] = useState({
    title: "",
    description: "",
    category: "",
    originalPrice: "",
    discountedPrice: "",
    discount: 0,
    location: "",
    city: "",
    phone: "",
    expiryDate: "",
    tags: [] as string[],
    tier: initialTier as DealTier,
  });
  
  const [images, setImages] = useState<string[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [zipCodes, setZipCodes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [imagesLocked, setImagesLocked] = useState(false);

  // Sync tier when initialTier changes from parent
  React.useEffect(() => {
    if (initialTier !== dealData.tier) {
      setDealData(prev => ({ ...prev, tier: initialTier }));
      if (initialTier === 'citywide') {
        setZipCodes([]);
      }
    }
  }, [initialTier]);

  // Calculate pricing based on selected city
  const currentPricing = dealData.city ? getPricingForCity(dealData.city) : getPricingForCity('');
  const isMetro = dealData.city ? isMetroCity(dealData.city) : false;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "originalPrice" || name === "discountedPrice") {
      const originalPrice = name === "originalPrice" ? parseFloat(value) : parseFloat(dealData.originalPrice);
      const discountedPrice = name === "discountedPrice" ? parseFloat(value) : parseFloat(dealData.discountedPrice);
      
      if (!isNaN(originalPrice) && !isNaN(discountedPrice) && originalPrice > 0) {
        const discountPercentage = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
        setDealData(prev => ({ 
          ...prev, 
          [name]: value,
          discount: discountPercentage >= 0 ? discountPercentage : 0
        }));
      } else {
        setDealData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setDealData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setDealData(prev => ({ ...prev, [name]: value }));
  };

  const handleExpiryDateChange = (date: Date | undefined) => {
    setExpiryDate(date);
    if (date) {
      setDealData(prev => ({ 
        ...prev, 
        expiryDate: date.toLocaleDateString() 
      }));
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !dealData.tags.includes(tagInput.trim())) {
      setDealData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setDealData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleTierChange = (tier: DealTier) => {
    setDealData(prev => ({ ...prev, tier }));
    // Clear zip codes if switching to city-wide or video
    if (tier === 'citywide' || tier === 'video') {
      setZipCodes([]);
    }
    // Clear video if switching away from video tier
    if (tier !== 'video') {
      setVideoFile(null);
      setVideoPreviewUrl(null);
    }
    // Notify parent of tier change
    if (onTierChange) {
      onTierChange(tier);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      toast({ title: "Invalid file", description: "Please upload a video file", variant: "destructive" });
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast({ title: "File too large", description: "Video must be under 50MB", variant: "destructive" });
      return;
    }
    setVideoFile(file);
    setVideoPreviewUrl(URL.createObjectURL(file));
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreviewUrl(null);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const handleDiscountChange = (discountValue: number) => {
    setDealData(prev => ({ ...prev, discount: discountValue }));
  };

  const calculatePrice = () => {
    return currentPricing[dealData.tier];
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dealData.title || !dealData.description || !dealData.category || 
        !dealData.originalPrice || !dealData.city) {
      scrollToTop();
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Video tier requires video, others require images
    if (dealData.tier === 'video') {
      if (!videoFile) {
        scrollToTop();
        toast({
          title: "Video Required",
          description: "Please upload a video for your video reel deal",
          variant: "destructive",
        });
        return;
      }
    } else if (images.length === 0) {
      scrollToTop();
      toast({
        title: "Image Required",
        description: "Please upload at least one image for your deal",
        variant: "destructive",
      });
      return;
    }

    // Validate zip codes based on tier
    const zipLimits = ZIP_CODE_LIMITS[dealData.tier];
    if (dealData.tier !== 'citywide' && dealData.tier !== 'video' && zipCodes.length < zipLimits.min) {
      scrollToTop();
      toast({
        title: "Zip Codes Required",
        description: `Please add at least ${zipLimits.min} zip code${zipLimits.min > 1 ? 's' : ''} for this tier`,
        variant: "destructive",
      });
      return;
    }
    
    setShowPaymentDialog(true);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handlePaymentAndSubmit = () => {
    setIsProcessingPayment(true);
    
    try {
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

      const newDeal: Partial<Deal> = {
        id: Date.now(),
        title: dealData.title,
        description: dealData.description,
        category: dealData.category,
        originalPrice: parseFloat(dealData.originalPrice),
        discountedPrice: dealData.discountedPrice ? parseFloat(dealData.discountedPrice) : undefined,
        discount: dealData.discount || undefined,
        location: dealData.location,
        city: dealData.city,
        zipCodes: (dealData.tier !== 'citywide' && dealData.tier !== 'video') ? zipCodes : undefined,
        phone: dealData.phone || undefined,
        expiryDate: dealData.expiryDate || undefined,
        tags: dealData.tags,
        image: dealData.tier === 'video' ? '/placeholder.svg' : images[0],
        images: dealData.tier === 'video' ? [] : images,
        rating: 0,
        featured: dealData.tier === 'highlight' || dealData.tier === 'citywide' || dealData.tier === 'video',
        tier: dealData.tier,
        isMetroCity: isMetro,
        uploadedBy: currentUser?.name,
        subscriptionStartDate: startDate.toISOString(),
        subscriptionEndDate: endDate.toISOString(),
        subscriptionPrice: calculatePrice(),
        isActive: true,
      };
      
      setTimeout(() => {
        try {
          addDeal(newDeal as Deal);
          
          // If video tier, save video as reel
          if (dealData.tier === 'video' && videoPreviewUrl) {
            const newReel = {
              id: `deal-video-${Date.now()}`,
              url: videoPreviewUrl,
              user: currentUser?.name || "Business",
              likes: 0,
              caption: `${dealData.title} - ${dealData.description}`,
              directionsUrl: undefined,
              phoneNumber: dealData.phone || undefined,
              isLiked: false,
              city: dealData.city,
            };
            
            // Save to localStorage for reels
            try {
              const existingReels = JSON.parse(localStorage.getItem('videoReels') || '[]');
              existingReels.unshift(newReel);
              localStorage.setItem('videoReels', JSON.stringify(existingReels));
            } catch (e) {
              console.error('Error saving reel:', e);
            }
            
            // Send notification to city users
            try {
              const notifications = JSON.parse(localStorage.getItem('dealNotifications') || '[]');
              notifications.unshift({
                id: `video-notif-${Date.now()}`,
                type: 'new_deal',
                title: `🎬 New Video Deal in ${dealData.city}!`,
                message: `${dealData.title} - Check it out in Reels!`,
                city: dealData.city,
                dealId: newDeal.id,
                isVideoReel: true,
                timestamp: new Date().toISOString(),
                read: false,
              });
              localStorage.setItem('dealNotifications', JSON.stringify(notifications));
            } catch (e) {
              console.error('Error saving notification:', e);
            }
          }
          
          setIsProcessingPayment(false);
          setShowPaymentDialog(false);
          setIsSubmitting(false);
          
          triggerConfetti();
          
          toast({
            title: dealData.tier === 'video' ? "Video Reel Deal Created!" : "Deal Created Successfully!",
            description: dealData.tier === 'video' 
              ? "Your video reel is now live and notification sent to city users" 
              : "Your deal has been posted and is now live",
          });
          
          navigate(dealData.tier === 'video' ? "/reels" : "/");
        } catch (error) {
          console.error('Error adding deal:', error);
          setIsProcessingPayment(false);
          toast({
            title: "Error Creating Deal",
            description: "Please try again",
            variant: "destructive",
          });
        }
      }, 1500);
    } catch (error) {
      console.error('Payment processing error:', error);
      setIsProcessingPayment(false);
      toast({
        title: "Payment Error",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <DealInformation
        title={dealData.title}
        description={dealData.description}
        category={dealData.category}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
      />
      
      <PricingSection
        originalPrice={dealData.originalPrice}
        discountedPrice={dealData.discountedPrice}
        discount={dealData.discount}
        onInputChange={handleInputChange}
        onDiscountChange={handleDiscountChange}
      />
      
      {dealData.tier === 'video' ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Deal Video</h2>
          <p className="text-sm text-muted-foreground">Upload a video for your reel deal (max 50MB)</p>
          
          {videoPreviewUrl ? (
            <div className="relative">
              <video 
                src={videoPreviewUrl} 
                className="w-full max-h-[300px] rounded-lg object-contain bg-black" 
                controls 
                muted
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={removeVideo}
              >
                Remove
              </Button>
            </div>
          ) : (
            <div 
              className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => videoInputRef.current?.click()}
            >
              <Video className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-foreground">Click to upload video</p>
              <p className="text-xs text-muted-foreground mt-1">MP4, MOV, WebM supported</p>
            </div>
          )}
          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleVideoUpload}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Deal Images</h2>
          <p className="text-sm text-muted-foreground">Upload at least one image of your deal (max 5 images)</p>
          
          <BusinessImageUploader 
            images={images}
            setImages={setImages}
            maxImages={5}
          />
        </div>
      )}
      
      <LocationContact
        location={dealData.location}
        city={dealData.city}
        phone={dealData.phone}
        expiryDate={expiryDate}
        cities={cities}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
        onExpiryDateChange={handleExpiryDateChange}
      />

      {dealData.tier !== 'video' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Target Area (Zip Codes)</h2>
          <ZipCodeSelector
            tier={dealData.tier}
            zipCodes={zipCodes}
            onZipCodesChange={setZipCodes}
          />
        </div>
      )}
      
      <TagsSection
        tags={dealData.tags}
        tagInput={tagInput}
        setTagInput={setTagInput}
        handleTagInputKeyDown={handleTagInputKeyDown}
        addTag={addTag}
        removeTag={removeTag}
      />
      
      <div className="pt-4 bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-800">Total Cost</h3>
            <p className="text-sm text-blue-700 mt-1">
              Your {dealData.tier} deal will cost ₹{calculatePrice()} (all taxes included)
              {isMetro && <span className="ml-1 text-xs">(Metro City Pricing)</span>}
            </p>
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t">
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating Deal..." : "Continue to Payment"}
        </Button>
      </div>
      
      <TierPaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        tier={dealData.tier}
        price={calculatePrice()}
        isMetro={isMetro}
        zipCodeCount={zipCodes.length}
        isProcessingPayment={isProcessingPayment}
        onCancel={() => setShowPaymentDialog(false)}
        onConfirm={handlePaymentAndSubmit}
      />
    </form>
  );
};

export default DealUploadForm;
