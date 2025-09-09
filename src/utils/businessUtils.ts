/**
 * Calculate distance between two coordinates using Haversine formula
 */
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c; // Distance in km
};

/**
 * Filter and sort businesses based on search criteria
 */
export const filterBusinesses = (
  businesses,
  {
    searchQuery,
    selectedCategory,
    selectedCity,
    categories,
    priceRange,
    showNearby,
    userLocation,
    sortBy,
    showPopular
  }
) => {
  // Filter businesses
  let filtered = businesses.filter(business => {
    // Search query filter
    const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategory ? business.categories.includes(selectedCategory) : true;
    
    // City filter
    const matchesCity = selectedCity ? business.city === selectedCity : true;
    
    // Category filter from FilterDialog
    const matchesCategories = categories.length === 0 || 
      categories.includes(business.category);
    
    // Price range filter
    const matchesPriceRange = priceRange ? business.priceRange === priceRange : true;

    // Popular filter
    const matchesPopular = showPopular ? business.rating >= 4.5 : true;
    
    return matchesSearch && matchesCategory && matchesCity && matchesCategories && matchesPriceRange && matchesPopular;
  });

  // Sort businesses based on selected criteria
  if (sortBy) {
    switch (sortBy) {
      case "rating-high-low":
        filtered = filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "price-low-high":
        // Convert price symbols to numbers for sorting
        filtered = filtered.sort((a, b) => a.priceRange.length - b.priceRange.length);
        break;
      case "price-high-low":
        filtered = filtered.sort((a, b) => b.priceRange.length - a.priceRange.length);
        break;
      default:
        // Default sorting (relevance) remains unchanged
        break;
    }
  }

  // Sort by nearby if enabled and we have user location
  if (showNearby && userLocation) {
    return filtered.sort((a, b) => {
      const distA = calculateDistance(
        userLocation.lat, 
        userLocation.lng, 
        a.coordinates.lat, 
        a.coordinates.lng
      );
      const distB = calculateDistance(
        userLocation.lat, 
        userLocation.lng, 
        b.coordinates.lat, 
        b.coordinates.lng
      );
      return distA - distB;
    });
  }
  
  return filtered;
};

/**
 * Extract unique categories from business data
 */
export const extractUniqueCategories = (businesses: any[]): string[] => {
  return Array.from(
    new Set(
      businesses.flatMap(business => business.categories)
    )
  ).sort();
};
