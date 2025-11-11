import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BusinessImageUploader from "./BusinessImageUploader";
import ProductServiceUploader from "./ProductServiceUploader";
import { categoryOptions } from "@/components/filters/FilterOptions";
import { STATES_WITH_ALL, getCitiesForState } from "@/utils/indiaGeo";

interface ProductService {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
}

interface Business {
  id: string;
  name: string;
  category: string;
  description: string;
  location: string;
  city: string;
  state: string;
  phone: string;
  email?: string;
  website?: string;
  priceRange: string;
  images: string[];
  features?: string[];
  hours?: Array<{ day: string; open: string; close: string; isOpen: boolean }>;
  products?: ProductService[];
  services?: ProductService[];
}

interface BusinessEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  business: Business;
  onSave: (updatedBusiness: Business) => void;
}

const BusinessEditDialog: React.FC<BusinessEditDialogProps> = ({
  open,
  onOpenChange,
  business,
  onSave,
}) => {
  const { toast } = useToast();
  
  // Parse address from location
  const parseAddress = (location: string) => {
    const parts = location.split(',').map(s => s.trim());
    return parts[0] || "";
  };

  const [businessData, setBusinessData] = useState({
    name: business.name,
    category: business.category,
    description: business.description,
    address: parseAddress(business.location),
    state: business.state,
    city: business.city,
    phone: business.phone,
    email: business.email || "",
    website: business.website || "",
    priceRange: business.priceRange,
    specialFeatures: business.features || [],
  });

  const [images, setImages] = useState<string[]>(business.images || []);
  const [products, setProducts] = useState<ProductService[]>(business.products || []);
  const [services, setServices] = useState<ProductService[]>(business.services || []);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBusinessData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setBusinessData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'state') {
        updated.city = '';
      }
      return updated;
    });
  };

  const handleCheckboxChange = (feature: string, checked: boolean) => {
    setBusinessData((prev) => ({
      ...prev,
      specialFeatures: checked
        ? [...prev.specialFeatures, feature]
        : prev.specialFeatures.filter(f => f !== feature)
    }));
  };

  const handleSave = () => {
    // Validation
    if (!businessData.name || !businessData.category || !businessData.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const updatedBusiness: Business = {
      ...business,
      name: businessData.name,
      category: businessData.category,
      description: businessData.description,
      location: `${businessData.address}, ${businessData.city}, ${businessData.state}`,
      city: businessData.city,
      state: businessData.state,
      phone: businessData.phone,
      email: businessData.email,
      website: businessData.website,
      priceRange: businessData.priceRange,
      images: images,
      features: businessData.specialFeatures,
      products: products,
      services: services,
    };

    onSave(updatedBusiness);
    onOpenChange(false);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('businessUpdated'));
    
    toast({
      title: "Business Updated",
      description: "Your business details have been updated successfully",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Business</DialogTitle>
          <DialogDescription>
            Update your business information and details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="name">Business Name <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                name="name"
                value={businessData.name}
                onChange={handleInputChange}
                placeholder="Enter your business name"
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
                placeholder="Write a detailed description"
                rows={4}
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

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Business Images</h3>
            <BusinessImageUploader
              images={images}
              setImages={setImages}
              maxImages={5}
            />
          </div>

          {/* Contact & Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact & Location</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone <span className="text-red-500">*</span></Label>
                <Input
                  id="phone"
                  name="phone"
                  value={businessData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={businessData.email}
                  onChange={handleInputChange}
                  placeholder="business@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                value={businessData.website}
                onChange={handleInputChange}
                placeholder="https://www.example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={businessData.address}
                onChange={handleInputChange}
                placeholder="Street address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select
                  value={businessData.state}
                  onValueChange={(value) => handleSelectChange("state", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATES_WITH_ALL.filter(s => s !== "All States").map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Select
                  value={businessData.city}
                  onValueChange={(value) => handleSelectChange("city", value)}
                  disabled={!businessData.state}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
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
            </div>
          </div>

          {/* Special Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Special Features</h3>
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature}
                    checked={businessData.specialFeatures.includes(feature)}
                    onCheckedChange={(checked) => handleCheckboxChange(feature, checked as boolean)}
                  />
                  <Label htmlFor={feature} className="text-sm cursor-pointer">
                    {feature}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <ProductServiceUploader
              type="products"
              items={products}
              setItems={setProducts}
            />
          </div>

          {/* Services */}
          <div className="space-y-4">
            <ProductServiceUploader
              type="services"
              items={services}
              setItems={setServices}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BusinessEditDialog;
