import { SlotBanner } from "@/types/slot";
import type { UploadedAd } from "@/contexts/AdvertisementContext";

// Import banner images
import restaurantBanner from "@/assets/banners/restaurant-banner.jpg";
import fashionBanner from "@/assets/banners/fashion-banner.jpg";
import electronicsBanner from "@/assets/banners/electronics-banner.jpg";
import fitnessBanner from "@/assets/banners/fitness-banner.jpg";
import beautyBanner from "@/assets/banners/beauty-banner.jpg";
import travelBanner from "@/assets/banners/travel-banner.jpg";
import deliveryBanner from "@/assets/banners/delivery-banner.jpg";
import autoBanner from "@/assets/banners/auto-banner.jpg";

export const generateMockSlotBanners = (
  position: number, 
  rotationIndex: number = 0, 
  uploadedAds: UploadedAd[] = [],
  selectedCity?: string | null
): SlotBanner[] => {
  const totalBanners = [
    {
      imageUrl: restaurantBanner,
      title: "Best Restaurant Deals",
      description: "Delicious food at amazing prices",
      businessName: "Food Paradise",
      targetUrl: "https://restaurant.example.com",
      location: "Mumbai"
    },
    {
      imageUrl: fashionBanner,
      title: "Fashion Sale 50% Off",
      description: "Latest trends and styles",
      businessName: "Style Hub",
      targetUrl: "https://fashion.example.com",
      location: "Delhi"
    },
    {
      imageUrl: electronicsBanner,
      title: "Electronics Mega Sale",
      description: "Latest gadgets and electronics",
      businessName: "Tech World",
      targetUrl: "https://electronics.example.com",
      location: "Bangalore"
    },
    {
      imageUrl: fitnessBanner,
      title: "Fitness Center Membership",
      description: "Get fit with our expert trainers",
      businessName: "FitLife Gym",
      targetUrl: "https://fitness.example.com",
      location: "Chennai"
    },
    {
      imageUrl: beautyBanner,
      title: "Beauty Salon Services",
      description: "Professional beauty treatments",
      businessName: "Glamour Salon",
      targetUrl: "https://beauty.example.com",
      location: "Hyderabad"
    },
    {
      imageUrl: travelBanner,
      title: "Travel Packages",
      description: "Explore amazing destinations",
      businessName: "Wanderlust Travels",
      targetUrl: "https://travel.example.com",
      location: "Kolkata"
    },
    {
      imageUrl: deliveryBanner,
      title: "Food Delivery Service",
      description: "Fast delivery from your favorite restaurants",
      businessName: "QuickEats",
      targetUrl: "https://delivery.example.com",
      location: "Pune"
    },
    {
      imageUrl: autoBanner,
      title: "Auto Service Center",
      description: "Professional car maintenance and repair",
      businessName: "AutoCare Pro",
      targetUrl: "https://auto.example.com",
      location: "Ahmedabad"
    }
  ];

  // Filter uploaded ads for this position and location
  const relevantUploadedAds = uploadedAds.filter(ad => 
    ad.position === position && 
    ad.isActive &&
    (!selectedCity || ad.location.toLowerCase().includes(selectedCity.toLowerCase()))
  );

  // If there are uploaded ads, show them + only ONE available slot
  const showOnlyOneAvailable = relevantUploadedAds.length > 0;

  // Convert uploaded ads to SlotBanner format
  const uploadedBannerSlots: SlotBanner[] = relevantUploadedAds.map(ad => ({
    id: ad.id,
    position: ad.position,
    adContent: ad.title,
    location: ad.location,
    backgroundColor: "bg-gradient-to-br from-blue-50 to-blue-100",
    imageUrl: ad.imageUrl || ad.videoUrl || totalBanners[0].imageUrl, // Fallback to first demo image
    isBooked: true, // Uploaded ads are always booked
    title: ad.title,
    description: ad.description,
    businessName: `By ${ad.uploadedBy}`,
    targetUrl: ad.targetUrl,
    price: position === 1 ? 1000 : 750,
    isUploadedAd: true, // Mark as uploaded ad
    videoUrl: ad.videoUrl,
    // Include contact information from uploaded ads
    phoneNumber: ad.phoneNumber,
    locationUrl: ad.locationUrl,
    websiteUrl: ad.websiteUrl,
  }));

  // Create remaining mock slots - only ONE available slot if there are uploaded ads
  const slotsPerPosition = showOnlyOneAvailable ? 1 : 6;
  const remainingSlots = slotsPerPosition;
  const startIndex = rotationIndex % totalBanners.length;
  
  const mockSlots: SlotBanner[] = [];
  for (let i = 0; i < Math.max(0, remainingSlots); i++) {
    const bannerIndex = (startIndex + i) % totalBanners.length;
    const banner = totalBanners[bannerIndex];
    
    mockSlots.push({
      id: `slot-${position}-available-${Date.now()}-${i}`,
      position,
      adContent: banner.title,
      location: selectedCity || banner.location,
      backgroundColor: "bg-gradient-to-br from-gray-50 to-gray-100",
      imageUrl: banner.imageUrl,
      isBooked: false, // Always show as available
      title: "Available Slot",
      description: "Book this premium slot for your business - ₹2999/month",
      businessName: "Available for Booking",
      targetUrl: "",
      price: 2999, // Monthly subscription price
      businessId: undefined,
    });
  }
  
  // Prioritize uploaded ads first, then available slots
  return [...uploadedBannerSlots, ...mockSlots];
};

export const formatTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return "0m 0s";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};