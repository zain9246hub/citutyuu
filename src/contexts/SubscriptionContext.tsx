import React, { createContext, useContext, useState, useEffect } from 'react';

export type SubscriptionType = 'notifications' | 'cityChat' | 'voiceMessages' | null;

interface SubscriptionContextType {
  activeSubscriptions: Set<SubscriptionType>;
  hasSubscription: (type: SubscriptionType) => boolean;
  monthlyMessagesUsed: number;
  maxMonthlyMessages: number;
  canSendMessage: boolean;
  canShareImages: boolean;
  canUseVoiceMessages: boolean;
  selectedCities: string[];
  addCity: (city: string) => void;
  removeCity: (city: string) => void;
  subscribe: (type: SubscriptionType) => void;
  unsubscribe: (type: SubscriptionType) => void;
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
  const [monthlyMessagesUsed, setMonthlyMessagesUsed] = useState<number>(0);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const maxMonthlyMessages = 20; // Free users get 20 messages per month

  // Load subscription status from localStorage
  useEffect(() => {
    const savedSubscriptions = localStorage.getItem('activeSubscriptions');
    const savedMessages = localStorage.getItem('monthlyMessagesUsed');
    const savedCities = localStorage.getItem('selectedCities');
    const lastResetDate = localStorage.getItem('lastMessageReset');
    
    if (savedSubscriptions) {
      setActiveSubscriptions(new Set(JSON.parse(savedSubscriptions)));
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

  // Save monthly messages count to localStorage
  useEffect(() => {
    localStorage.setItem('monthlyMessagesUsed', monthlyMessagesUsed.toString());
  }, [monthlyMessagesUsed]);

  // Save selected cities to localStorage
  useEffect(() => {
    localStorage.setItem('selectedCities', JSON.stringify(selectedCities));
  }, [selectedCities]);

  const hasSubscription = (type: SubscriptionType) => {
    return activeSubscriptions.has(type);
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

  const subscribe = (type: SubscriptionType) => {
    if (!type) return;
    setActiveSubscriptions(prev => new Set([...prev, type]));
    console.log(`Demo: User subscribed to ${type}`);
  };

  const unsubscribe = (type: SubscriptionType) => {
    if (!type) return;
    setActiveSubscriptions(prev => {
      const newSet = new Set(prev);
      newSet.delete(type);
      return newSet;
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
    hasSubscription,
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
    useMessage,
    resetMonthlyLimit,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};