// Metro cities in India with higher pricing
export const METRO_CITIES = [
  // Tier 1 Metro Cities
  "Mumbai",
  "Delhi",
  "New Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  
  // Major Metros
  "Gurgaon",
  "Noida",
  "Ghaziabad",
  "Faridabad",
  "Thane",
  "Navi Mumbai",
] as const;

export const isMetroCity = (city: string): boolean => {
  return METRO_CITIES.some(metro => 
    metro.toLowerCase() === city.toLowerCase()
  );
};

// Deal tier pricing structure
export interface DealPricing {
  standard: number;
  highlight: number;
  citywide: number;
}

export const NON_METRO_PRICING: DealPricing = {
  standard: 235,    // All taxes included
  highlight: 589,   // Featured on home page
  citywide: 1770,   // City-wide push notifications
};

export const METRO_PRICING: DealPricing = {
  standard: 471,    // All taxes included
  highlight: 1179,  // Featured on home page
  citywide: 4130,   // City-wide push notifications
};

export const getPricingForCity = (city: string): DealPricing => {
  return isMetroCity(city) ? METRO_PRICING : NON_METRO_PRICING;
};

// Zip code limits per tier
export const ZIP_CODE_LIMITS = {
  standard: { min: 1, max: 2 },
  highlight: { min: 4, max: 6 },
  citywide: { min: 0, max: 0 }, // City-wide doesn't use zip codes
} as const;

// Image upload limit
export const MAX_IMAGES = 5;
export const IMAGE_CHANGE_POLICY = "Once uploaded, images cannot be changed.";
