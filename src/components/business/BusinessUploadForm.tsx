import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import BusinessImageUploader from "./BusinessImageUploader";
import ProductServiceUploader from "./ProductServiceUploader";
import { categoryOptions } from "@/components/filters/FilterOptions";
import { MapPin } from "lucide-react";
import { STATES_WITH_ALL, getCitiesForState } from "@/utils/indiaGeo";
import { cleanupStorage, safeSetItem, getStorageUsage } from "@/utils/storageUtils";

interface ProductService {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
}

const BusinessUploadForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [businessData, setBusinessData] = useState({
    name: "",
    category: "",
    description: "",
    address: "",
    state: "",
    city: "",
    pincode: "",
    phone: "",
    email: "",
    website: "",
    locationUrl: "",
    openingTime: "",
    closingTime: "",
    workingDays: [] as string[],
    priceRange: "",
    hasOffers: false,
    specialFeatures: [] as string[],
    products: [] as Array<{id: string, name: string, description: string, price: string, image: string}>,
    services: [] as Array<{id: string, name: string, description: string, price: string, image: string}>,
  });
  
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStep, setSubmissionStep] = useState("");
  
  // Get cities based on selected state
  const availableCities = getCitiesForState(businessData.state);
  
  const priceRanges = [
    { label: "₹ (Budget)", value: "₹" },
    { label: "₹₹ (Moderate)", value: "₹₹" },
    { label: "₹₹₹ (Expensive)", value: "₹₹₹" },
    { label: "₹₹₹₹ (Premium)", value: "₹₹₹₹" }
  ];
  
  const features = [
    "Parking Available", "Wifi", "Outdoor Seating", 
    "Pet Friendly", "Wheelchair Accessible", "Home Delivery",
    "24x7 Service", "Online Booking"
  ];

  
  const days = [
    "Monday", "Tuesday", "Wednesday", "Thursday", 
    "Friday", "Saturday", "Sunday"
  ];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBusinessData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (feature: string, checked: boolean) => {
    setBusinessData((prev) => ({
      ...prev,
      specialFeatures: checked 
        ? [...prev.specialFeatures, feature]
        : prev.specialFeatures.filter(f => f !== feature)
    }));
  };
  
  const handleDayChange = (day: string, checked: boolean) => {
    setBusinessData((prev) => ({
      ...prev,
      workingDays: checked
        ? [...prev.workingDays, day] 
        : prev.workingDays.filter(d => d !== day)
    }));
  };

  
  const handleSelectChange = (name: string, value: string) => {
    setBusinessData((prev) => {
      const updated = { ...prev, [name]: value };
      // Reset city when state changes
      if (name === 'state') {
        updated.city = '';
      }
      return updated;
    });
  };
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔥 [DEBUG] Form submission started');
    console.log('🔥 [DEBUG] Event details:', e.type, e.target);
    console.log('🔥 [DEBUG] Current user:', currentUser);
    console.log('🔥 [DEBUG] Business data:', businessData);
    console.log('🔥 [DEBUG] Images:', images);
    
    try {
      setSubmissionStep("Starting validation...");
      console.log('🔥 [DEBUG] Step: Starting validation');
      
      // Check authentication
      if (!currentUser) {
        console.log('🔥 [DEBUG] Authentication failed - no current user');
        toast({
          title: "Authentication Required",
          description: "Please log in to submit a business",
          variant: "destructive",
        });
        return;
      }
      
      // Validation with debug mode bypass
      const missingFields = [];
      if (!businessData.name) missingFields.push('Business Name');
      if (!businessData.category) missingFields.push('Category');
      if (!businessData.description) missingFields.push('Description');
      if (!businessData.address) missingFields.push('Address');
      if (!businessData.state) missingFields.push('State');
      if (!businessData.city) missingFields.push('City');
      if (!businessData.phone) missingFields.push('Phone');
      
      if (missingFields.length > 0) {
        console.log('Validation failed - missing fields:', missingFields);
        setSubmissionStep("Validation failed");
        scrollToTop();
        toast({
          title: "Missing Information",
          description: `Please fill in: ${missingFields.join(', ')}`,
          variant: "destructive",
        });
        return;
      }
      
      if (images.length === 0) {
        console.log('Validation failed - no images');
        setSubmissionStep("Image validation failed");
        scrollToTop();
        toast({
          title: "Images Required",
          description: "Please upload at least one business image",
          variant: "destructive",
        });
        return;
      }
      
      console.log('🔥 [DEBUG] Validation passed, starting submission');
      setSubmissionStep("Validation passed, preparing data...");
      setIsSubmitting(true);
      
      // Simulate network delay for testing
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSubmissionStep("Creating business object...");
      console.log('🔥 [DEBUG] Creating business object');
      
      const businessId = `user-${Date.now()}`;
      const subscriptionStartDate = new Date();
      const subscriptionEndDate = new Date(subscriptionStartDate.getTime() + 30 * 24 * 60 * 60 * 1000);

      const newBusiness = {
        id: businessId,
        name: businessData.name || "Test Business",
        category: businessData.category || "Restaurant",
        rating: 4.0,
        reviewCount: 0,
        priceRange: businessData.priceRange || "₹₹",
        location: `${businessData.address || "Test Address"}, ${businessData.city || "Mumbai"}, ${businessData.state || "Maharashtra"}`,
        city: businessData.city || "Mumbai",
        state: businessData.state || "Maharashtra",
        distance: "0.0 km",
        coordinates: { lat: 19.0760, lng: 72.8777 },
        image: images[0] || "/placeholder.svg",
        images: images.length > 0 ? images : ["/placeholder.svg"],
        isNew: true,
        isUserSubmitted: true,
        offers: businessData.hasOffers,
        categories: [businessData.category || "Restaurant"],
        description: businessData.description || "Test description",
        phone: businessData.phone || "+91 98765 43210",
        email: businessData.email || "",
        website: businessData.website || "",
        locationUrl: (businessData as any).locationUrl || "",
        uploadedBy: currentUser?.name,
        subscriptionStartDate: subscriptionStartDate.toISOString(),
        subscriptionEndDate: subscriptionEndDate.toISOString(),
        subscriptionPrice: 999,
        hours: businessData.workingDays.length > 0 ? businessData.workingDays.map(day => ({
          day,
          open: businessData.openingTime || "09:00",
          close: businessData.closingTime || "18:00",
          isOpen: true
        })) : [],
        isOpenNow: true,
        products: businessData.products || [],
        reviews: [],
        features: businessData.specialFeatures || [],
        socialMedia: {}
      };
      
      setSubmissionStep("Saving to localStorage...");
      console.log('🔥 [DEBUG] Business object created:', newBusiness);
      
      // Save to localStorage with improved quota management
      try {
        console.log('🔥 [DEBUG] Starting localStorage save process...');
        
        // Check localStorage availability
        if (typeof(Storage) === "undefined") {
          throw new Error('Browser does not support localStorage');
        }

        // Run cleanup first to free space
        cleanupStorage();
        
        const usage = getStorageUsage();
        console.log(`🔥 [DEBUG] Storage usage: ${(usage.used / 1024).toFixed(2)}KB (${usage.percentage.toFixed(1)}%)`);

        // Get existing businesses, keep only 2 most recent
        let existingBusinesses = [];
        try {
          const stored = localStorage.getItem('userBusinesses');
          if (stored) {
            const parsed = JSON.parse(stored);
            existingBusinesses = Array.isArray(parsed) ? parsed.slice(0, 2) : [];
          }
        } catch (parseError) {
          console.warn('🔥 [DEBUG] Parse error, starting fresh:', parseError);
          existingBusinesses = [];
        }

        // Add new business at the beginning
        existingBusinesses.unshift(newBusiness);
        
        // Try to save
        const finalData = JSON.stringify(existingBusinesses);
        console.log('🔥 [DEBUG] Final data size:', (finalData.length / 1024).toFixed(2), 'KB');
        
        const saved = safeSetItem('userBusinesses', finalData);
        
        if (saved) {
          console.log('🔥 [DEBUG] Business saved successfully');
          window.dispatchEvent(new Event('businessUpdated'));
        } else {
          // Last resort: save only the new business without images
          const minimalBusiness = {
            ...newBusiness,
            images: ['/placeholder.svg'],
            image: '/placeholder.svg',
            products: [],
          };
          localStorage.removeItem('userBusinesses');
          localStorage.setItem('userBusinesses', JSON.stringify([minimalBusiness]));
          window.dispatchEvent(new Event('businessUpdated'));
          
          toast({
            title: "⚠️ Storage Limited",
            description: "Business saved with reduced data. Consider clearing browser storage.",
            variant: "default",
          });
        }
        
      } catch (storageError) {
        console.error('🔥 [DEBUG] Storage error:', storageError);
        toast({
          title: "Storage Warning",
          description: "Business created but storage is full. Clear browser data to fix.",
          variant: "default",
        });
      }
      
      setSubmissionStep("Success! Preparing redirect...");
      
      // Success feedback
      toast({
        title: "✅ Business Added Successfully!",
        description: `${businessData.name || 'Your business'} is now live and visible to customers`,
      });
      
      console.log('🔥 [DEBUG] Success toast shown, preparing navigation');
      
      // Small delay to ensure user sees success message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmissionStep("Navigating to businesses page...");
      console.log('🔥 [DEBUG] Attempting navigation to /businesses');
      
      // Multiple navigation attempts for reliability
      try {
        navigate("/businesses", { replace: true });
        console.log('🔥 [DEBUG] Navigation attempted with replace: true');
      } catch (navError) {
        console.error('🔥 [DEBUG] Navigation error:', navError);
        // Fallback navigation
        window.location.href = "/businesses";
        console.log('🔥 [DEBUG] Fallback navigation attempted');
      }
      
    } catch (error) {
      console.error('🔥 [DEBUG] Submission error:', error);
      setSubmissionStep(`Error: ${error.message}`);
      
      toast({
        title: "Submission Failed",
        description: `Error: ${error.message}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      console.log('🔥 [DEBUG] Submission process completed');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Basic Information</h2>
        
        <div className="space-y-2">
          <Label htmlFor="name">Business Name <span className="text-red-500">*</span></Label>
          <Input
            id="name"
            name="name"
            value={businessData.name}
            onChange={handleInputChange}
            placeholder="Enter your business name"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
          <Select
            value={businessData.category}
            onValueChange={(value) => handleSelectChange("category", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
          <Textarea
            id="description"
            name="description"
            value={businessData.description}
            onChange={handleInputChange}
            placeholder="Write a detailed description about your business"
            rows={4}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="priceRange">Price Range</Label>
          <Select
            value={businessData.priceRange}
            onValueChange={(value) => handleSelectChange("priceRange", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select price range" />
            </SelectTrigger>
            <SelectContent>
              {priceRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Business Images</h2>
        <p className="text-sm text-gray-500">Upload up to 5 high-quality images of your business</p>
        
        <BusinessImageUploader 
          images={images}
          setImages={setImages}
          maxImages={5}
        />
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Contact Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
            <Input
              id="address"
              name="address"
              value={businessData.address}
              onChange={handleInputChange}
              placeholder="Street address"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="locationUrl">Location URL (Google Maps)</Label>
            <div className="relative">
              <Input
                id="locationUrl"
                name="locationUrl"
                value={businessData.locationUrl}
                onChange={handleInputChange}
                placeholder="https://maps.google.com/?q=..."
                type="url"
                className="pl-9"
              />
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
            <p className="text-xs text-muted-foreground">
              Add a Google Maps link for your business location
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state">State <span className="text-red-500">*</span></Label>
            <Select
              value={businessData.state}
              onValueChange={(value) => handleSelectChange("state", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a state" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] z-50 bg-popover">
                {STATES_WITH_ALL.filter(state => state !== "All States").map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
            <Select
              value={businessData.city}
              onValueChange={(value) => handleSelectChange("city", value)}
              disabled={!businessData.state}
            >
              <SelectTrigger>
                <SelectValue placeholder={businessData.state ? "Select a city" : "Select state first"} />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] z-50 bg-popover">
                {availableCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pincode">Pincode</Label>
            <Input
              id="pincode"
              name="pincode"
              value={businessData.pincode}
              onChange={handleInputChange}
              placeholder="Pincode / ZIP code"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
            <Input
              id="phone"
              name="phone"
              value={businessData.phone}
              onChange={handleInputChange}
              placeholder="+91 98765 43210"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              value={businessData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              type="email"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              value={businessData.website}
              onChange={handleInputChange}
              placeholder="https://www.yourwebsite.com"
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Business Hours</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="openingTime">Opening Time</Label>
            <Input
              id="openingTime"
              name="openingTime"
              value={businessData.openingTime}
              onChange={handleInputChange}
              type="time"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="closingTime">Closing Time</Label>
            <Input
              id="closingTime"
              name="closingTime"
              value={businessData.closingTime}
              onChange={handleInputChange}
              type="time"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Working Days</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {days.map((day) => (
              <div key={day} className="flex items-center space-x-2">
                <Checkbox
                  id={`day-${day}`}
                  checked={businessData.workingDays.includes(day)}
                  onCheckedChange={(checked) => handleDayChange(day, checked as boolean)}
                />
                <Label htmlFor={`day-${day}`}>{day}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Products & Services</h2>
        
        <ProductServiceUploader
          type="products"
          items={businessData.products}
          setItems={(products) => setBusinessData(prev => ({ ...prev, products }))}
        />
        
        <ProductServiceUploader
          type="services"
          items={businessData.services}
          setItems={(services) => setBusinessData(prev => ({ ...prev, services }))}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Additional Information</h2>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="hasOffers"
            checked={businessData.hasOffers}
            onCheckedChange={(checked) => 
              setBusinessData((prev) => ({ ...prev, hasOffers: checked as boolean }))
            }
          />
          <Label htmlFor="hasOffers">This business has special offers</Label>
        </div>
        
        <div className="space-y-2">
          <Label>Special Features</Label>
          <div className="grid grid-cols-2 gap-2">
            {features.map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={`feature-${feature}`}
                  checked={businessData.specialFeatures.includes(feature)}
                  onCheckedChange={(checked) => handleCheckboxChange(feature, checked as boolean)}
                />
                <Label htmlFor={`feature-${feature}`}>{feature}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t space-y-3">
        {/* Progress Indicator */}
        {isSubmitting && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              <span className="text-blue-700 text-sm font-medium">
                {submissionStep || "Processing..."}
              </span>
            </div>
          </div>
        )}
        
        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Processing...</span>
            </div>
          ) : (
            "🚀 Submit Business"
          )}
        </Button>
      </div>
    </form>
  );
};

export default BusinessUploadForm;
