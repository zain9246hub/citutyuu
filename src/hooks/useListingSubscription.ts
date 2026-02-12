
import { useState, useCallback, useEffect } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'subscribedListings';

interface SubscribedListing {
  id: string;
  name: string;
  type: 'business' | 'restaurant';
  subscribedAt: string;
}

const getSubscribedListings = (): SubscribedListing[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveSubscribedListings = (listings: SubscribedListing[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
  } catch (error) {
    console.warn('Failed to save subscribed listings:', error);
  }
};

export const useListingSubscription = () => {
  const [subscribedListings, setSubscribedListings] = useState<SubscribedListing[]>(getSubscribedListings);
  const { addNotification } = useNotifications();
  const { toast } = useToast();

  // Sync state with localStorage
  useEffect(() => {
    saveSubscribedListings(subscribedListings);
  }, [subscribedListings]);

  const isSubscribed = useCallback((listingId: string): boolean => {
    return subscribedListings.some(l => l.id === listingId);
  }, [subscribedListings]);

  const toggleSubscription = useCallback((listingId: string, listingName: string, listingType: 'business' | 'restaurant') => {
    setSubscribedListings(prev => {
      const exists = prev.some(l => l.id === listingId);
      if (exists) {
        toast({
          title: "Unsubscribed",
          description: `You won't receive updates from ${listingName}`,
        });
        return prev.filter(l => l.id !== listingId);
      } else {
        toast({
          title: "🔔 Subscribed!",
          description: `You'll be notified when ${listingName} adds new offers or products`,
        });
        return [...prev, {
          id: listingId,
          name: listingName,
          type: listingType,
          subscribedAt: new Date().toISOString(),
        }];
      }
    });
  }, [toast]);

  // Call this when a listing adds a new product/offer to notify subscribers
  const notifySubscribers = useCallback((listingId: string, listingName: string, updateType: 'offer' | 'product', updateTitle: string) => {
    const listings = getSubscribedListings();
    const isUserSubscribed = listings.some(l => l.id === listingId);
    
    if (isUserSubscribed) {
      addNotification({
        type: 'new_deal',
        title: updateType === 'offer' ? '🎉 New Offer!' : '🆕 New Product!',
        message: `${listingName} added: "${updateTitle}". Check it out!`,
      });
    }
  }, [addNotification]);

  return {
    subscribedListings,
    isSubscribed,
    toggleSubscription,
    notifySubscribers,
  };
};
