
import { SlotBanner } from "@/types/slot";
import restaurantBanner from "@/assets/banners/restaurant-banner.jpg";
import fashionBanner from "@/assets/banners/fashion-banner.jpg";
import electronicsBanner from "@/assets/banners/electronics-banner.jpg";
import fitnessBanner from "@/assets/banners/fitness-banner.jpg";
import beautyBanner from "@/assets/banners/beauty-banner.jpg";
import travelBanner from "@/assets/banners/travel-banner.jpg";
import deliveryBanner from "@/assets/banners/delivery-banner.jpg";
import autoBanner from "@/assets/banners/auto-banner.jpg";

const bookedBannerImages = [
  restaurantBanner, // Restaurant
  fashionBanner, // Fashion store
  electronicsBanner, // Electronics
  fitnessBanner, // Gym/Fitness
  beautyBanner, // Beauty salon
  travelBanner, // Travel agency
  deliveryBanner, // Food delivery
  autoBanner, // Automotive
];

const cities = [
  // Major Metros
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Kolkata",
  // Tier 1 Cities
  "Pune", "Ahmedabad", "Surat", "Jaipur", "Lucknow", "Kanpur",
  // State Capitals & Major Cities
  "Bhopal", "Indore", "Patna", "Chandigarh", "Raipur", "Ranchi",
  "Bhubaneswar", "Thiruvananthapuram", "Gandhinagar", "Shimla", "Dehradun",
  // Economic & Cultural Centers
  "Coimbatore", "Mysore", "Visakhapatnam", "Nagpur", "Vadodara", "Thane",
  // Tourist Destinations
  "Goa", "Udaipur", "Pondicherry", "Amritsar", "Varanasi", "Agra",
  // Growing Tech Hubs
  "Kochi", "Mangalore", "Nashik", "Aurangabad", "Guwahati", "Shillong",
  // Industrial Centers
  "Ludhiana", "Rajkot", "Faridabad", "Gurgaon", "Noida", "Thane",
  // Emerging Cities
  "Jammu", "Srinagar", "Gangtok", "Imphal", "Itanagar", "Kohima",
  "Port Blair", "Silvassa", "Kavaratti", "Daman", "Dharamshala"
];

export const generateMockSlotBanners = (
  position: number, 
  totalSlots: number, 
  selectedCity?: string | null,
  options?: {
    showOnlyBooked?: boolean;
    bookedCount?: number;
    includeImages?: boolean;
  }
): SlotBanner[] => {
  const colors = [
    "bg-gradient-to-br from-blue-50 to-blue-100", 
    "bg-gradient-to-br from-green-50 to-green-100", 
    "bg-gradient-to-br from-amber-50 to-amber-100", 
    "bg-gradient-to-br from-pink-50 to-pink-100",
    "bg-gradient-to-br from-purple-50 to-purple-100", 
    "bg-gradient-to-br from-teal-50 to-teal-100"
  ];

  const { showOnlyBooked = false, bookedCount = 4, includeImages = false } = options || {};
  const banners: SlotBanner[] = [];
  
  if (showOnlyBooked) {
    // Generate only booked banners with images for general users
    const citiesToUse = selectedCity ? [selectedCity] : cities.slice(0, bookedCount);
    const actualCount = Math.min(bookedCount, citiesToUse.length);
    
    for (let i = 0; i < actualCount; i++) {
      const city = citiesToUse[i % citiesToUse.length];
      const businessTypes = ['Restaurant', 'Fashion Store', 'Electronics', 'Fitness Center', 'Beauty Salon', 'Travel Agency', 'Food Delivery', 'Auto Service'];
      const businessType = businessTypes[i % businessTypes.length];
      
      banners.push({
        id: `booked-${position}-${city}-${i + 1}`,
        position,
        adContent: `${businessType} - ${city}`,
        location: city,
        backgroundColor: colors[i % colors.length],
        imageUrl: bookedBannerImages[i % bookedBannerImages.length],
        isBooked: true,
      });
    }
  } else if (selectedCity) {
    // Generate banners for specific city (business users)
    for (let i = 0; i < totalSlots; i++) {
      banners.push({
        id: `${position}-${selectedCity}-${i + 1}`,
        position,
        adContent: `${selectedCity} Premium Ad #${i + 1}`,
        location: selectedCity,
        backgroundColor: colors[i % colors.length],
        imageUrl: includeImages ? bookedBannerImages[i % bookedBannerImages.length] : undefined,
        isBooked: false,
      });
    }
  } else {
    // Generate banners from multiple cities (for "All Cities" view)
    const citiesToUse = cities.slice(0, 8);
    const bannersPerCity = Math.ceil(totalSlots / citiesToUse.length);
    
    citiesToUse.forEach((city, cityIndex) => {
      for (let i = 0; i < bannersPerCity && banners.length < totalSlots; i++) {
        banners.push({
          id: `${position}-${city}-${i + 1}`,
          position,
          adContent: `${city} Premium Ad #${i + 1}`,
          location: city,
          backgroundColor: colors[(cityIndex + i) % colors.length],
          imageUrl: includeImages ? bookedBannerImages[(cityIndex + i) % bookedBannerImages.length] : undefined,
          isBooked: false,
        });
      }
    });
  }

  return banners;
};

export const formatTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return "0m 0s";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};
