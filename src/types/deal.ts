
export type DealTier = 'standard' | 'highlight' | 'citywide';

export interface Deal {
  id: number;
  title: string;
  description: string;
  image: string;
  images?: string[]; // Up to 5 images max
  originalPrice: number;
  discountedPrice?: number;
  discount?: number;
  category: string;
  tags: string[];
  location: string;
  city: string;
  zipCodes?: string[]; // Zip code targeting
  phone?: string;
  expiryDate?: string;
  rating: number;
  featured?: boolean;
  duration?: number; // Duration in days
  tier?: DealTier; // Deal tier: standard, highlight, or citywide
  isMetroCity?: boolean; // Whether the city is a metro city
}

export interface FilterOptions {
  categories: string[];
  priceRange: string | null;
  sortBy: string;
  showPopular: boolean;
  selectedCity?: string | null;
}
