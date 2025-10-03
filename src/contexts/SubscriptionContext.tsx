import React, { createContext, useContext, useState, useEffect } from 'react';

export type SubscriptionType = 'notifications' | 'cityChat' | 'voiceMessages' | null;

interface SubscriptionContextType {
  activeSubscriptions: Set<SubscriptionType>;
  hasSubscription: (type: SubscriptionType) => boolean;
  dailyNotificationsUsed: number;
  maxDailyNotifications: number;
  canReceiveNotification: boolean;
  canShareImages: boolean;
  canUseVoiceMessages: boolean;
  subscribe: (type: SubscriptionType) => void;
  unsubscribe: (type: SubscriptionType) => void;
  useNotification: () => void;
  resetDailyLimit: () => void;
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
  const [dailyNotificationsUsed, setDailyNotificationsUsed] = useState<number>(0);
  const maxDailyNotifications = 2; // Free users get 2 notifications per day

  // Load subscription status from localStorage
  useEffect(() => {
    const savedSubscriptions = localStorage.getItem('activeSubscriptions');
    const savedNotifications = localStorage.getItem('dailyNotificationsUsed');
    const lastResetDate = localStorage.getItem('lastNotificationReset');
    
    if (savedSubscriptions) {
      setActiveSubscriptions(new Set(JSON.parse(savedSubscriptions)));
    }
    
    // Reset daily notifications if it's a new day
    const today = new Date().toDateString();
    if (lastResetDate !== today) {
      setDailyNotificationsUsed(0);
      localStorage.setItem('dailyNotificationsUsed', '0');
      localStorage.setItem('lastNotificationReset', today);
    } else if (savedNotifications) {
      setDailyNotificationsUsed(parseInt(savedNotifications));
    }
  }, []);

  // Save subscription status to localStorage
  useEffect(() => {
    localStorage.setItem('activeSubscriptions', JSON.stringify([...activeSubscriptions]));
  }, [activeSubscriptions]);

  // Save daily notifications count to localStorage
  useEffect(() => {
    localStorage.setItem('dailyNotificationsUsed', dailyNotificationsUsed.toString());
  }, [dailyNotificationsUsed]);

  const hasSubscription = (type: SubscriptionType) => {
    return activeSubscriptions.has(type);
  };

  const canReceiveNotification = hasSubscription('notifications') || dailyNotificationsUsed < maxDailyNotifications;
  const canShareImages = hasSubscription('cityChat');
  const canUseVoiceMessages = hasSubscription('voiceMessages');

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

  const useNotification = () => {
    if (!hasSubscription('notifications') && dailyNotificationsUsed < maxDailyNotifications) {
      setDailyNotificationsUsed(prev => prev + 1);
    }
  };

  const resetDailyLimit = () => {
    setDailyNotificationsUsed(0);
    localStorage.setItem('lastNotificationReset', new Date().toDateString());
  };

  const value = {
    activeSubscriptions,
    hasSubscription,
    dailyNotificationsUsed,
    maxDailyNotifications,
    canReceiveNotification,
    canShareImages,
    canUseVoiceMessages,
    subscribe,
    unsubscribe,
    useNotification,
    resetDailyLimit,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};