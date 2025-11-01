import React, { useState, useMemo, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import GooglePayButton from "@/components/payment/GooglePayButton";
import { useAdvertisements } from "@/contexts/AdvertisementContext";
import { useAuth } from "@/contexts/AuthContext";
import { ALL_STATES, getCitiesForState } from "@/utils/cityData";
import BannerTierSelection, { BannerTier } from "./BannerTierSelection";
import BusinessInfoForm, { BusinessInfo } from "./BusinessInfoForm";

interface SlotBookingFormProps {
  open: boolean;
  onClose: () => void;
  slotId: string;
  location: string;
  onSuccess?: () => void;
  isRenewal?: boolean;
  existingAdId?: string;
}

const SlotBookingForm = ({ open, onClose, slotId, location, onSuccess, isRenewal = false, existingAdId }: SlotBookingFormProps) => {
  const [selectedTier, setSelectedTier] = useState<BannerTier>("banner-only");
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const { toast } = useToast();
  const { addUploadedAd, renewAd } = useAdvertisements();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    locationUrl: "",
    websiteUrl: "",
    phoneNumber: "",
  });

  const [businessData, setBusinessData] = useState<BusinessInfo>({
    name: "",
    category: "",
    description: "",
    address: "",
    pincode: "",
    email: "",
    website: "",
    openingTime: "",
    closingTime: "",
    workingDays: [],
    priceRange: "",
    specialFeatures: [],
  });

  // Get available cities based on selected state
  const availableCities = useMemo(() => {
    if (!selectedState || selectedState === "All States") {
      return [];
    }
    return getCitiesForState(selectedState);
  }, [selectedState]);

  // Reset city selection when state changes
  useEffect(() => {
    if (selectedState && selectedState !== "All States" && availableCities.length > 0) {
      if (!availableCities.includes(selectedCity)) {
        setSelectedCity("");
      }
    }
  }, [selectedState, availableCities, selectedCity]);

  // Monthly subscription pricing based on tier
  const slotPrice = selectedTier === "banner-only" ? 3538 : 5900;

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

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!images.length) {
      toast({
        title: "Images required",
        description: "Please upload at least one image",
        variant: "destructive",
      });
      return;
    }

    if (!selectedState || !selectedCity) {
      toast({
        title: "Location required",
        description: "Please select both state and city",
        variant: "destructive",
      });
      return;
    }

    // Additional validation for business tier
    if (selectedTier === "banner-business") {
      if (!businessData.name || !businessData.category || !businessData.description || !businessData.address || !businessData.pincode) {
        toast({
          title: "Business information required",
          description: "Please fill in all required business fields",
          variant: "destructive",
        });
        return;
      }
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
    
    // Handle renewal vs new booking
    if (isRenewal && existingAdId) {
      // Renew existing ad
      setTimeout(() => {
        renewAd(existingAdId);
        setUploading(false);
        toast({
          title: "Subscription Renewed!",
          description: "Your advertisement has been renewed for another 30 days.",
        });
        onSuccess?.();
        onClose();
      }, 1000);
      return;
    }
    
    // Simulate upload progress for new booking
    let progress = 0;
    const interval = setInterval(async () => {
      progress += 10;
      setProgress(progress);
      if (progress === 100) {
        clearInterval(interval);
        
        // Convert uploaded files to data URLs for persistence
        const imageUrl = images.length > 0 ? await fileToDataURL(images[0]) : undefined;
        
        // Use slotId directly as position (slotId is "1" or "2")
        const position = parseInt(slotId) || 1;
        
        // Calculate subscription dates (30 days from now)
        const startDate = new Date();
        const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        
        // Add the uploaded ad to context
        addUploadedAd({
          slotId,
          position,
          location: `${selectedCity}, ${selectedState}`,
          title: formData.title,
          description: formData.description,
          imageUrl,
          locationUrl: formData.locationUrl,
          websiteUrl: formData.websiteUrl,
          phoneNumber: formData.phoneNumber,
          uploadedBy: currentUser?.name || 'Anonymous',
          subscriptionStartDate: startDate.toISOString(),
          subscriptionEndDate: endDate.toISOString(),
          monthlyPrice: slotPrice
        });

        // If business tier, also save business data
        if (selectedTier === "banner-business") {
          const businessId = `business-${Date.now()}`;
          const newBusiness = {
            id: businessId,
            name: businessData.name,
            category: businessData.category,
            rating: 0,
            reviewCount: 0,
            priceRange: businessData.priceRange || "₹₹",
            location: `${businessData.address}, ${selectedCity}, ${selectedState}`,
            city: selectedCity,
            state: selectedState,
            distance: "0.0 km",
            coordinates: { lat: 0, lng: 0 },
            image: imageUrl || "/placeholder.svg",
            images: imageUrl ? [imageUrl] : ["/placeholder.svg"],
            isNew: true,
            isUserSubmitted: true,
            offers: false,
            categories: [businessData.category],
            description: businessData.description,
            phone: formData.phoneNumber,
            email: businessData.email,
            website: businessData.website,
            hours: businessData.workingDays.map(day => ({
              day,
              open: businessData.openingTime || "09:00",
              close: businessData.closingTime || "18:00",
              isOpen: true
            })),
            isOpenNow: true,
            products: [],
            reviews: [],
            features: businessData.specialFeatures,
            socialMedia: {}
          };

          // Save business to localStorage
          try {
            const existingBusinesses = JSON.parse(localStorage.getItem('userBusinesses') || '[]');
            existingBusinesses.unshift(newBusiness);
            localStorage.setItem('userBusinesses', JSON.stringify(existingBusinesses));
          } catch (error) {
            console.error('Error saving business:', error);
          }
        }
        
        setUploading(false);
        const successMessage = selectedTier === "banner-business" 
          ? "Your advertisement is live and your business is now listed on Discover!"
          : "Your advertisement is now live for 30 days!";
        
        toast({
          title: "Success!",
          description: successMessage + " You'll receive a renewal reminder 1 day before expiry.",
        });
        onSuccess?.();
        onClose();
        
        // Reset form
        setImages([]);
        setSelectedState("");
        setSelectedCity("");
        setSelectedTier("banner-only");
        setFormData({ title: "", description: "", locationUrl: "", websiteUrl: "", phoneNumber: "" });
        setBusinessData({
          name: "",
          category: "",
          description: "",
          address: "",
          pincode: "",
          email: "",
          website: "",
          openingTime: "",
          closingTime: "",
          workingDays: [],
          priceRange: "",
          specialFeatures: [],
        });
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
            <DialogTitle>{isRenewal ? 'Renew Subscription' : 'Complete Payment'}</DialogTitle>
            <DialogDescription>
              {isRenewal ? 'Renew your advertisement for another 30 days' : `Monthly subscription for slot in ${location}`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-center">
                <span>{isRenewal ? 'Monthly Renewal' : 'Monthly Subscription'}:</span>
                <span className="font-medium">₹{slotPrice}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Valid for 30 days • Auto-renewal reminder 1 day before expiry
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
            <DialogTitle>{isRenewal ? 'Renew Advertisement' : 'Book Advertisement Slot'}</DialogTitle>
            <DialogDescription>
              {isRenewal 
                ? `Renew your existing advertisement for another 30 days at ₹${slotPrice}/month`
                : 'Choose your plan and upload your advertisement content'
              }
            </DialogDescription>
          </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Tier Selection */}
          {!isRenewal && (
            <BannerTierSelection
              selectedTier={selectedTier}
              onTierChange={setSelectedTier}
            />
          )}

          <Separator />
          
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
            <Label>Location URL</Label>
            <Input
              type="url"
              placeholder="https://maps.google.com/?q=your+business+address"
              value={formData.locationUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, locationUrl: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Website URL</Label>
            <Input
              type="url"
              placeholder="https://your-business-website.com"
              value={formData.websiteUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.phoneNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>State</Label>
            <Select value={selectedState} onValueChange={setSelectedState} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a state" />
              </SelectTrigger>
              <SelectContent>
                {ALL_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>City</Label>
            <Select 
              value={selectedCity} 
              onValueChange={setSelectedCity}
              disabled={!selectedState || selectedState === "All States"}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder={selectedState ? "Select a city" : "Select state first"} />
              </SelectTrigger>
              <SelectContent>
                {availableCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Upload Images (Max 5)</Label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("image-upload")?.click()}
                className="w-full"
                
              >
                <ImagePlus className="w-4 h-4 mr-2" />
                Select Images
              </Button>
            </div>

            {images.length > 0 && (
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

          {/* Business Information for Banner + Business tier */}
          {selectedTier === "banner-business" && (
            <>
              <Separator />
              <BusinessInfoForm
                businessData={businessData}
                onChange={(updates) => setBusinessData(prev => ({ ...prev, ...updates }))}
              />
            </>
          )}

          {uploading && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-center text-muted-foreground">
                Uploading... {progress}%
              </p>
            </div>
          )}

          <div className="bg-blue-50 p-3 rounded-md space-y-1">
            <p className="text-sm text-blue-700 font-medium">
              Monthly Subscription: ₹{slotPrice}
            </p>
            <p className="text-xs text-blue-600">
              • Valid for 30 days from payment
            </p>
            <p className="text-xs text-blue-600">
              • Renewal reminder sent 1 day before expiry
            </p>
            <p className="text-xs text-blue-600">
              • Easy one-click renewal option
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
