import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UploadedAd {
  id: string;
  slotId: string;
  position: number;
  location: string;
  title: string;
  description: string;
  // Optional links and contact
  targetUrl?: string; // legacy/general target URL
  locationUrl?: string; // e.g., Google Maps link
  websiteUrl?: string; // official website
  phoneNumber?: string;
  imageUrl?: string;
  videoUrl?: string;
  uploadedBy: string;
  uploadedAt: Date;
  isActive: boolean;
}

interface AdvertisementContextType {
  uploadedAds: UploadedAd[];
  addUploadedAd: (ad: Omit<UploadedAd, 'id' | 'uploadedAt' | 'isActive'>) => void;
  getAdsByPosition: (position: number, location?: string) => UploadedAd[];
  removeAd: (id: string) => void;
}

const AdvertisementContext = createContext<AdvertisementContextType | undefined>(undefined);

export const useAdvertisements = () => {
  const context = useContext(AdvertisementContext);
  if (!context) {
    throw new Error('useAdvertisements must be used within an AdvertisementProvider');
  }
  return context;
};

export const AdvertisementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uploadedAds, setUploadedAds] = useState<UploadedAd[]>([]);

  // Load ads from localStorage on mount
  useEffect(() => {
    const savedAds = localStorage.getItem('uploadedAds');
    if (savedAds) {
      try {
        const parsedAds = JSON.parse(savedAds);
        // Convert uploadedAt back to Date objects
        const adsWithDates = parsedAds.map((ad: any) => ({
          ...ad,
          uploadedAt: new Date(ad.uploadedAt)
        }));
        setUploadedAds(adsWithDates);
      } catch (error) {
        console.error('Error loading uploaded ads:', error);
      }
    }
  }, []);

  // Save ads to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('uploadedAds', JSON.stringify(uploadedAds));
  }, [uploadedAds]);

  const addUploadedAd = (ad: Omit<UploadedAd, 'id' | 'uploadedAt' | 'isActive'>) => {
    const newAd: UploadedAd = {
      ...ad,
      id: `ad_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      uploadedAt: new Date(),
      isActive: true
    };
    
    setUploadedAds(prev => [newAd, ...prev]);
  };

  const getAdsByPosition = (position: number, location?: string) => {
    return uploadedAds.filter(ad => 
      ad.position === position && 
      ad.isActive && 
      (!location || ad.location.toLowerCase().includes(location.toLowerCase()))
    );
  };

  const removeAd = (id: string) => {
    setUploadedAds(prev => prev.filter(ad => ad.id !== id));
  };

  return (
    <AdvertisementContext.Provider value={{
      uploadedAds,
      addUploadedAd,
      getAdsByPosition,
      removeAd
    }}>
      {children}
    </AdvertisementContext.Provider>
  );
};