import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PushNotificationService } from '@/services/pushNotificationService';

export interface DealNotification {
  id: string;
  type: 'new_deal' | 'expiring_deal' | 'price_drop' | 'saved_deal_update';
  title: string;
  message: string;
  city?: string;
  dealId?: number;
  shopLocation?: string; // Shop address for map navigation
  phoneNumber?: string; // Contact phone number
  timestamp: Date;
  read: boolean;
}

export interface NotificationSettings {
  newDeals: boolean;
  expiringDeals: boolean;
  priceDrops: boolean;
  savedDealUpdates: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

interface NotificationContextType {
  notifications: DealNotification[];
  settings: NotificationSettings;
  unreadCount: number;
  addNotification: (notification: Omit<DealNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  updateSettings: (newSettings: Partial<NotificationSettings>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const defaultSettings: NotificationSettings = {
  newDeals: true,
  expiringDeals: true,
  priceDrops: true,
  savedDealUpdates: true,
  emailNotifications: false,
  pushNotifications: true,
};

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<DealNotification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const { toast } = useToast();


  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('dealNotificationSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading notification settings:', error);
      }
    }

    const savedNotifications = localStorage.getItem('dealNotifications');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        })));
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('dealNotificationSettings', JSON.stringify(settings));
  }, [settings]);

  // Save notifications to localStorage when they change
  useEffect(() => {
    localStorage.setItem('dealNotifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notification: Omit<DealNotification, 'id' | 'timestamp' | 'read'>) => {
    // Check subscription limits for notifications
    const subscriptionData = JSON.parse(localStorage.getItem('demoSubscription') || 'false');
    const dailyNotificationsUsed = parseInt(localStorage.getItem('dailyNotificationsUsed') || '0');
    const lastResetDate = localStorage.getItem('lastNotificationReset');
    const today = new Date().toDateString();
    
    // Reset daily count if it's a new day
    if (lastResetDate !== today) {
      localStorage.setItem('dailyNotificationsUsed', '0');
      localStorage.setItem('lastNotificationReset', today);
    }
    
    // Check if user can receive notification (subscribers get unlimited, free users get 2 per day)
    const currentDailyCount = lastResetDate !== today ? 0 : dailyNotificationsUsed;
    const canReceiveNotification = subscriptionData || currentDailyCount < 2;
    
    if (!canReceiveNotification) {
      // Show subscription prompt for free users who exceeded daily limit
      toast({
        title: "Daily notification limit reached",
        description: "Subscribe to get unlimited notifications for ₹99/month",
        duration: 5000,
      });
      return;
    }

    const newNotification: DealNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep only 50 notifications

    // Increment daily notification count for free users
    if (!subscriptionData) {
      const newCount = currentDailyCount + 1;
      localStorage.setItem('dailyNotificationsUsed', newCount.toString());
    }

    // Show toast if notifications are enabled
    if (settings.pushNotifications) {
      toast({
        title: notification.title,
        description: notification.message,
      });

      // Also try to send native push notification
      PushNotificationService.sendLocalNotification(
        notification.title,
        notification.message
      );
    }
  };

  // Listen for real-time deal events
  useEffect(() => {
    const handleNewDeal = (event: CustomEvent) => {
      const { deal } = event.detail;
      
      // Only show notification if user has new deals notifications enabled
      if (settings.newDeals && settings.pushNotifications) {
        addNotification({
          type: 'new_deal',
          title: `🎯 New Deal Available!`,
          message: `${deal.title} - ${deal.discount ? `${deal.discount}% off` : 'Special offer'}`,
          city: deal.city,
          dealId: deal.id,
        });
      }
    };

    window.addEventListener('newDealAdded', handleNewDeal as EventListener);
    
    return () => {
      window.removeEventListener('newDealAdded', handleNewDeal as EventListener);
    };
  }, [settings.newDeals, settings.pushNotifications, addNotification]);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      settings,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotifications,
      updateSettings,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
