
export interface Deal {
  id: number;
  title: string;
  description: string;
  image: string;
  originalPrice: number;
  discountedPrice?: number;
  discount?: number;
  category: string;
  tags: string[];
  location: string;
  city: string;
  phone?: string;
  expiryDate?: string;
  rating: number;
  featured?: boolean;
  duration?: number; // Duration in days
}

export interface FilterOptions {
  categories: string[];
  priceRange: string | null;
  sortBy: string;
  showPopular: boolean;
  selectedCity?: string | null;
}
