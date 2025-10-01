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
  uploadedAt: string;
  isActive: boolean;
  // Subscription tracking
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  monthlyPrice: number;
  isRenewal?: boolean;
}

interface AdvertisementContextType {
  uploadedAds: UploadedAd[];
  addUploadedAd: (ad: Omit<UploadedAd, 'id' | 'uploadedAt' | 'isActive'>) => void;
  getAdsByPosition: (position: number, location?: string) => UploadedAd[];
  removeAd: (id: string) => void;
  renewAd: (id: string) => void;
  getExpiringSoonAds: () => UploadedAd[];
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
        setUploadedAds(parsedAds);
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
      uploadedAt: new Date().toISOString(),
      isActive: true
    };
    
    setUploadedAds(prev => [newAd, ...prev]);
  };

  const renewAd = (id: string) => {
    setUploadedAds(prev => prev.map(ad => {
      if (ad.id === id) {
        const now = new Date();
        const newEndDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        return {
          ...ad,
          subscriptionStartDate: now.toISOString(),
          subscriptionEndDate: newEndDate.toISOString(),
          isRenewal: true,
          isActive: true
        };
      }
      return ad;
    }));
  };

  const getExpiringSoonAds = () => {
    const now = new Date();
    const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    return uploadedAds.filter(ad => {
      const endDate = new Date(ad.subscriptionEndDate);
      return ad.isActive && endDate > now && endDate <= oneDayFromNow;
    });
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

  // Check for expired ads and deactivate them
  React.useEffect(() => {
    const checkExpiredAds = () => {
      const now = new Date();
      setUploadedAds(prev => prev.map(ad => {
        const endDate = new Date(ad.subscriptionEndDate);
        if (endDate < now && ad.isActive) {
          return { ...ad, isActive: false };
        }
        return ad;
      }));
    };

    // Check on mount and every hour
    checkExpiredAds();
    const interval = setInterval(checkExpiredAds, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AdvertisementContext.Provider value={{ 
      uploadedAds, 
      addUploadedAd, 
      getAdsByPosition,
      removeAd,
      renewAd,
      getExpiringSoonAds
    }}>
      {children}
    </AdvertisementContext.Provider>
  );
};