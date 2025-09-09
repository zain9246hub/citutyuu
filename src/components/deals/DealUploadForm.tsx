import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import BusinessImageUploader from "../business/BusinessImageUploader";
import confetti from 'canvas-confetti';
import { addDeal } from "@/utils/dealData";
import { Deal } from "@/types/deal";
import DealInformation from "./form-sections/DealInformation";
import PricingSection from "./form-sections/PricingSection";
import LocationContact from "./form-sections/LocationContact";
import TagsFeatures from "./form-sections/TagsFeatures";
import DurationPromotion from "./form-sections/DurationPromotion";
import PaymentDialog from "./form-sections/PaymentDialog";
import { ALL_CITIES } from "@/utils/cityData";

const durationOptions = [
  { days: 3, label: "3 days", baseCost: 120, featuredCost: 200 },
  { days: 7, label: "7 days", baseCost: 120, featuredCost: 200 },
  { days: 15, label: "15 days", baseCost: 200, featuredCost: 300 },
  { days: 30, label: "30 days", baseCost: 350, featuredCost: 450 }
];

const cities = ALL_CITIES;

const DealUploadForm = () => {
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
    isFeatured: false,
    duration: 7,
  });
  
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
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

  const calculatePrice = () => {
    const selectedDuration = durationOptions.find(option => option.days === dealData.duration);
    if (!selectedDuration) return dealData.isFeatured ? 320 : 120;
    
    return dealData.isFeatured 
      ? selectedDuration.baseCost + selectedDuration.featuredCost 
      : selectedDuration.baseCost;
  };

  const handleDurationChange = (duration: number) => {
    setDealData(prev => ({ ...prev, duration }));
  };

  const handleDiscountChange = (discountValue: number) => {
    setDealData(prev => ({ ...prev, discount: discountValue }));
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
        phone: dealData.phone || undefined,
        expiryDate: dealData.expiryDate || undefined,
        tags: dealData.tags,
        image: images[0],
        rating: 0,
        featured: dealData.isFeatured,
        duration: dealData.duration,
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
      
      <TagsFeatures
        tags={dealData.tags}
        tagInput={tagInput}
        isFeatured={dealData.isFeatured}
        calculatePrice={calculatePrice}
        setTagInput={setTagInput}
        handleTagInputKeyDown={handleTagInputKeyDown}
        addTag={addTag}
        removeTag={removeTag}
        onFeaturedChange={(checked) => 
          setDealData(prev => ({ ...prev, isFeatured: checked }))
        }
      />
      
      <DurationPromotion
        duration={dealData.duration}
        isFeatured={dealData.isFeatured}
        durationOptions={durationOptions}
        onDurationChange={handleDurationChange}
        calculatePrice={calculatePrice}
      />
      
      <div className="pt-4 border-t">
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating Deal..." : "Continue to Payment"}
        </Button>
      </div>
      
      <PaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        duration={dealData.duration}
        isFeatured={dealData.isFeatured}
        isProcessingPayment={isProcessingPayment}
        durationOptions={durationOptions}
        calculatePrice={calculatePrice}
        onCancel={() => setShowPaymentDialog(false)}
        onConfirm={handlePaymentAndSubmit}
      />
    </form>
  );
};

export default DealUploadForm;
