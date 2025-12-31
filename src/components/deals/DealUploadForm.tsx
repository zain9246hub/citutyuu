import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
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
import { AlertCircle } from "lucide-react";

const cities = ALL_CITIES;

interface DealUploadFormProps {
  initialTier?: DealTier;
  onTierChange?: (tier: DealTier) => void;
}

const DealUploadForm = ({ initialTier = 'standard', onTierChange }: DealUploadFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
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
    // Clear zip codes if switching to city-wide
    if (tier === 'citywide') {
      setZipCodes([]);
    }
    // Notify parent of tier change
    if (onTierChange) {
      onTierChange(tier);
    }
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
    
    if (images.length === 0) {
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
    if (dealData.tier !== 'citywide' && zipCodes.length < zipLimits.min) {
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
        zipCodes: dealData.tier !== 'citywide' ? zipCodes : undefined,
        phone: dealData.phone || undefined,
        expiryDate: dealData.expiryDate || undefined,
        tags: dealData.tags,
        image: images[0],
        images: images,
        rating: 0,
        featured: dealData.tier === 'highlight' || dealData.tier === 'citywide',
        tier: dealData.tier,
        isMetroCity: isMetro,
      };
      
      setTimeout(() => {
        try {
          addDeal(newDeal as Deal);
          setIsProcessingPayment(false);
          setShowPaymentDialog(false);
          setIsSubmitting(false);
          
          triggerConfetti();
          
          toast({
            title: "Deal Created Successfully!",
            description: "Your deal has been posted and is now live",
          });
          
          navigate("/");
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
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Deal Images</h2>
        <p className="text-sm text-gray-500">Upload at least one image of your deal (max 5 images)</p>
        
        <BusinessImageUploader 
          images={images}
          setImages={setImages}
          maxImages={5}
        />
      </div>
      
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
