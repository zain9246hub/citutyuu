import { useState, useEffect, useMemo } from "react";
import { deals as initialDeals } from "@/utils/dealData"; // Fixed import path
import { Deal, FilterOptions } from "@/types/deal";
import { useToast } from "@/hooks/use-toast";
import { useDealNotifications } from "@/hooks/useDealNotifications";

export const useDeals = (cityFilter?: string | null, searchQuery?: string, filterOptions?: FilterOptions) => {
  const { toast } = useToast();
  const [sortedDeals, setSortedDeals] = useState<Deal[]>([]);
  const [savedDeals, setSavedDeals] = useState<number[]>([]);
  const [featuredDeals, setFeaturedDeals] = useState<number[]>([]);
  const [dealUsage, setDealUsage] = useState<{ [dealId: number]: number }>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load saved deals from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedDeals');
    if (saved) {
      try {
        setSavedDeals(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved deals:', error);
      }
    }
  }, []);

  // Save to localStorage when savedDeals changes
  useEffect(() => {
    localStorage.setItem('savedDeals', JSON.stringify(savedDeals));
  }, [savedDeals]);

  const toggleSave = (dealId: number) => {
    if (savedDeals.includes(dealId)) {
      setSavedDeals(savedDeals.filter((id) => id !== dealId));
      toast({
        title: "Deal Unsaved",
        description: "This deal has been removed from your saved list.",
      });
    } else {
      setSavedDeals([...savedDeals, dealId]);
      toast({
        title: "Deal Saved",
        description: "This deal has been saved to your list.",
      });
    }
  };

  const isSaved = (dealId: number) => {
    return savedDeals.includes(dealId);
  };

  const featureDeal = (dealId: number) => {
    if (featuredDeals.includes(dealId)) {
      setFeaturedDeals(featuredDeals.filter((id) => id !== dealId));
      toast({
        title: "Deal Unfeatured",
        description: "This deal has been removed from featured list.",
      });
    } else {
      setFeaturedDeals([...featuredDeals, dealId]);
      toast({
        title: "Deal Featured",
        description: "This deal has been featured.",
      });
    }
  };

  const isFeatured = (dealId: number) => {
    return featuredDeals.includes(dealId);
  };

  const getDealUsageCount = (dealId: number) => {
    return dealUsage[dealId] || 0;
  };

  const useDeal = (dealId: number) => {
    setDealUsage((prevUsage) => ({
      ...prevUsage,
      [dealId]: (prevUsage[dealId] || 0) + 1,
    }));
  };
  
  // Get all deals including user-added deals - memoized to prevent recreation
  const combinedDeals = useMemo(() => {
    let allDeals = [...initialDeals]; // Get the default deals
    
    // Get any user-added deals from localStorage
    const userDealsString = localStorage.getItem('userDeals');
    if (userDealsString) {
      try {
        const userDeals = JSON.parse(userDealsString);
        allDeals = [...allDeals, ...userDeals];
      } catch (error) {
        console.error('Error parsing user deals from localStorage:', error);
      }
    }
    
    return allDeals;
  }, []); // Empty dependency array since deals should be stable

  // Keep the getAllDeals function for backward compatibility
  const getAllDeals = () => combinedDeals;

  // Add deal notifications hook
  useDealNotifications(combinedDeals, savedDeals);
  
  useEffect(() => {
    let filteredDeals = [...combinedDeals];
    
    // City filter
    if (cityFilter && cityFilter !== "All Cities") {
      filteredDeals = filteredDeals.filter(deal => deal.city === cityFilter);
    }
    
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredDeals = filteredDeals.filter(deal => 
        deal.title.toLowerCase().includes(query) || 
        deal.description.toLowerCase().includes(query) ||
        deal.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply additional filters if provided
    if (filterOptions) {
      // Category filter
      if (filterOptions.categories && filterOptions.categories.length > 0) {
        filteredDeals = filteredDeals.filter(deal => filterOptions.categories.includes(deal.category));
      }
      
      // Price range filter
      if (filterOptions.priceRange) {
        switch (filterOptions.priceRange) {
          case "under-500":
            filteredDeals = filteredDeals.filter(deal => deal.discountedPrice && deal.discountedPrice < 500);
            break;
          case "500-1000":
            filteredDeals = filteredDeals.filter(deal => 
              deal.discountedPrice && deal.discountedPrice >= 500 && deal.discountedPrice <= 1000
            );
            break;
          case "1000-2000":
            filteredDeals = filteredDeals.filter(deal => 
              deal.discountedPrice && deal.discountedPrice > 1000 && deal.discountedPrice <= 2000
            );
            break;
          case "above-2000":
            filteredDeals = filteredDeals.filter(deal => deal.discountedPrice && deal.discountedPrice > 2000);
            break;
        }
      }
      
      // Popular filter
      if (filterOptions.showPopular) {
        filteredDeals = filteredDeals.filter(deal => deal.rating >= 4.0);
      }
    }
    
    // Apply sorting
    if (filterOptions?.sortBy) {
      switch (filterOptions.sortBy) {
        case "price-low-high":
          filteredDeals.sort((a, b) => (a.discountedPrice || 0) - (b.discountedPrice || 0));
          break;
        case "price-high-low":
          filteredDeals.sort((a, b) => (b.discountedPrice || 0) - (a.discountedPrice || 0));
          break;
        case "rating-high-low":
          filteredDeals.sort((a, b) => b.rating - a.rating);
          break;
        case "newest":
          // Assuming newer deals have higher IDs
          filteredDeals.sort((a, b) => b.id - a.id);
          break;
        default:
          // Default sorting - can customize as needed
          break;
      }
    }
    
    // Apply featured sorting (featured deals go first)
    filteredDeals.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
    
    setSortedDeals(filteredDeals);
    setIsLoading(false);
  }, [cityFilter, searchQuery, filterOptions]); // Removed combinedDeals from dependencies

  return {
    sortedDeals,
    getAllDeals, // Expose this function to provide access to all deals
    toggleSave,
    isSaved,
    featureDeal,
    isFeatured,
    getDealUsageCount,
    useDeal,
    isLoading,
    savedDeals // Expose savedDeals for external use
  };
};
