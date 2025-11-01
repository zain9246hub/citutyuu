import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { categoryOptions } from "@/components/filters/FilterOptions";

export interface BusinessInfo {
  name: string;
  category: string;
  description: string;
  address: string;
  pincode: string;
  email: string;
  website: string;
  openingTime: string;
  closingTime: string;
  workingDays: string[];
  priceRange: string;
  specialFeatures: string[];
}

interface BusinessInfoFormProps {
  businessData: BusinessInfo;
  onChange: (data: Partial<BusinessInfo>) => void;
}

const BusinessInfoForm: React.FC<BusinessInfoFormProps> = ({
  businessData,
  onChange,
}) => {
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

  const handleCheckboxChange = (feature: string, checked: boolean) => {
    onChange({
      specialFeatures: checked
        ? [...businessData.specialFeatures, feature]
        : businessData.specialFeatures.filter(f => f !== feature)
    });
  };

  const handleDayChange = (day: string, checked: boolean) => {
    onChange({
      workingDays: checked
        ? [...businessData.workingDays, day]
        : businessData.workingDays.filter(d => d !== day)
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
          Business Information
        </h3>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          This information will be used to create your business listing on the Discover page
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="businessName">Business Name <span className="text-red-500">*</span></Label>
          <Input
            id="businessName"
            value={businessData.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Enter your business name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessCategory">Category <span className="text-red-500">*</span></Label>
          <Select
            value={businessData.category}
            onValueChange={(value) => onChange({ category: value })}
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
          <Label htmlFor="businessDescription">Description <span className="text-red-500">*</span></Label>
          <Textarea
            id="businessDescription"
            value={businessData.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Describe your business, services, and what makes you unique"
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="businessAddress">Full Address <span className="text-red-500">*</span></Label>
            <Input
              id="businessAddress"
              value={businessData.address}
              onChange={(e) => onChange({ address: e.target.value })}
              placeholder="Street address"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pincode">Pincode <span className="text-red-500">*</span></Label>
            <Input
              id="pincode"
              value={businessData.pincode}
              onChange={(e) => onChange({ pincode: e.target.value })}
              placeholder="Enter pincode"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="businessEmail">Email</Label>
            <Input
              id="businessEmail"
              type="email"
              value={businessData.email}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder="business@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessWebsite">Website</Label>
            <Input
              id="businessWebsite"
              type="url"
              value={businessData.website}
              onChange={(e) => onChange({ website: e.target.value })}
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Price Range</Label>
          <Select
            value={businessData.priceRange}
            onValueChange={(value) => onChange({ priceRange: value })}
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

        <div className="space-y-3">
          <Label>Working Hours</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="openingTime" className="text-sm">Opening Time</Label>
              <Input
                id="openingTime"
                type="time"
                value={businessData.openingTime}
                onChange={(e) => onChange({ openingTime: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="closingTime" className="text-sm">Closing Time</Label>
              <Input
                id="closingTime"
                type="time"
                value={businessData.closingTime}
                onChange={(e) => onChange({ closingTime: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Working Days</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {days.map((day) => (
              <div key={day} className="flex items-center space-x-2">
                <Checkbox
                  id={`day-${day}`}
                  checked={businessData.workingDays.includes(day)}
                  onCheckedChange={(checked) => handleDayChange(day, checked as boolean)}
                />
                <Label htmlFor={`day-${day}`} className="text-sm cursor-pointer">
                  {day.substring(0, 3)}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Special Features</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {features.map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={`feature-${feature}`}
                  checked={businessData.specialFeatures.includes(feature)}
                  onCheckedChange={(checked) => handleCheckboxChange(feature, checked as boolean)}
                />
                <Label htmlFor={`feature-${feature}`} className="text-sm cursor-pointer">
                  {feature}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessInfoForm;
