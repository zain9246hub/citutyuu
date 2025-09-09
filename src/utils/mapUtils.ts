// Free map utilities using OpenStreetMap
export const buildOSMEmbedUrl = (lat: number, lng: number, zoom: number = 15): string => {
  // Using OpenStreetMap embed (uMap or similar free service)
  return `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`;
};

export const buildOSMDirectionsUrl = (address: string): string => {
  return `https://www.openstreetmap.org/directions?to=${encodeURIComponent(address)}`;
};

export const buildGoogleMapsDirectionsUrl = (address: string): string => {
  return `https://maps.google.com?q=${encodeURIComponent(address)}`;
};

// Default coordinates for Mumbai (fallback)
export const getBusinessCoordinates = (businessId?: string): { lat: number; lng: number } => {
  // You can extend this to have specific coordinates per business
  // For now, using Mumbai Bandra West coordinates as default
  return {
    lat: 19.0596,
    lng: 72.8295
  };
};