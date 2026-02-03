import React, { createContext, useContext, useState, useEffect } from 'react';

export type SubscriptionType = 'notifications' | 'cityChat' | 'voiceMessages' | null;

interface SubscriptionData {
  type: SubscriptionType;
  startDate: string;
  endDate: string;
  price: number;
}

interface SubscriptionContextType {
  activeSubscriptions: Set<SubscriptionType>;
  subscriptionDetails: Map<SubscriptionType, SubscriptionData>;
  hasSubscription: (type: SubscriptionType) => boolean;
  getSubscriptionDetails: (type: SubscriptionType) => SubscriptionData | undefined;
  monthlyMessagesUsed: number;
  maxMonthlyMessages: number;
  canSendMessage: boolean;
  canShareImages: boolean;
  canUseVoiceMessages: boolean;
  selectedCities: string[];
  addCity: (city: string) => void;
  removeCity: (city: string) => void;
  subscribe: (type: SubscriptionType, durationMonths?: number) => void;
  unsubscribe: (type: SubscriptionType) => void;
  renewSubscription: (type: SubscriptionType) => void;
  useMessage: () => void;
  resetMonthlyLimit: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSubscriptions, setActiveSubscriptions] = useState<Set<SubscriptionType>>(new Set());
  const [subscriptionDetails, setSubscriptionDetails] = useState<Map<SubscriptionType, SubscriptionData>>(new Map());
  const [monthlyMessagesUsed, setMonthlyMessagesUsed] = useState<number>(0);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const maxMonthlyMessages = 20; // Free users get 20 messages per month

  // Load subscription status from localStorage
  useEffect(() => {
    const savedSubscriptions = localStorage.getItem('activeSubscriptions');
    const savedDetails = localStorage.getItem('subscriptionDetails');
    const savedMessages = localStorage.getItem('monthlyMessagesUsed');
    const savedCities = localStorage.getItem('selectedCities');
    const lastResetDate = localStorage.getItem('lastMessageReset');
    
    if (savedSubscriptions) {
      setActiveSubscriptions(new Set(JSON.parse(savedSubscriptions)));
    }
    
    if (savedDetails) {
      const parsed = JSON.parse(savedDetails);
      const detailsMap = new Map<SubscriptionType, SubscriptionData>();
      Object.entries(parsed).forEach(([key, value]) => {
        detailsMap.set(key as SubscriptionType, value as SubscriptionData);
      });
      setSubscriptionDetails(detailsMap);
    }
    
    if (savedCities) {
      setSelectedCities(JSON.parse(savedCities));
    }
    
    // Reset monthly messages if it's a new month
    const today = new Date();
    const currentMonth = `${today.getFullYear()}-${today.getMonth()}`;
    if (lastResetDate !== currentMonth) {
      setMonthlyMessagesUsed(0);
      localStorage.setItem('monthlyMessagesUsed', '0');
      localStorage.setItem('lastMessageReset', currentMonth);
    } else if (savedMessages) {
      setMonthlyMessagesUsed(parseInt(savedMessages));
    }
  }, []);

  // Save subscription status to localStorage
  useEffect(() => {
    localStorage.setItem('activeSubscriptions', JSON.stringify([...activeSubscriptions]));
  }, [activeSubscriptions]);

  // Save subscription details to localStorage
  useEffect(() => {
    const detailsObj: Record<string, SubscriptionData> = {};
    subscriptionDetails.forEach((value, key) => {
      if (key) detailsObj[key] = value;
    });
    localStorage.setItem('subscriptionDetails', JSON.stringify(detailsObj));
  }, [subscriptionDetails]);

  // Save monthly messages count to localStorage
  useEffect(() => {
    localStorage.setItem('monthlyMessagesUsed', monthlyMessagesUsed.toString());
  }, [monthlyMessagesUsed]);

  // Save selected cities to localStorage
  useEffect(() => {
    localStorage.setItem('selectedCities', JSON.stringify(selectedCities));
  }, [selectedCities]);

  const hasSubscription = (type: SubscriptionType) => {
    if (!activeSubscriptions.has(type)) return false;
    
    // Check if subscription is still valid (not expired)
    const details = subscriptionDetails.get(type);
    if (details) {
      const endDate = new Date(details.endDate);
      if (endDate < new Date()) {
        return false; // Expired
      }
    }
    return true;
  };

  const getSubscriptionDetails = (type: SubscriptionType) => {
    return subscriptionDetails.get(type);
  };

  const canSendMessage = hasSubscription('cityChat') || hasSubscription('voiceMessages') || monthlyMessagesUsed < maxMonthlyMessages;
  const canShareImages = hasSubscription('voiceMessages');
  const canUseVoiceMessages = hasSubscription('voiceMessages');

  const addCity = (city: string) => {
    if (!selectedCities.includes(city)) {
      setSelectedCities(prev => [...prev, city]);
    }
  };

  const removeCity = (city: string) => {
    setSelectedCities(prev => prev.filter(c => c !== city));
  };

  const getPriceForType = (type: SubscriptionType): number => {
    switch (type) {
      case 'notifications': return 69;
      case 'cityChat': return 69;
      case 'voiceMessages': return 119;
      default: return 0;
    }
  };

  const subscribe = (type: SubscriptionType, durationMonths: number = 1) => {
    if (!type) return;
    
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + durationMonths * 30 * 24 * 60 * 60 * 1000);
    
    const subscriptionData: SubscriptionData = {
      type,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      price: getPriceForType(type),
    };
    
    setActiveSubscriptions(prev => new Set([...prev, type]));
    setSubscriptionDetails(prev => {
      const newMap = new Map(prev);
      newMap.set(type, subscriptionData);
      return newMap;
    });
    
    console.log(`Demo: User subscribed to ${type} until ${endDate.toLocaleDateString()}`);
  };

  const renewSubscription = (type: SubscriptionType) => {
    if (!type) return;
    
    const existingDetails = subscriptionDetails.get(type);
    const startDate = existingDetails && new Date(existingDetails.endDate) > new Date() 
      ? new Date(existingDetails.endDate) 
      : new Date();
    const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    const subscriptionData: SubscriptionData = {
      type,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      price: getPriceForType(type),
    };
    
    setActiveSubscriptions(prev => new Set([...prev, type]));
    setSubscriptionDetails(prev => {
      const newMap = new Map(prev);
      newMap.set(type, subscriptionData);
      return newMap;
    });
    
    console.log(`Demo: User renewed ${type} until ${endDate.toLocaleDateString()}`);
  };

  const unsubscribe = (type: SubscriptionType) => {
    if (!type) return;
    setActiveSubscriptions(prev => {
      const newSet = new Set(prev);
      newSet.delete(type);
      return newSet;
    });
    setSubscriptionDetails(prev => {
      const newMap = new Map(prev);
      newMap.delete(type);
      return newMap;
    });
    console.log(`Demo: User unsubscribed from ${type}`);
  };

  const useMessage = () => {
    if (!hasSubscription('cityChat') && !hasSubscription('voiceMessages') && monthlyMessagesUsed < maxMonthlyMessages) {
      setMonthlyMessagesUsed(prev => prev + 1);
    }
  };

  const resetMonthlyLimit = () => {
    setMonthlyMessagesUsed(0);
    const today = new Date();
    const currentMonth = `${today.getFullYear()}-${today.getMonth()}`;
    localStorage.setItem('lastMessageReset', currentMonth);
  };

  const value = {
    activeSubscriptions,
    subscriptionDetails,
    hasSubscription,
    getSubscriptionDetails,
    monthlyMessagesUsed,
    maxMonthlyMessages,
    canSendMessage,
    canShareImages,
    canUseVoiceMessages,
    selectedCities,
    addCity,
    removeCity,
    subscribe,
    unsubscribe,
    renewSubscription,
    useMessage,
    resetMonthlyLimit,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};