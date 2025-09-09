import React, { createContext, useContext, useState, useEffect } from 'react';

interface SubscriptionContextType {
  isSubscribed: boolean;
  dailyNotificationsUsed: number;
  maxDailyNotifications: number;
  canReceiveNotification: boolean;
  canShareImages: boolean;
  subscriptionPrice: number;
  currency: string;
  subscribe: () => void;
  unsubscribe: () => void;
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
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [dailyNotificationsUsed, setDailyNotificationsUsed] = useState<number>(0);
  const maxDailyNotifications = 2; // Free users get 2 notifications per day
  const subscriptionPrice = 99; // INR per month
  const currency = "INR";

  // Load subscription status from localStorage
  useEffect(() => {
    const savedSubscription = localStorage.getItem('demoSubscription');
    const savedNotifications = localStorage.getItem('dailyNotificationsUsed');
    const lastResetDate = localStorage.getItem('lastNotificationReset');
    
    if (savedSubscription) {
      setIsSubscribed(JSON.parse(savedSubscription));
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
    localStorage.setItem('demoSubscription', JSON.stringify(isSubscribed));
  }, [isSubscribed]);

  // Save daily notifications count to localStorage
  useEffect(() => {
    localStorage.setItem('dailyNotificationsUsed', dailyNotificationsUsed.toString());
  }, [dailyNotificationsUsed]);

  const canReceiveNotification = isSubscribed || dailyNotificationsUsed < maxDailyNotifications;
  const canShareImages = isSubscribed; // Only subscribers can share images

  const subscribe = () => {
    setIsSubscribed(true);
    // In real implementation, this would trigger Stripe checkout
    console.log('Demo: User subscribed for ₹99/month');
  };

  const unsubscribe = () => {
    setIsSubscribed(false);
    console.log('Demo: User unsubscribed');
  };

  const useNotification = () => {
    if (!isSubscribed && dailyNotificationsUsed < maxDailyNotifications) {
      setDailyNotificationsUsed(prev => prev + 1);
    }
  };

  const resetDailyLimit = () => {
    setDailyNotificationsUsed(0);
    localStorage.setItem('lastNotificationReset', new Date().toDateString());
  };

  const value = {
    isSubscribed,
    dailyNotificationsUsed,
    maxDailyNotifications,
    canReceiveNotification,
    canShareImages,
    subscriptionPrice,
    currency,
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